<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EventAnalyticsController extends Controller
{
    public function getEventPerformance()
    {
        try {
            $events = Event::withCount(['bookings' => function ($query) {
                $query->where('status', 'confirmed');
            }])
            ->withSum(['bookings' => function ($query) {
                $query->where('payment_status', 'paid');
            }], 'total_amount')
            ->where('status', 'published')
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($event) {
                $event->occupancy_rate = $event->total_seats > 0 
                    ? round(($event->bookings_count / $event->total_seats) * 100, 2) 
                    : 0;
                
                $event->avg_ticket_price = $event->bookings_count > 0 
                    ? round(($event->bookings_sum_total_amount ?? 0) / $event->bookings_count, 2) 
                    : 0;
                
                return $event;
            });

            return response()->json([
                'events' => $events,
                'summary' => [
                    'total_events' => $events->count(),
                    'total_bookings' => $events->sum('bookings_count'),
                    'total_revenue' => $events->sum('bookings_sum_total_amount') ?? 0,
                    'avg_occupancy' => $events->avg('occupancy_rate'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch event performance data',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getRevenueAnalytics()
    {
        try {
            // Daily revenue for last 30 days
            $dailyRevenue = [];
            $dailyBookings = [];
            
            for ($i = 29; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $dailyRevenue[] = [
                    'date' => $date->format('Y-m-d'),
                    'revenue' => Booking::where('payment_status', 'paid')
                        ->whereDate('created_at', $date)
                        ->sum('total_amount') ?? 0
                ];
                
                $dailyBookings[] = [
                    'date' => $date->format('Y-m-d'),
                    'bookings' => Booking::whereDate('created_at', $date)->count()
                ];
            }

            // Monthly revenue comparison
            $currentMonth = now()->month;
            $currentYear = now()->year;
            
            $currentMonthRevenue = Booking::where('payment_status', 'paid')
                ->whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $currentMonth)
                ->sum('total_amount') ?? 0;
                
            $lastMonthRevenue = Booking::where('payment_status', 'paid')
                ->whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $currentMonth - 1)
                ->sum('total_amount') ?? 0;

            $revenueGrowth = $lastMonthRevenue > 0 
                ? round((($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 2)
                : 0;

            return response()->json([
                'daily_revenue' => $dailyRevenue,
                'daily_bookings' => $dailyBookings,
                'monthly_comparison' => [
                    'current_month' => $currentMonthRevenue,
                    'last_month' => $lastMonthRevenue,
                    'growth_percentage' => $revenueGrowth
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch revenue analytics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getUserAnalytics()
    {
        try {
            // User registration trends
            $registrationTrends = [];
            for ($i = 11; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $registrationTrends[] = [
                    'month' => $date->format('M Y'),
                    'users' => User::whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->count()
                ];
            }

            // User engagement (users with bookings)
            $totalUsers = User::count();
            $activeUsers = User::whereHas('bookings')->count();
            $premiumUsers = User::whereHas('bookings', function ($query) {
                $query->where('total_amount', '>', 100);
            })->count();

            // Top users by booking value
            $topUsers = User::withSum('bookings', 'total_amount')
                ->orderBy('bookings_sum_total_amount', 'desc')
                ->take(10)
                ->get();

            return response()->json([
                'registration_trends' => $registrationTrends,
                'user_metrics' => [
                    'total_users' => $totalUsers,
                    'active_users' => $activeUsers,
                    'premium_users' => $premiumUsers,
                    'engagement_rate' => $totalUsers > 0 ? round(($activeUsers / $totalUsers) * 100, 2) : 0
                ],
                'top_users' => $topUsers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch user analytics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getRealTimeStats()
    {
        try {
            $now = now();
            
            // Today's stats
            $todayBookings = Booking::whereDate('created_at', $now->toDateString())->count();
            $todayRevenue = Booking::where('payment_status', 'paid')
                ->whereDate('created_at', $now->toDateString())
                ->sum('total_amount') ?? 0;
            
            // This week's stats
            $weekStart = $now->startOfWeek();
            $weekEnd = $now->endOfWeek();
            
            $weekBookings = Booking::whereBetween('created_at', [$weekStart, $weekEnd])->count();
            $weekRevenue = Booking::where('payment_status', 'paid')
                ->whereBetween('created_at', [$weekStart, $weekEnd])
                ->sum('total_amount') ?? 0;
            
            // Live event status
            $liveEvents = Event::where('status', 'published')
                ->where('date', '>=', $now)
                ->where('date', '<=', $now->addDays(7))
                ->withCount(['bookings' => function ($query) {
                    $query->where('status', 'confirmed');
                }])
                ->get()
                ->map(function ($event) {
                    $event->days_until = now()->diffInDays($event->date, false);
                    $event->seats_remaining = $event->total_seats - $event->bookings_count;
                    return $event;
                });

            return response()->json([
                'today' => [
                    'bookings' => $todayBookings,
                    'revenue' => $todayRevenue
                ],
                'this_week' => [
                    'bookings' => $weekBookings,
                    'revenue' => $weekRevenue
                ],
                'live_events' => $liveEvents
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch real-time stats',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
