<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
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
        .ticket-icon {
            font-size: 48px;
            color: #17a2b8;
            margin-bottom: 20px;
        }
        .ticket-details {
            background-color: #e3f2fd;
            border: 2px solid #17a2b8;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
        .event-details {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .important-info {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #17a2b8;
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
        .ticket-number {
            font-size: 24px;
            font-weight: bold;
            color: #17a2b8;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Event Booking System</div>
            <div class="ticket-icon">🎫</div>
            <h1 style="color: #17a2b8; margin: 0;">Booking Confirmed!</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Your tickets are ready</p>
        </div>

        <p>Dear <strong>{{ $customerName }}</strong>,</p>
        
        <p>Great news! Your booking has been confirmed and your tickets are ready. Here are all the details you need:</p>

        <div class="ticket-details">
            <h2 style="margin-top: 0; color: #17a2b8;">Your Tickets</h2>
            <div class="ticket-number">{{ $bookingData['ticketCount'] }} Ticket(s)</div>
            <p><strong>Booking Reference:</strong> <span class="highlight">{{ $bookingData['bookingId'] }}</span></p>
            <p><strong>Total Paid:</strong> ${{ number_format($bookingData['totalAmount'], 2) }}</p>
        </div>

        <div class="event-details">
            <h3 style="margin-top: 0; color: #f53003;">Event Information</h3>
            <p><strong>Event:</strong> {{ $event->title }}</p>
            <p><strong>Date:</strong> {{ $event->date }}</p>
            <p><strong>Time:</strong> {{ $event->time ?? '7:00 PM' }}</p>
            <p><strong>Venue:</strong> {{ $event->venue ?? $event->location ?? 'Location TBD' }}</p>
            @if($event->category)
            <p><strong>Category:</strong> {{ $event->category }}</p>
            @endif
        </div>

        <div class="important-info">
            <h3 style="margin-top: 0; color: #856404;">Important Information</h3>
            <ul>
                <li>🎫 <strong>Bring this email or your booking ID</strong> to the event</li>
                <li>📱 <strong>Save this email</strong> for easy access to your booking details</li>
                <li>⏰ <strong>Arrive 15 minutes early</strong> to avoid any delays</li>
                <li>📧 <strong>Contact us immediately</strong> if you need to make changes</li>
            </ul>
        </div>

        <p><strong>What You Can Do Now:</strong></p>
        <ul>
            <li>📱 Download your tickets (if available)</li>
            <li>📅 Add the event to your calendar</li>
            <li>📧 Forward this email to other attendees</li>
            <li>💬 Share your excitement on social media</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/bookings') }}" class="button">View My Bookings</a>
            <a href="{{ url('/events/' . $event->id) }}" class="button">Event Details</a>
        </div>

        <p><strong>Need to Make Changes?</strong></p>
        <p>If you need to modify your booking or have any questions, please contact us:</p>
        <ul>
            <li>📧 Email: support@eventbooking.com</li>
            <li>📱 Phone: +1 (555) 123-4567</li>
            <li>💬 Live Chat: Available 24/7</li>
            <li>⏰ Response Time: Within 2 hours</li>
        </ul>

        <p><strong>Emergency Contact:</strong></p>
        <p>For urgent matters on the day of the event, call: <span class="highlight">+1 (555) 999-8888</span></p>

        <div class="footer">
            <p>We're excited to see you at the event!</p>
            <p>© {{ date('Y') }} Event Booking System. All rights reserved.</p>
            <p>This email was sent to {{ $customerEmail }}</p>
        </div>
    </div>
</body>
</html>
