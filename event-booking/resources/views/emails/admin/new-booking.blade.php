<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Notification</title>
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
        .notification-icon {
            font-size: 48px;
            color: #17a2b8;
            margin-bottom: 20px;
        }
        .booking-alert {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .customer-details {
            background-color: #f8f9fa;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .event-details {
            background-color: #e3f2fd;
            border: 1px solid #17a2b8;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .financial-summary {
            background-color: #fff3cd;
            border: 1px solid #ffc107;
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
        .urgent {
            color: #dc3545;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Event Booking System</div>
            <div class="notification-icon">🔔</div>
            <h1 style="color: #17a2b8; margin: 0;">New Booking Alert!</h1>
            <p style="color: #666; margin: 10px 0 0 0;">A new booking has been made</p>
        </div>

        <div class="booking-alert">
            <h2 style="margin-top: 0; color: #155724;">🎉 New Booking Received!</h2>
            <p>A customer has successfully made a booking and payment. Here are the details:</p>
        </div>

        <div class="customer-details">
            <h3 style="margin-top: 0; color: #f53003;">Customer Information</h3>
            <p><strong>Name:</strong> {{ $customerData['name'] }}</p>
            <p><strong>Email:</strong> {{ $customerData['email'] }}</p>
            <p><strong>Phone:</strong> {{ $customerData['phone'] ?? 'Not provided' }}</p>
            <p><strong>Booking Date:</strong> {{ $bookingData['bookingDate'] }}</p>
        </div>

        <div class="event-details">
            <h3 style="margin-top: 0; color: #17a2b8;">Event Details</h3>
            <p><strong>Event:</strong> {{ $event->title }}</p>
            <p><strong>Date:</strong> {{ $event->date }}</p>
            <p><strong>Time:</strong> {{ $event->time ?? '7:00 PM' }}</p>
            <p><strong>Venue:</strong> {{ $event->venue ?? $event->location ?? 'Location TBD' }}</p>
            @if($event->category)
            <p><strong>Category:</strong> {{ $event->category }}</p>
            @endif
        </div>

        <div class="financial-summary">
            <h3 style="margin-top: 0; color: #856404;">Financial Summary</h3>
            <p><strong>Booking ID:</strong> <span class="highlight">{{ $bookingData['bookingId'] }}</span></p>
            <p><strong>Tickets:</strong> {{ $bookingData['ticketCount'] }}</p>
            <p><strong>Total Amount:</strong> <span class="urgent">${{ number_format($bookingData['totalAmount'], 2) }}</span></p>
            <p><strong>Payment Method:</strong> {{ ucfirst($bookingData['paymentMethod']) }}</p>
            <p><strong>Payment Status:</strong> <span class="highlight">Paid</span></p>
        </div>

        <p><strong>Action Required:</strong></p>
        <ul>
            <li>✅ <strong>Verify the booking</strong> in your admin panel</li>
            <li>📧 <strong>Send welcome email</strong> to the customer (optional)</li>
            <li>🎫 <strong>Prepare tickets</strong> if physical tickets are required</li>
            <li>📊 <strong>Update your records</strong> and analytics</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/admin/bookings') }}" class="button">View Booking Details</a>
            <a href="{{ url('/admin/events/' . $event->id) }}" class="button">Event Management</a>
        </div>

        <p><strong>Quick Actions:</strong></p>
        <ul>
            <li>📱 <strong>Send SMS reminder</strong> closer to the event date</li>
            <li>📧 <strong>Follow up email</strong> with event details</li>
            <li>🎯 <strong>Upsell opportunities</strong> (additional services, merchandise)</li>
            <li>📊 <strong>Track customer engagement</strong> and satisfaction</li>
        </ul>

        <p><strong>System Information:</strong></p>
        <ul>
            <li>🕒 <strong>Time:</strong> {{ now()->format('Y-m-d H:i:s') }}</li>
            <li>🌐 <strong>Source:</strong> {{ $bookingData['paymentMethod'] }} payment</li>
            <li>📱 <strong>Device:</strong> Web browser (detected automatically)</li>
            <li>📍 <strong>Location:</strong> IP-based location tracking available</li>
        </ul>

        <div class="footer">
            <p>This is an automated notification from your Event Booking System.</p>
            <p>© {{ date('Y') }} Event Booking System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
