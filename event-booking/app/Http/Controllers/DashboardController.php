<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        try {
            $totalEvents = Event::count();
            $publishedEvents = Event::where('status', 'published')->count();
            $totalBookings = Booking::count();
            $totalRevenue = Booking::where('payment_status', 'paid')->sum('total_amount') ?? 0;
            $totalUsers = User::count();

            $recentBookings = Booking::with(['user', 'event'])
                                    ->latest()
                                    ->take(5)
                                    ->get();

            $upcomingEvents = Event::where('status', 'published')
                                  ->where('date', '>', now())
                                  ->orderBy('date', 'asc')
                                  ->take(5)
                                  ->get();

            // Monthly revenue data for charts
            $monthlyRevenue = $this->getMonthlyRevenue();
            
            // Top performing events
            $topEvents = $this->getTopEvents();
            
            // Booking trends
            $bookingTrends = $this->getBookingTrends();
            
            // User demographics
            $userStats = $this->getUserStats();

            return response()->json([
                'stats' => [
                    'total_events' => $totalEvents,
                    'published_events' => $publishedEvents,
                    'total_bookings' => $totalBookings,
                    'total_revenue' => $totalRevenue,
                    'total_users' => $totalUsers,
                    'pending_bookings' => Booking::where('status', 'pending')->count(),
                    'confirmed_bookings' => Booking::where('status', 'confirmed')->count(),
                    'cancelled_bookings' => Booking::where('status', 'cancelled')->count(),
                ],
                'recent_bookings' => $recentBookings,
                'upcoming_events' => $upcomingEvents,
                'charts' => [
                    'monthly_revenue' => $monthlyRevenue,
                    'top_events' => $topEvents,
                    'booking_trends' => $bookingTrends,
                    'user_stats' => $userStats,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch dashboard stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getMonthlyRevenue()
    {
        try {
            $months = [];
            $revenue = [];
            
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $months[] = $date->format('M Y');
                
                $monthRevenue = Booking::where('payment_status', 'paid')
                    ->whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->sum('total_amount') ?? 0;
                
                $revenue[] = round($monthRevenue, 2);
            }
            
            return [
                'labels' => $months,
                'data' => $revenue,
                'total' => array_sum($revenue)
            ];
        } catch (\Exception $e) {
            return [
                'labels' => [],
                'data' => [],
                'total' => 0
            ];
        }
    }

    public function getTopEvents()
    {
        try {
            return Event::select('events.*', DB::raw('COUNT(bookings.id) as booking_count'))
                ->leftJoin('bookings', 'events.id', '=', 'bookings.event_id')
                ->where('events.status', 'published')
                ->groupBy('events.id', 'events.title', 'events.description', 'events.image', 'events.date', 'events.venue', 'events.location', 'events.latitude', 'events.longitude', 'events.show_map', 'events.enable_ticketing', 'events.enable_rsvp', 'events.price', 'events.total_seats', 'events.available_seats', 'events.status', 'events.created_at', 'events.updated_at')
                ->orderBy('booking_count', 'desc')
                ->take(10)
                ->get()
                ->map(function ($event) {
                    $event->revenue = Booking::where('event_id', $event->id)
                        ->where('payment_status', 'paid')
                        ->sum('total_amount') ?? 0;
                    return $event;
                });
        } catch (\Exception $e) {
            return collect([]);
        }
    }

    public function getBookingTrends()
    {
        try {
            $days = [];
            $bookings = [];
            
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $days[] = $date->format('D');
                
                $dayBookings = Booking::whereDate('created_at', $date)->count();
                $bookings[] = $dayBookings;
            }
            
            return [
                'labels' => $days,
                'data' => $bookings,
                'total' => array_sum($bookings)
            ];
        } catch (\Exception $e) {
            return [
                'labels' => [],
                'data' => [],
                'total' => 0
            ];
        }
    }

    public function getUserStats()
    {
        try {
            $totalUsers = User::count();
            $activeUsers = User::whereHas('bookings', function ($query) {
                $query->where('created_at', '>=', now()->subMonths(3));
            })->count();
            
            $newUsersThisMonth = User::where('created_at', '>=', now()->startOfMonth())->count();
            
            return [
                'total_users' => $totalUsers,
                'active_users' => $activeUsers,
                'new_users_month' => $newUsersThisMonth,
                'user_growth_rate' => $totalUsers > 0 ? round(($newUsersThisMonth / $totalUsers) * 100, 2) : 0
            ];
        } catch (\Exception $e) {
            return [
                'total_users' => 0,
                'active_users' => 0,
                'new_users_month' => 0,
                'user_growth_rate' => 0
            ];
        }
    }

    public function getEventAnalytics($eventId)
    {
        try {
            $event = Event::findOrFail($eventId);
            
            $bookings = Booking::where('event_id', $eventId)->get();
            $totalBookings = $bookings->count();
            $confirmedBookings = $bookings->where('status', 'confirmed')->count();
            $totalRevenue = $bookings->where('payment_status', 'paid')->sum('total_amount') ?? 0;
            
            // Booking timeline
            $bookingTimeline = $this->getEventBookingTimeline($eventId);
            
            // User demographics for this event
            $userDemographics = $this->getEventUserDemographics($eventId);
            
            return response()->json([
                'event' => $event,
                'analytics' => [
                    'total_bookings' => $totalBookings,
                    'confirmed_bookings' => $confirmedBookings,
                    'cancelled_bookings' => $bookings->where('status', 'cancelled')->count(),
                    'total_revenue' => $totalRevenue,
                    'occupancy_rate' => $event->total_seats > 0 ? round(($confirmedBookings / $event->total_seats) * 100, 2) : 0,
                    'available_seats' => $event->available_seats,
                    'booking_timeline' => $bookingTimeline,
                    'user_demographics' => $userDemographics,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch event analytics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    protected function getEventBookingTimeline($eventId)
    {
        try {
            $days = [];
            $bookings = [];
            
            $event = Event::find($eventId);
            if (!$event) {
                return ['labels' => [], 'data' => [], 'total' => 0];
            }
            
            $eventDate = Carbon::parse($event->date);
            
            // Get bookings for 30 days before event
            for ($i = 30; $i >= 0; $i--) {
                $date = $eventDate->copy()->subDays($i);
                $days[] = $date->format('M d');
                
                $dayBookings = Booking::where('event_id', $eventId)
                    ->whereDate('created_at', $date)
                    ->count();
                $bookings[] = $dayBookings;
            }
            
            return [
                'labels' => $days,
                'data' => $bookings,
                'total' => array_sum($bookings)
            ];
        } catch (\Exception $e) {
            return ['labels' => [], 'data' => [], 'total' => 0];
        }
    }

    protected function getEventUserDemographics($eventId)
    {
        try {
            $users = User::whereHas('bookings', function ($query) use ($eventId) {
                $query->where('event_id', $eventId);
            })->get();
            
            $totalUsers = $users->count();
            
            return [
                'total_users' => $totalUsers,
                'new_users' => $users->where('created_at', '>=', now()->subMonths(1))->count(),
                'returning_users' => $users->where('created_at', '<', now()->subMonths(1))->count(),
            ];
        } catch (\Exception $e) {
            return [
                'total_users' => 0,
                'new_users' => 0,
                'returning_users' => 0,
            ];
        }
    }
}
