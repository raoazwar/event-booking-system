<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Event;
use App\Models\User;
use App\Services\PaymentService;
use App\Mail\TicketMailable;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class BookingService
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function createBooking(array $data, User $user): Booking
    {
        $event = Event::findOrFail($data['event_id']);
        
        // Check if event has available seats
        if ($event->available_seats < $data['ticket_count']) {
            throw new \Exception('Not enough available seats for this event');
        }
        
        // Create booking
        $booking = Booking::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'ticket_count' => $data['ticket_count'],
            'total_amount' => $event->price * $data['ticket_count'],
            'booking_reference' => 'BK-' . Str::random(8),
            'status' => 'pending',
            'payment_status' => 'pending'
        ]);
        
        // Generate simple QR code data (text representation for now)
        $qrCodeData = $this->generateSimpleQRData($booking);
        $booking->update(['qr_code' => $qrCodeData]);
        
        // Process payment
        $paymentSuccess = $this->paymentService->processPayment($booking);
        
        if ($paymentSuccess) {
            // Update event available seats
            $event->decrement('available_seats', $data['ticket_count']);
            $booking->update(['status' => 'confirmed']);
            
            // Send ticket email
            $this->sendTicketEmail($booking);
        }
        
        return $booking->fresh();
    }
    
    public function cancelBooking(Booking $booking): bool
    {
        $event = $booking->event;
        
        // Update event available seats
        $event->increment('available_seats', $booking->ticket_count);
        
        // Cancel booking
        $booking->update(['status' => 'cancelled']);
        
        // Process refund
        $this->paymentService->refundPayment($booking);
        
        return true;
    }
    
    protected function generateSimpleQRData(Booking $booking): string
    {
        // Create a simple text representation of QR data
        // In a production app, you'd generate actual QR code images
        $qrData = [
            'booking_id' => $booking->id,
            'booking_reference' => $booking->booking_reference,
            'event_title' => $booking->event->title,
            'user_name' => $booking->user->name,
            'ticket_count' => $booking->ticket_count,
            'event_date' => $booking->event->date
        ];
        
        return 'QR:' . base64_encode(json_encode($qrData));
    }
    
    protected function sendTicketEmail(Booking $booking): void
    {
        try {
            Mail::to($booking->user->email)->send(new TicketMailable($booking));
        } catch (\Exception $e) {
            // Log email sending error but don't fail the booking
            \Log::error('Failed to send ticket email: ' . $e->getMessage());
        }
    }
}
