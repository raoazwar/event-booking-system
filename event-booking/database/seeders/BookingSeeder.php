<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\User;
use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get existing users and events
        $users = User::where('role', 'user')->get();
        $events = Event::where('status', 'published')->get();
        
        if ($users->isEmpty() || $events->isEmpty()) {
            return;
        }
        
        // Create sample bookings
        foreach ($users as $user) {
            foreach ($events->take(2) as $event) {
                // Randomly decide if user books this event
                if (rand(0, 1)) {
                    $ticketCount = rand(1, 3);
                    $totalAmount = $event->price * $ticketCount;
                    
                    Booking::create([
                        'user_id' => $user->id,
                        'event_id' => $event->id,
                        'ticket_count' => $ticketCount,
                        'total_amount' => $totalAmount,
                        'booking_reference' => 'BK-' . strtoupper(substr(md5(uniqid()), 0, 8)),
                        'status' => 'confirmed',
                        'payment_status' => 'paid',
                        'qr_code' => null, // Will be generated when accessed
                    ]);
                    
                    // Update event available seats
                    $event->decrement('available_seats', $ticketCount);
                }
            }
        }
    }
}
