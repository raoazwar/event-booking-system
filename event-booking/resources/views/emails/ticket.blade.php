<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Event Ticket</title>
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
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
        }
        .ticket-info {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .ticket-info h2 {
            color: #007bff;
            margin-top: 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        .info-label {
            font-weight: bold;
            color: #495057;
        }
        .info-value {
            color: #212529;
        }
        .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background-color: #e9ecef;
            border-radius: 8px;
        }
        .qr-section h3 {
            color: #007bff;
            margin-bottom: 15px;
        }
        .qr-code {
            max-width: 200px;
            border: 3px solid #007bff;
            border-radius: 8px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #6c757d;
            font-size: 14px;
        }
        .important {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎫 Your Event Ticket</h1>
            <p>Thank you for your booking!</p>
        </div>

        <div class="ticket-info">
            <h2>Event Details</h2>
            <div class="info-row">
                <span class="info-label">Event:</span>
                <span class="info-value">{{ $booking->event->title }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date & Time:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($booking->event->date)->format('F j, Y \a\t g:i A') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Venue:</span>
                <span class="info-value">{{ $booking->event->venue }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Tickets:</span>
                <span class="info-value">{{ $booking->ticket_count }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Total Amount:</span>
                <span class="info-value">${{ number_format($booking->total_amount, 2) }}</span>
            </div>
        </div>

        <div class="ticket-info">
            <h2>Booking Information</h2>
            <div class="info-row">
                <span class="info-label">Booking Reference:</span>
                <span class="info-value">{{ $booking->booking_reference }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">
                    <span style="color: #28a745; font-weight: bold;">{{ ucfirst($booking->status) }}</span>
                </span>
            </div>
            <div class="info-row">
                <span class="info-label">Payment Status:</span>
                <span class="info-value">
                    <span style="color: #28a745; font-weight: bold;">{{ ucfirst($booking->payment_status) }}</span>
                </span>
            </div>
        </div>

        <div class="qr-section">
            <h3>📱 Your QR Code Data</h3>
            <p>Present this data at the event entrance for quick check-in.</p>
            @if($booking->qr_code)
                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px; word-break: break-all;">
                    {{ $booking->qr_code }}
                </div>
                <p style="margin-top: 10px; font-size: 14px; color: #6c757d;">
                    <strong>Note:</strong> This is a text representation of your QR code data. 
                    Event staff will scan this information for check-in.
                </p>
            @else
                <p style="color: #dc3545;">QR Code data not available</p>
            @endif
        </div>

        <div class="important">
            <strong>⚠️ Important:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Please arrive 15 minutes before the event starts</li>
                <li>Bring a valid ID for verification</li>
                <li>This ticket is non-transferable</li>
                <li>Keep this email safe - you'll need it for entry</li>
            </ul>
        </div>

        <div class="footer">
            <p>If you have any questions, please contact our support team.</p>
            <p>Thank you for choosing our events!</p>
        </div>
    </div>
</body>
</html>
