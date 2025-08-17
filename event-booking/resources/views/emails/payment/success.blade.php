<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful</title>
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
        .success-icon {
            font-size: 48px;
            color: #28a745;
            margin-bottom: 20px;
        }
        .event-details {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .booking-summary {
            background-color: #e8f5e8;
            border: 1px solid #28a745;
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
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Event Booking System</div>
            <div class="success-icon">🎉</div>
            <h1 style="color: #28a745; margin: 0;">Payment Successful!</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Your payment has been processed successfully</p>
        </div>

        <p>Dear <strong>{{ $customerName }}</strong>,</p>
        
        <p>Thank you for your payment! Your booking has been confirmed and your tickets are secure.</p>

        <div class="event-details">
            <h3 style="margin-top: 0; color: #f53003;">Event Details</h3>
            <p><strong>Event:</strong> {{ $event->title }}</p>
            <p><strong>Date:</strong> {{ $event->date }}</p>
            <p><strong>Time:</strong> {{ $event->time ?? '7:00 PM' }}</p>
            <p><strong>Venue:</strong> {{ $event->venue ?? $event->location ?? 'Location TBD' }}</p>
        </div>

        <div class="booking-summary">
            <h3 style="margin-top: 0; color: #28a745;">Booking Summary</h3>
            <p><strong>Booking ID:</strong> <span class="highlight">{{ $bookingData['bookingId'] }}</span></p>
            <p><strong>Tickets:</strong> {{ $bookingData['ticketCount'] }}</p>
            <p><strong>Total Amount:</strong> ${{ number_format($bookingData['totalAmount'], 2) }}</p>
            <p><strong>Payment Method:</strong> {{ ucfirst($bookingData['paymentMethod']) }}</p>
            <p><strong>Booking Date:</strong> {{ $bookingData['bookingDate'] }}</p>
        </div>

        <p><strong>What's Next?</strong></p>
        <ul>
            <li>✅ Your booking is confirmed and secure</li>
            <li>📧 You'll receive a separate booking confirmation email</li>
            <li>🎫 Tickets will be available for download</li>
            <li>📱 You can view your bookings in your profile</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/') }}" class="button">View Event Details</a>
            <a href="{{ url('/bookings') }}" class="button">View My Bookings</a>
        </div>

        <p><strong>Need Help?</strong></p>
        <p>If you have any questions about your booking, please don't hesitate to contact our support team:</p>
        <ul>
            <li>📧 Email: support@eventbooking.com</li>
            <li>📱 Phone: +1 (555) 123-4567</li>
            <li>💬 Live Chat: Available 24/7</li>
        </ul>

        <div class="footer">
            <p>Thank you for choosing Event Booking System!</p>
            <p>© {{ date('Y') }} Event Booking System. All rights reserved.</p>
            <p>This email was sent to {{ $customerEmail }}</p>
        </div>
    </div>
</body>
</html>
