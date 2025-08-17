<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #f53003;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #f53003;
            margin-bottom: 10px;
        }
        .failure-icon {
            font-size: 48px;
            color: #dc3545;
            margin-bottom: 20px;
        }
        .failure-notice {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .event-details {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .error-details {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .next-steps {
            background-color: #e3f2fd;
            border: 1px solid #17a2b8;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #f53003;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 5px;
        }
        .button-secondary {
            display: inline-block;
            background-color: #6c757d;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 5px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .highlight {
            color: #f53003;
            font-weight: bold;
        }
        .important {
            color: #dc3545;
            font-weight: bold;
        }
        .success {
            color: #28a745;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Event Booking System</div>
            <div class="failure-icon">❌</div>
            <h1 style="color: #dc3545; margin: 0;">Payment Failed</h1>
            <p style="color: #666; margin: 10px 0 0 0;">We couldn't process your payment</p>
        </div>

        <p>Dear <strong>{{ $customerName }}</strong>,</p>
        
        <div class="failure-notice">
            <h2 style="margin-top: 0; color: #721c24;">Payment Processing Error</h2>
            <p>We encountered an issue while processing your payment for the event. <strong>No charges were made to your account.</strong></p>
        </div>

        <div class="event-details">
            <h3 style="margin-top: 0; color: #f53003;">Event Details</h3>
            <p><strong>Event:</strong> {{ $event->title }}</p>
            <p><strong>Date:</strong> {{ $event->date }}</p>
            <p><strong>Time:</strong> {{ $event->time ?? '7:00 PM' }}</p>
            <p><strong>Venue:</strong> {{ $event->venue ?? $event->location ?? 'Location TBD' }}</p>
        </div>

        <div class="error-details">
            <h3 style="margin-top: 0; color: #856404;">Error Information</h3>
            <p><strong>Error Type:</strong> {{ $errorDetails['step'] ?? 'Payment Processing' }}</p>
            <p><strong>Error Details:</strong> {{ $errorDetails['error'] ?? 'Unknown error occurred' }}</p>
            <p><strong>Time:</strong> {{ now()->format('Y-m-d H:i:s') }}</p>
        </div>

        <p><strong>What This Means:</strong></p>
        <ul>
            <li>❌ <strong>Payment was not processed</strong> - your account was not charged</li>
            <li>❌ <strong>No tickets were issued</strong> - your booking is not confirmed</li>
            <li>❌ <strong>No reservation was made</strong> - seats are not held for you</li>
            <li>✅ <strong>You can try again</strong> - the event is still available</li>
        </ul>

        <div class="next-steps">
            <h3 style="margin-top: 0; color: #17a2b8;">How to Resolve This</h3>
            
            <p><strong>Step 1: Check Your Information</strong></p>
            <ul>
                <li>Verify your payment method details</li>
                <li>Ensure you have sufficient funds</li>
                <li>Check if your card is not expired</li>
                <li>Confirm your billing address</li>
            </ul>
            
            <p><strong>Step 2: Try Again</strong></p>
            <ul>
                <li>Return to the event page</li>
                <li>Select your tickets again</li>
                <li>Use a different payment method if needed</li>
                <li>Complete the payment process</li>
            </ul>
            
            <p><strong>Step 3: Contact Support (if needed)</strong></p>
            <ul>
                <li>Get help with payment issues</li>
                <li>Request alternative payment methods</li>
                <li>Get assistance with your booking</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/events/' . $event->id) }}" class="button">Try Payment Again</a>
            <a href="{{ url('/contact') }}" class="button-secondary">Contact Support</a>
        </div>

        <p><strong>Common Payment Issues & Solutions:</strong></p>
        <ul>
            <li>💳 <strong>Card Declined:</strong> Check with your bank or try a different card</li>
            <li>💰 <strong>Insufficient Funds:</strong> Ensure your account has enough money</li>
            <li>📅 <strong>Expired Card:</strong> Update your card information</li>
            <li>🌐 <strong>Network Issues:</strong> Check your internet connection</li>
            <li>🔒 <strong>Security Block:</strong> Your bank may have blocked the transaction</li>
        </ul>

        <p><strong>Alternative Payment Methods:</strong></p>
        <ul>
            <li>💳 <strong>Credit/Debit Cards:</strong> Visa, Mastercard, American Express</li>
            <li>📱 <strong>Digital Wallets:</strong> PayPal, Apple Pay, Google Pay</li>
            <li>🏦 <strong>Bank Transfer:</strong> Direct bank payment (if available)</li>
            <li>💵 <strong>Cash Payment:</strong> Pay at our office (if available)</li>
        </ul>

        <p><strong>Need Immediate Help?</strong></p>
        <p>Our support team is here to assist you:</p>
        <ul>
            <li>📧 Email: support@eventbooking.com</li>
            <li>📱 Phone: +1 (555) 123-4567</li>
            <li>💬 Live Chat: Available 24/7</li>
            <li>⏰ Response Time: Within 2 hours</li>
        </ul>

        <p><strong>Important Reminder:</strong></p>
        <p><span class="important">Event availability is not guaranteed.</span> Popular events may sell out quickly, so we recommend resolving the payment issue and completing your booking as soon as possible.</p>

        <p><strong>We're Here to Help!</strong></p>
        <p>Don't worry - payment issues are common and usually easy to resolve. Our team is experienced in helping customers complete their bookings successfully.</p>

        <div class="footer">
            <p>We hope to see you at the event!</p>
            <p>© {{ date('Y') }} Event Booking System. All rights reserved.</p>
            <p>This email was sent to {{ $customerEmail }}</p>
        </div>
    </div>
</body>
</html>
