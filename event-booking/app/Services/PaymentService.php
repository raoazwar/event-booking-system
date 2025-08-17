<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function processPayment(Booking $booking): bool
    {
        // Simulate payment processing with realistic delays
        // In a real application, this would integrate with payment gateways like Stripe, PayPal, etc.
        
        try {
            // Simulate payment gateway communication
            $paymentSuccess = $this->simulatePaymentGateway($booking);
            
            if ($paymentSuccess) {
                $booking->update([
                    'payment_status' => 'paid',
                    'status' => 'confirmed'
                ]);
                
                Log::info("Payment processed successfully for booking {$booking->id}");
                return true;
            } else {
                $booking->update(['payment_status' => 'failed']);
                Log::warning("Payment failed for booking {$booking->id}");
                return false;
            }
        } catch (\Exception $e) {
            $booking->update(['payment_status' => 'failed']);
            Log::error("Payment processing error for booking {$booking->id}: " . $e->getMessage());
            return false;
        }
    }
    
    public function refundPayment(Booking $booking): bool
    {
        // Simulate refund processing
        try {
            // Simulate refund gateway communication
            $refundSuccess = $this->simulateRefundGateway($booking);
            
            if ($refundSuccess) {
                $booking->update(['payment_status' => 'refunded']);
                Log::info("Refund processed successfully for booking {$booking->id}");
                return true;
            } else {
                Log::warning("Refund failed for booking {$booking->id}");
                return false;
            }
        } catch (\Exception $e) {
            Log::error("Refund processing error for booking {$booking->id}: " . $e->getMessage());
            return false;
        }
    }
    
    protected function simulatePaymentGateway(Booking $booking): bool
    {
        // Simulate payment gateway response
        // In reality, this would be an API call to Stripe, PayPal, etc.
        
        // Simulate 95% success rate for demo purposes
        $successRate = 0.95;
        
        // Add some randomness to make it more realistic
        $random = mt_rand(1, 100) / 100;
        
        return $random <= $successRate;
    }
    
    protected function simulateRefundGateway(Booking $booking): bool
    {
        // Simulate refund gateway response
        // In reality, this would be an API call to process refunds
        
        // Simulate 98% success rate for refunds
        $successRate = 0.98;
        
        $random = mt_rand(1, 100) / 100;
        
        return $random <= $successRate;
    }
}
