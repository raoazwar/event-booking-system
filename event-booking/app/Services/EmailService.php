<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\View;

class EmailService
{
    /**
     * Send payment success email
     */
    public function sendPaymentSuccessEmail($customerEmail, $customerName, $event, $bookingData)
    {
        try {
            $data = [
                'customerName' => $customerName,
                'event' => $event,
                'bookingData' => $bookingData,
                'subject' => 'Payment Successful - ' . $event->title
            ];

            Mail::send('emails.payment.success', $data, function ($message) use ($data, $customerEmail) {
                $message->to($customerEmail)
                        ->subject($data['subject']);
            });

            Log::info('Payment success email sent', [
                'email' => $customerEmail,
                'event' => $event->title,
                'booking_id' => $bookingData['bookingId']
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send payment success email', [
                'error' => $e->getMessage(),
                'email' => $customerEmail
            ]);
            return false;
        }
    }

    /**
     * Send payment failure email
     */
    public function sendPaymentFailureEmail($customerEmail, $customerName, $event, $errorDetails)
    {
        try {
            $data = [
                'customerName' => $customerName,
                'event' => $event,
                'errorDetails' => $errorDetails,
                'subject' => 'Payment Failed - ' . $event->title
            ];

            Mail::send('emails.payment.failure', $data, function ($message) use ($data, $customerEmail) {
                $message->to($customerEmail)
                        ->subject($data['subject']);
            });

            Log::info('Payment failure email sent', [
                'email' => $customerEmail,
                'event' => $event->title
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send payment failure email', [
                'error' => $e->getMessage(),
                'email' => $customerEmail
            ]);
            return false;
        }
    }

    /**
     * Send payment cancellation email
     */
    public function sendPaymentCancellationEmail($customerEmail, $customerName, $event)
    {
        try {
            $data = [
                'customerName' => $customerName,
                'event' => $event,
                'subject' => 'Payment Cancelled - ' . $event->title
            ];

            Mail::send('emails.payment.cancelled', $data, function ($message) use ($data, $customerEmail) {
                $message->to($customerEmail)
                        ->subject($data['subject']);
            });

            Log::info('Payment cancellation email sent', [
                'email' => $customerEmail,
                'event' => $event->title
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send payment cancellation email', [
                'error' => $e->getMessage(),
                'email' => $customerEmail
            ]);
            return false;
        }
    }

    /**
     * Send booking confirmation email
     */
    public function sendBookingConfirmationEmail($customerEmail, $customerName, $event, $bookingData)
    {
        try {
            $data = [
                'customerName' => $customerName,
                'event' => $event,
                'bookingData' => $bookingData,
                'subject' => 'Booking Confirmed - ' . $event->title
            ];

            Mail::send('emails.booking.confirmation', $data, function ($message) use ($data, $customerEmail) {
                $message->to($customerEmail)
                        ->subject($data['subject']);
            });

            Log::info('Booking confirmation email sent', [
                'email' => $customerEmail,
                'event' => $event->title,
                'booking_id' => $bookingData['bookingId']
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send booking confirmation email', [
                'error' => $e->getMessage(),
                'email' => $customerEmail
            ]);
            return false;
        }
    }

    /**
     * Send admin notification email
     */
    public function sendAdminNotificationEmail($event, $bookingData, $customerData)
    {
        try {
            $adminEmail = config('mail.admin_email', 'admin@eventbooking.com');
            
            $data = [
                'event' => $event,
                'bookingData' => $bookingData,
                'customerData' => $customerData,
                'subject' => 'New Booking - ' . $event->title
            ];

            Mail::send('emails.admin.new-booking', $data, function ($message) use ($data, $adminEmail) {
                $message->to($adminEmail)
                        ->subject($data['subject']);
            });

            Log::info('Admin notification email sent', [
                'admin_email' => $adminEmail,
                'event' => $event->title,
                'booking_id' => $bookingData['bookingId']
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send admin notification email', [
                'error' => $e->getMessage(),
                'event' => $event->title
            ]);
            return false;
        }
    }

    /**
     * Send payment reminder email
     */
    public function sendPaymentReminderEmail($customerEmail, $customerName, $event, $bookingData)
    {
        try {
            $data = [
                'customerName' => $customerName,
                'event' => $event,
                'bookingData' => $bookingData,
                'subject' => 'Payment Reminder - ' . $event->title
            ];

            Mail::send('emails.payment.reminder', $data, function ($message) use ($data, $customerEmail) {
                $message->to($customerEmail)
                        ->subject($data['subject']);
            });

            Log::info('Payment reminder email sent', [
                'email' => $customerEmail,
                'event' => $event->title
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send payment reminder email', [
                'error' => $e->getMessage(),
                'email' => $customerEmail
            ]);
            return false;
        }
    }
}
