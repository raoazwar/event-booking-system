<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Payment Cancelled - Event Booking</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    
    <!-- Styles / Scripts -->
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script src="https://cdn.tailwindcss.com"></script>
    @endif
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
            <!-- Cancel Card -->
            <div class="bg-white dark:bg-[#161615] dark:text-[#EDEDEC] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d] rounded-lg p-6 lg:p-8">
                <!-- Cancel Header -->
                <div class="text-center mb-8">
                    <div class="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-4">
                        <svg class="w-10 h-10 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                    </div>
                    <h1 class="text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC] mb-2">Payment Cancelled</h1>
                    <p class="text-lg text-[#706f6c] dark:text-[#A1A09A]">Your payment was not completed</p>
                </div>

                <!-- Event Info -->
                @if($event)
                <div class="bg-[#FDFDFC] dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg p-6 mb-6">
                    <h2 class="text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-3 flex items-center">
                        <svg class="w-5 h-5 text-[#f53003] dark:text-[#FF4433] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Event Details
                    </h3>
                    <div class="space-y-2">
                        <p class="text-lg font-medium text-[#1b1b18] dark:text-[#EDEDEC]">{{ $event->title }}</p>
                        <p class="text-[#706f6c] dark:text-[#A1A09A]">{{ $event->date }} at {{ $event->time ?? '7:00 PM' }}</p>
                        <p class="text-[#706f6c] dark:text-[#A1A09A]">{{ $event->venue ?? $event->location ?? 'Location TBD' }}</p>
                    </div>
                </div>
                @endif

                <!-- Message -->
                <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-8">
                    <h3 class="font-semibold text-orange-900 dark:text-orange-300 mb-3">What happened?</h3>
                    <div class="text-sm text-orange-800 dark:text-orange-200 space-y-2">
                        <p>• Your payment was not completed successfully</p>
                        <p>• No charges were made to your account</p>
                        <p>• Your tickets are not confirmed</p>
                        <p>• You can try the payment again</p>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                    <button onclick="tryAgain()" class="inline-flex items-center px-6 py-3 bg-[#f53003] dark:bg-[#FF4433] text-white font-medium rounded-lg hover:bg-[#d42a02] dark:hover:bg-[#e6392e] transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Try Again
                    </button>
                    <button onclick="returnToEvent()" class="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Return to Event
                    </button>
                    <button onclick="contactSupport()" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"></path>
                        </svg>
                        Contact Support
                    </button>
                </div>

                <!-- Additional Info -->
                <div class="text-center">
                    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
                        <h3 class="font-semibold text-blue-900 dark:text-blue-300 mb-2">Need Help?</h3>
                        <div class="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <p>📧 Email: support@eventbooking.com</p>
                            <p>📱 Phone: +1 (555) 123-4567</p>
                            <p>💬 Live Chat: Available 24/7</p>
                            <p>⏰ Response Time: Within 2 hours</p>
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
        function tryAgain() {
            // Redirect back to the event page to try payment again
            const eventId = '{{ $eventId ?? "" }}';
            if (eventId) {
                window.location.href = '/events/' + eventId;
            } else {
                window.location.href = '/';
            }
        }

        function returnToEvent() {
            // Return to the main events page
            window.location.href = '/';
        }

        function contactSupport() {
            // Open email client with support email
            const subject = encodeURIComponent('Payment Issue - Event Booking');
            const body = encodeURIComponent(
                'Hi Support Team,\n\n' +
                'I experienced an issue with my payment for the following event:\n\n' +
                'Event: {{ $event->title ?? "Unknown Event" }}\n' +
                'Date: {{ $event->date ?? "Unknown Date" }}\n' +
                'Issue: Payment was cancelled\n\n' +
                'Please help me resolve this issue.\n\n' +
                'Best regards,\n[Your Name]'
            );
            
            window.open('mailto:support@eventbooking.com?subject=' + subject + '&body=' + body);
        }

        // Auto-close after 30 seconds (optional)
        setTimeout(() => {
            console.log('Payment cancel page loaded successfully.');
        }, 1000);
    </script>
</body>
</html>
