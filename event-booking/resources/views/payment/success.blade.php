<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Payment Successful - Event Booking</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    
    <!-- Styles / Scripts -->
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script src="https://cdn.tailwindcss.com"></script>
    @endif
    
    <!-- PDF Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body class="bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] min-h-screen">
    <!-- Header -->
    <header class="w-full lg:max-w-4xl max-w-[335px] mx-auto text-sm p-6 lg:p-8">
        <nav class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-[#f53003] dark:bg-[#FF4433] rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-sm">E</span>
                </div>
                <span class="font-semibold text-lg">Event Booking</span>
            </div>
            <a href="/" class="inline-block px-5 py-1.5 dark:text-[#EDEDEC] border-[#19140035] hover:border-[#1915014a] border text-[#1b1b18] dark:border-[#3E3E3A] dark:hover:border-[#62605b] rounded-sm text-sm leading-normal">
                Return Home
            </a>
        </nav>
    </header>

    <!-- Main Content -->
    <main class="flex items-center justify-center w-full transition-opacity opacity-100 duration-750 lg:grow">
        <div class="max-w-[335px] w-full lg:max-w-4xl">
            <!-- Success Card -->
            <div class="bg-white dark:bg-[#161615] dark:text-[#EDEDEC] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d] rounded-lg p-6 lg:p-8">
                <!-- Success Header -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                        <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 class="text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-2">🎉 Payment Successful!</h1>
                    <p class="text-lg text-[#706f6c] dark:text-[#A1A09A]">Your tickets have been booked successfully</p>
                    
                    @if($gateway === 'stripe')
                    <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p class="text-sm text-blue-700 dark:text-blue-300">
                            <svg class="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <strong>Stripe Payment:</strong> Your booking details are being processed. You'll receive a confirmation email shortly with your complete booking information.
                        </p>
                    </div>
                    @endif
                </div>

                <!-- Event Details Header -->
                <div class="bg-gradient-to-r from-[#f53003] to-[#FF4433] text-white p-6 rounded-lg mb-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl font-bold" id="eventTitle">Event Title</h2>
                            <p class="text-red-100 mt-1" id="eventDate">Event Date</p>
                            <p class="text-red-100" id="eventLocation">Event Location</p>
                        </div>
                        <div class="text-right">
                            <div class="text-3xl font-bold" id="totalAmount">$0.00</div>
                            <p class="text-red-100">Total Paid</p>
                        </div>
                    </div>
                </div>

                <!-- Booking Details Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Left Column -->
                    <div class="space-y-6">
                        <!-- Booking Information -->
                        <div>
                            <h3 class="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-3 flex items-center">
                                <svg class="w-5 h-5 text-[#f53003] dark:text-[#FF4433] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
                                </svg>
                                Booking Information
                            </h3>
                            <div class="bg-[#FDFDFC] dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg p-4 space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Booking ID:</span>
                                    <span class="font-mono font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="bookingId">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Tickets:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="ticketCount">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Payment Method:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC] capitalize" id="paymentMethod">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Status:</span>
                                    <span class="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs font-medium rounded-full">Confirmed</span>
                                </div>
                            </div>
                        </div>

                        <!-- Customer Details -->
                        <div>
                            <h3 class="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-3 flex items-center">
                                <svg class="w-5 h-5 text-[#f53003] dark:text-[#FF4433] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Customer Details
                            </h3>
                            <div class="bg-[#FDFDFC] dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg p-4 space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Name:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="customerName">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Email:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="customerEmail">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Phone:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="customerPhone">-</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column -->
                    <div class="space-y-6">
                        <!-- Payment Summary -->
                        <div>
                            <h3 class="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-3 flex items-center">
                                <svg class="w-5 h-5 text-[#f53003] dark:text-[#FF4433] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Payment Summary
                            </h3>
                            <div class="bg-[#FDFDFC] dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg p-4 space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Subtotal:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="subtotal">$0.00</span>
                                </div>
                                <div id="taxRow" class="hidden">
                                    <div class="flex justify-between">
                                        <span class="text-[#706f6c] dark:text-[#A1A09A]">Tax:</span>
                                        <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="tax">$0.00</span>
                                    </div>
                                </div>
                                <div class="border-t border-[#e3e3e0] dark:border-[#3E3E3A] pt-3">
                                    <div class="flex justify-between">
                                        <span class="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Total:</span>
                                        <span class="text-lg font-bold text-[#f53003] dark:text-[#FF4433]" id="totalAmount2">$0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Event Details -->
                        <div>
                            <h3 class="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-3 flex items-center">
                                <svg class="w-5 h-5 text-[#f53003] dark:text-[#FF4433] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Event Details
                            </h3>
                            <div class="bg-[#FDFDFC] dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg p-4 space-y-3">
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Date:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="eventDate2">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Time:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="eventTime">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Venue:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="eventVenue">-</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-[#706f6c] dark:text-[#A1A09A]">Category:</span>
                                    <span class="font-medium text-[#1b1b18] dark:text-[#EDEDEC]" id="eventCategory">-</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <button onclick="downloadPDF()" class="inline-flex items-center px-6 py-3 bg-[#f53003] dark:bg-[#FF4433] text-white font-medium rounded-lg hover:bg-[#d42a02] dark:hover:bg-[#e6392e] transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Download Invoice (PDF)
                    </button>
                    <button onclick="emailInvoice()" class="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        Email Invoice
                    </button>
                    <button onclick="shareEvent()" class="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                        </svg>
                        Share Event
                    </button>
                </div>

                <!-- Additional Info -->
                <div class="text-center">
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
                        <h3 class="font-semibold text-blue-900 dark:text-blue-300 mb-2">What's Next?</h3>
                        <div class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <p>✅ Your booking is confirmed and secure</p>
                            <p>📧 Check your email for detailed information</p>
                            <p>📱 You can view your bookings in your profile</p>
                            <p>🎫 Tickets will be available for download</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="w-full lg:max-w-4xl max-w-[335px] mx-auto text-sm p-6 lg:p-8 text-center">
        <p class="text-[#706f6c] dark:text-[#A1A09A]">© 2024 Event Booking System. All rights reserved.</p>
    </footer>

    <script>
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        // Extract data from URL or use defaults
        const eventData = {
            title: '{{ $event->title ?? "Food & Wine Festival" }}',
            date: '{{ $event->date ?? "December 25, 2024" }}',
            time: '{{ $event->time ?? "7:00 PM" }}',
            location: '{{ $event->location ?? "Downtown Convention Center" }}',
            venue: '{{ $event->venue ?? "Main Hall" }}',
            category: '{{ $event->category ?? "Food & Entertainment" }}',
            ticketCount: '{{ $ticketCount ?? "1" }}',
            subtotal: '{{ isset($subtotal) ? number_format($subtotal, 2) : "0.00" }}',
            tax: '{{ isset($tax) ? number_format($tax, 2) : "0.00" }}',
            total: '{{ isset($total) ? number_format($total, 2) : "0.00" }}',
            bookingId: '{{ $bookingId ?? "Processing..." }}',
            paymentMethod: '{{ $gateway ?? "paypal" }}',
            customerName: '{{ $customerName ?? "John Doe" }}',
            customerEmail: '{{ $customerEmail ?? "john@example.com" }}',
            customerPhone: '{{ $customerPhone ?? "+1 (555) 123-4567" }}'
        };

        // Populate the page with data safely
        function safeSetTextContent(elementId, text) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = text;
            }
        }

        safeSetTextContent('eventTitle', eventData.title);
        safeSetTextContent('eventDate', eventData.date);
        safeSetTextContent('eventLocation', eventData.location);
        safeSetTextContent('totalAmount', '$' + eventData.total);
        safeSetTextContent('totalAmount2', '$' + eventData.total);
        safeSetTextContent('subtotal', '$' + eventData.subtotal);
        
        // Show/hide tax based on value
        const taxRow = document.getElementById('taxRow');
        const taxValue = parseFloat(eventData.tax);
        if (taxRow) {
            if (taxValue > 0) {
                safeSetTextContent('tax', '$' + eventData.tax);
                taxRow.classList.remove('hidden');
            } else {
                taxRow.classList.add('hidden');
            }
        }
        
        safeSetTextContent('ticketCount', eventData.ticketCount + ' ticket(s)');
        safeSetTextContent('paymentMethod', eventData.paymentMethod);
        safeSetTextContent('bookingId', eventData.bookingId);
        safeSetTextContent('customerName', eventData.customerName);
        safeSetTextContent('customerEmail', eventData.customerEmail);
        safeSetTextContent('customerPhone', eventData.customerPhone);
        safeSetTextContent('eventDate2', eventData.date);
        safeSetTextContent('eventTime', eventData.time);
        safeSetTextContent('eventVenue', eventData.venue);
        safeSetTextContent('eventCategory', eventData.category);

        // Download PDF Invoice
        function downloadPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Add company logo/header
            doc.setFontSize(20);
            doc.setTextColor(245, 48, 3); // Brand color
            doc.text('Event Booking System', 105, 20, { align: 'center' });
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('INVOICE', 105, 35, { align: 'center' });
            
            // Invoice details
            doc.setFontSize(10);
            doc.text('Invoice Date: ' + new Date().toLocaleDateString(), 20, 50);
            doc.text('Invoice #: ' + eventData.bookingId, 20, 60);
            
            // Event details
            doc.setFontSize(14);
            doc.setTextColor(245, 48, 3);
            doc.text('Event Details', 20, 80);
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('Event: ' + eventData.title, 20, 95);
            doc.text('Date: ' + eventData.date, 20, 105);
            doc.text('Time: ' + eventData.time, 20, 115);
            doc.text('Venue: ' + eventData.venue, 20, 125);
            
            // Customer details
            doc.setFontSize(14);
            doc.setTextColor(245, 48, 3);
            doc.text('Customer Information', 20, 150);
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('Name: ' + eventData.customerName, 20, 165);
            doc.text('Email: ' + eventData.customerEmail, 20, 175);
            doc.text('Phone: ' + eventData.customerPhone, 20, 185);
            
            // Payment summary
            doc.setFontSize(14);
            doc.setTextColor(245, 48, 3);
            doc.text('Payment Summary', 20, 210);
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text('Tickets: ' + eventData.ticketCount + ' × $' + (parseFloat(eventData.subtotal) / parseInt(eventData.ticketCount)).toFixed(2), 20, 225);
            doc.text('Subtotal: $' + eventData.subtotal, 20, 235);
            
            let yPosition = 245;
            if (parseFloat(eventData.tax) > 0) {
                doc.text('Tax: $' + eventData.tax, 20, yPosition);
                yPosition += 10;
            }
            
            doc.text('Total: $' + eventData.total, 20, yPosition);
            
            // Footer
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text('Thank you for your purchase!', 105, 280, { align: 'center' });
            
            // Save the PDF
            doc.save('invoice-' + eventData.bookingId + '.pdf');
        }

        // Email Invoice
        function emailInvoice() {
            const subject = encodeURIComponent('Invoice for ' + eventData.title);
            const body = encodeURIComponent(
                'Hi ' + eventData.customerName + ',\n\n' +
                'Thank you for your purchase! Here are your booking details:\n\n' +
                'Event: ' + eventData.title + '\n' +
                'Date: ' + eventData.date + '\n' +
                'Tickets: ' + eventData.ticketCount + '\n' +
                'Total: $' + eventData.total + '\n\n' +
                'Your booking ID is: ' + eventData.bookingId + '\n\n' +
                'Best regards,\nEvent Booking System'
            );
            
            window.open('mailto:' + eventData.customerEmail + '?subject=' + subject + '&body=' + body);
        }

        // Share Event
        function shareEvent() {
            if (navigator.share) {
                navigator.share({
                    title: 'I just booked tickets for ' + eventData.title + '!',
                    text: 'Check out this amazing event: ' + eventData.title,
                    url: window.location.origin
                });
            } else {
                // Fallback: copy to clipboard
                const shareText = 'I just booked tickets for ' + eventData.title + '! Check it out: ' + window.location.origin;
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Share text copied to clipboard!');
                });
            }
        }

        // Auto-close after 30 seconds (optional)
        setTimeout(() => {
            console.log('Payment success page loaded successfully.');
        }, 1000);
    </script>
</body>
</html>
