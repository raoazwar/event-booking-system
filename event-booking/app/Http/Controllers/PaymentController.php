<?php

namespace App\Http\Controllers;

use App\Services\PayPalService;
use App\Services\StripeService;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    protected $paypalService;
    protected $stripeService;
    protected $emailService;

    public function __construct(PayPalService $paypalService, StripeService $stripeService, EmailService $emailService)
    {
        $this->paypalService = $paypalService;
        $this->stripeService = $stripeService;
        $this->emailService = $emailService;
    }

    public function createPayPalOrder(Request $request)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'currency' => 'required|string|size:3',
                'description' => 'required|string|max:255',
                'event_id' => 'required|integer|exists:events,id',
                'ticket_count' => 'required|integer|min:1',
            ]);

            $amount = $request->amount;
            $currency = strtoupper($request->currency);
            $description = $request->description;
            $eventId = $request->event_id;
            $ticketCount = $request->ticket_count;

            // Get event details for return URLs
            $event = DB::table('events')->where('id', $eventId)->first();
            
            // Generate return and cancel URLs with essential details only
            $returnUrl = route('payment.success', [
                'event_id' => $eventId,
                'ticket_count' => $ticketCount,
                'gateway' => 'paypal',
                'customer_email' => $request->customer_email ?? '',
            ]);
            
            $cancelUrl = route('payment.cancel', [
                'event_id' => $eventId,
                'gateway' => 'paypal',
                'customer_email' => $request->customer_email ?? '',
            ]);

            $result = $this->paypalService->createOrder(
                $amount,
                $currency,
                $description,
                $returnUrl,
                $cancelUrl
            );

            if ($result['success']) {
                // Log successful order creation
                Log::info('PayPal order created successfully', [
                    'event_id' => $eventId,
                    'amount' => $amount,
                    'currency' => $currency,
                    'customer_email' => $request->customer_email ?? 'Not provided'
                ]);

                return response()->json([
                    'success' => true,
                    'order_id' => $result['order_id'],
                    'approval_url' => $result['approval_url'],
                    'message' => 'PayPal order created successfully'
                ]);
            } else {
                // Log order creation failure
                Log::error('PayPal order creation failed', [
                    'event_id' => $eventId,
                    'error' => $result['error'],
                    'customer_email' => $request->customer_email ?? 'Not provided'
                ]);

                // Send failure email if customer email is provided
                if ($request->customer_email && $event) {
                    try {
                        $this->emailService->sendPaymentFailureEmail(
                            $request->customer_email,
                            $request->customer_name ?? 'Customer',
                            $event,
                            ['error' => $result['error'], 'step' => 'order_creation']
                        );
                    } catch (\Exception $emailError) {
                        Log::error('Failed to send payment failure email', [
                            'error' => $emailError->getMessage(),
                            'customer_email' => $request->customer_email
                        ]);
                    }
                }

                return response()->json([
                    'success' => false,
                    'error' => $result['error'],
                    'message' => 'Failed to create PayPal order'
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('PayPal order creation error', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            // Send failure email if customer email is provided
            if ($request->customer_email && $event) {
                try {
                    $this->emailService->sendPaymentFailureEmail(
                        $request->customer_email,
                        $request->customer_name ?? 'Customer',
                        $event,
                        ['error' => $e->getMessage(), 'step' => 'order_creation']
                    );
                } catch (\Exception $emailError) {
                    Log::error('Failed to send payment failure email', [
                        'error' => $emailError->getMessage(),
                        'customer_email' => $request->customer_email
                        ]);
                }
            }

            return response()->json([
                'success' => false,
                'error' => 'Internal server error',
                'message' => 'An error occurred while creating the order'
            ], 500);
        }
    }

    public function capturePayPalOrder(Request $request)
    {
        try {
            $request->validate([
                'order_id' => 'required|string',
                'event_id' => 'required|integer|exists:events,id',
                'ticket_count' => 'required|integer|min:1',
            ]);

            $orderId = $request->order_id;
            $eventId = $request->event_id;
            $ticketCount = $request->ticket_count;

            $result = $this->paypalService->captureOrder($orderId);

            if ($result['success']) {
                // Here you would typically:
                // 1. Create a booking record
                // 2. Update event availability
                // 3. Send confirmation email
                // 4. Generate tickets

                return response()->json([
                    'success' => true,
                    'transaction_id' => $result['transaction_id'],
                    'amount' => $result['amount'],
                    'currency' => $result['currency'],
                    'message' => 'Payment captured successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => $result['error'],
                    'message' => 'Failed to capture payment'
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('PayPal order capture error', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Internal server error',
                'message' => 'An error occurred while capturing the payment'
            ], 500);
        }
    }

    public function createStripeCheckout(Request $request)
    {
        try {
            $request->validate([
                'amount' => 'required|numeric|min:0.01',
                'currency' => 'required|string|size:3',
                'description' => 'required|string|max:255',
                'event_id' => 'required|integer|exists:events,id',
                'ticket_count' => 'required|integer|min:1',
            ]);

            $amount = $request->amount;
            $currency = strtoupper($request->currency);
            $description = $request->description;
            $eventId = $request->event_id;
            $ticketCount = $request->ticket_count;

            // Get event details for return URLs
            $event = DB::table('events')->where('id', $eventId)->first();
            
            // Generate return and cancel URLs with essential details only
            $successUrl = route('payment.success', [
                'event_id' => $eventId,
                'ticket_count' => $ticketCount,
                'gateway' => 'stripe',
                'customer_email' => $request->customer_email ?? '',
            ]);
            
            $cancelUrl = route('payment.cancel', [
                'event_id' => $eventId,
                'gateway' => 'stripe',
                'customer_email' => $request->customer_email ?? '',
            ]);

            $customerData = [
                'name' => $request->customer_name ?? 'Customer',
                'email' => $request->customer_email ?? null,
                'phone' => $request->customer_phone ?? null,
            ];

            $result = $this->stripeService->createCheckoutSession(
                $amount,
                $currency,
                $description,
                $eventId,
                $ticketCount,
                $customerData,
                $successUrl,
                $cancelUrl
            );

            if ($result['success']) {
                // Log successful session creation
                Log::info('Stripe checkout session created successfully', [
                    'event_id' => $eventId,
                    'amount' => $amount,
                    'currency' => $currency,
                    'customer_email' => $request->customer_email ?? 'Not provided'
                ]);

                return response()->json([
                    'success' => true,
                    'session_id' => $result['session_id'],
                    'checkout_url' => $result['checkout_url'],
                    'message' => 'Stripe checkout session created successfully'
                ]);
            } else {
                // Log session creation failure
                Log::error('Stripe checkout session creation failed', [
                    'event_id' => $eventId,
                    'error' => $result['error'],
                    'customer_email' => $request->customer_email ?? 'Not provided'
                ]);

                // Send failure email if customer email is provided
                if ($request->customer_email && $event) {
                    try {
                        $this->emailService->sendPaymentFailureEmail(
                            $request->customer_email,
                            $request->customer_name ?? 'Customer',
                            $event,
                            ['error' => $result['error'], 'step' => 'stripe_checkout_creation']
                        );
                    } catch (\Exception $emailError) {
                        Log::error('Failed to send payment failure email', [
                            'error' => $emailError->getMessage(),
                            'customer_email' => $request->customer_email
                        ]);
                    }
                }

                return response()->json([
                    'success' => false,
                    'error' => $result['error'],
                    'message' => 'Failed to create Stripe checkout session'
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('Stripe checkout session creation error', [
                'error' => $e->getMessage(),
                'request' => $request->all()
            ]);

            // Send failure email if customer email is provided
            if ($request->customer_email && $event) {
                try {
                    $this->emailService->sendPaymentFailureEmail(
                        $request->customer_email,
                        $request->customer_name ?? 'Customer',
                        $event,
                        ['error' => $e->getMessage(), 'step' => 'stripe_checkout_creation']
                    );
                } catch (\Exception $emailError) {
                    Log::error('Failed to send payment failure email', [
                        'error' => $emailError->getMessage(),
                        'customer_email' => $request->customer_email
                        ]);
                }
            }

            return response()->json([
                'success' => false,
                'error' => 'Internal server error',
                'message' => 'An error occurred while creating the checkout session'
            ], 500);
        }
    }

    /**
     * Handle Stripe webhook
     */
    public function handleStripeWebhook(Request $request)
    {
        try {
            $payload = $request->getContent();
            $sigHeader = $request->header('Stripe-Signature');
            
            Log::info('Stripe webhook received', [
                'payload_length' => strlen($payload),
                'signature_header' => $sigHeader,
                'content_type' => $request->header('Content-Type')
            ]);
            
            // Verify webhook signature
            if (!$this->stripeService->verifyWebhookSignature($payload, $sigHeader)) {
                Log::warning('Invalid Stripe webhook signature');
                return response()->json(['error' => 'Invalid signature'], 400);
            }
            
            $event = json_decode($payload, true);
            Log::info('Stripe webhook event decoded', [
                'event_type' => $event['type'] ?? 'unknown',
                'event_id' => $event['id'] ?? 'unknown'
            ]);
            
            if ($event['type'] === 'checkout.session.completed') {
                $session = $event['data']['object'];
                Log::info('Processing checkout.session.completed', [
                    'session_id' => $session['id'],
                    'amount_total' => $session['amount_total'] ?? 'unknown',
                    'metadata' => $session['metadata'] ?? 'none'
                ]);
                
                // Process successful payment
                $result = $this->stripeService->processSuccessfulPayment($session);
                
                if ($result['success']) {
                    $metadata = $result['metadata'];
                    $eventId = $metadata['event_id'] ?? null;
                    $ticketCount = $metadata['ticket_count'] ?? 1;
                    $amount = $result['amount'];
                    
                    Log::info('Payment processed successfully', [
                        'event_id' => $eventId,
                        'ticket_count' => $ticketCount,
                        'amount' => $amount
                    ]);
                    
                    if ($eventId) {
                        // Get event details
                        $event = DB::table('events')->where('id', $eventId)->first();
                        
                        if ($event) {
                            // Create booking record
                            $bookingId = DB::table('bookings')->insertGetId([
                                'event_id' => $eventId,
                                'user_id' => 1, // Default user ID for now
                                'ticket_count' => $ticketCount,
                                'total_amount' => $amount,
                                'status' => 'confirmed',
                                'payment_status' => 'paid',
                                'payment_method' => 'stripe',
                                'payment_reference' => $result['transaction_id'],
                                'booking_reference' => 'BK' . strtoupper(uniqid()),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                            
                            // Update event availability
                            DB::table('events')
                                ->where('id', $eventId)
                                ->decrement('available_seats', $ticketCount);
                            
                            Log::info('Stripe booking created successfully', [
                                'booking_id' => $bookingId,
                                'event_id' => $eventId,
                                'ticket_count' => $ticketCount,
                                'amount' => $amount,
                                'stripe_session_id' => $session['id']
                            ]);
                            
                            // Send confirmation email if customer email is available
                            if (!empty($session['customer_details']['email'])) {
                                $customerEmail = $session['customer_details']['email'];
                                $customerName = $session['customer_details']['name'] ?? 'Customer';
                                
                                $bookingData = [
                                    'bookingId' => $bookingId,
                                    'ticketCount' => $ticketCount,
                                    'totalAmount' => $amount,
                                    'paymentMethod' => 'stripe',
                                    'bookingDate' => now()->format('Y-m-d H:i:s')
                                ];
                                
                                try {
                                    $this->emailService->sendPaymentSuccessEmail(
                                        $customerEmail,
                                        $customerName,
                                        $event,
                                        $bookingData
                                    );
                                    
                                    $this->emailService->sendBookingConfirmationEmail(
                                        $customerEmail,
                                        $customerName,
                                        $event,
                                        $bookingData
                                    );
                                    
                                    Log::info('Stripe payment confirmation emails sent', [
                                        'booking_id' => $bookingId,
                                        'customer_email' => $customerEmail
                                    ]);
                                } catch (\Exception $emailError) {
                                    Log::error('Failed to send Stripe confirmation emails', [
                                        'error' => $emailError->getMessage(),
                                        'booking_id' => $bookingId
                                    ]);
                                }
                            }
                        } else {
                            Log::error('Event not found for Stripe webhook', [
                                'event_id' => $eventId,
                                'session_id' => $session['id']
                            ]);
                        }
                    } else {
                        Log::error('No event_id in Stripe webhook metadata', [
                            'metadata' => $metadata,
                            'session_id' => $session['id']
                        ]);
                    }
                } else {
                    Log::error('Failed to process Stripe payment', [
                        'error' => $result['error'],
                        'session_id' => $session['id']
                    ]);
                }
            } else {
                Log::info('Ignoring non-checkout.session.completed event', [
                    'event_type' => $event['type']
                ]);
            }
            
            return response()->json(['status' => 'success']);
            
        } catch (\Exception $e) {
            Log::error('Stripe webhook error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $request->getContent()
            ]);
            
            return response()->json(['error' => 'Webhook processing failed'], 500);
        }
    }

    /**
     * Test webhook endpoint for development (remove in production)
     */
    public function testStripeWebhook(Request $request)
    {
        try {
            // Simulate a successful Stripe webhook for testing
            $eventId = $request->input('event_id');
            $ticketCount = $request->input('ticket_count', 1);
            $amount = $request->input('amount', 199.99);
            $customerEmail = $request->input('customer_email', 'test@example.com');
            $customerName = $request->input('customer_name', 'Test Customer');
            
            if (!$eventId) {
                return response()->json(['error' => 'event_id is required'], 400);
            }
            
            // Get event details
            $event = DB::table('events')->where('id', $eventId)->first();
            
            if (!$event) {
                return response()->json(['error' => 'Event not found'], 404);
            }
            
            // Create booking record
            $bookingId = DB::table('bookings')->insertGetId([
                'event_id' => $eventId,
                'user_id' => 1, // Default user ID for now
                'ticket_count' => $ticketCount,
                'total_amount' => $amount,
                'status' => 'confirmed',
                'payment_status' => 'paid',
                'payment_method' => 'stripe',
                'payment_reference' => 'TEST_' . uniqid(),
                'booking_reference' => 'BK' . strtoupper(uniqid()),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Update event availability
            DB::table('events')
                ->where('id', $eventId)
                ->decrement('available_seats', $ticketCount);
            
            Log::info('Test Stripe webhook booking created successfully', [
                'booking_id' => $bookingId,
                'event_id' => $eventId,
                'ticket_count' => $ticketCount,
                'amount' => $amount
            ]);
            
            // Send confirmation email
            try {
                $bookingData = [
                    'bookingId' => $bookingId,
                    'ticketCount' => $ticketCount,
                    'totalAmount' => $amount,
                    'paymentMethod' => 'stripe',
                    'bookingDate' => now()->format('Y-m-d H:i:s')
                ];
                
                $this->emailService->sendPaymentSuccessEmail(
                    $customerEmail,
                    $customerName,
                    $event,
                    $bookingData
                );
                
                $this->emailService->sendBookingConfirmationEmail(
                    $customerEmail,
                    $customerName,
                    $event,
                    $bookingData
                );
                
                Log::info('Test webhook confirmation emails sent', [
                    'booking_id' => $bookingId,
                    'customer_email' => $customerEmail
                ]);
                
            } catch (\Exception $emailError) {
                Log::error('Failed to send test webhook confirmation emails', [
                    'error' => $emailError->getMessage(),
                    'booking_id' => $bookingId
                ]);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Test booking created successfully',
                'booking_id' => $bookingId,
                'event_id' => $eventId,
                'ticket_count' => $ticketCount,
                'amount' => $amount
            ]);
            
        } catch (\Exception $e) {
            Log::error('Test webhook error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['error' => 'Test webhook failed'], 500);
        }
    }

    public function getPaymentGateways()
    {
        try {
            // Try to load from database first
            $settings = DB::table('website_settings')->first();
            $gateways = [];
            
            if ($settings && $settings->payment_gateways) {
                $paymentGateways = json_decode($settings->payment_gateways, true);
                
                $gateways = [
                    'paypal' => [
                        'enabled' => $paymentGateways['paypal']['enabled'] ?? false,
                        'name' => 'PayPal',
                        'description' => 'Pay with PayPal',
                        'icon' => 'paypal',
                        'mode' => $paymentGateways['paypal']['mode'] ?? 'sandbox',
                    ],
                    'stripe' => [
                        'enabled' => $paymentGateways['stripe']['enabled'] ?? false,
                        'name' => 'Stripe',
                        'description' => 'Pay with credit card',
                        'icon' => 'credit-card',
                    ],
                    'razorpay' => [
                        'enabled' => $paymentGateways['razorpay']['enabled'] ?? false,
                        'name' => 'Razorpay',
                        'description' => 'Pay with Razorpay',
                        'icon' => 'credit-card',
                    ],
                ];
            } else {
                // Fallback to environment variables
                $gateways = [
                    'paypal' => [
                        'enabled' => $this->paypalService->isEnabled(),
                        'name' => 'PayPal',
                        'description' => 'Pay with PayPal',
                        'icon' => 'paypal',
                        'mode' => Config::get('payment.paypal.mode', 'sandbox'),
                    ],
                    'stripe' => [
                        'enabled' => Config::get('payment.stripe.enabled', false),
                        'name' => 'Stripe',
                        'description' => 'Pay with credit card',
                        'icon' => 'credit-card',
                    ],
                    'razorpay' => [
                        'enabled' => Config::get('payment.razorpay.enabled', false),
                        'name' => 'Razorpay',
                        'description' => 'Pay with Razorpay',
                        'icon' => 'credit-card',
                    ],
                ];
            }

            return response()->json([
                'success' => true,
                'gateways' => $gateways
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading payment gateways', [
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to load payment gateways',
                'gateways' => []
            ], 500);
        }
    }

    public function paymentSuccess(Request $request)
    {
        try {
            $eventId = $request->query('event_id');
            $ticketCount = $request->query('ticket_count');
            $gateway = $request->query('gateway');
            
            // Get event details if event_id is provided
            $event = null;
            if ($eventId) {
                $event = DB::table('events')->where('id', $eventId)->first();
            }
            
            // For Stripe payments, the actual booking creation happens via webhook
            // This page is just for display purposes
            if ($gateway === 'stripe') {
                // For Stripe, we need to provide default values since the actual data comes from webhook
                $subtotal = $event ? (floatval($event->price) * intval($ticketCount)) : 199.99;
                $tax = 0; // Default tax rate
                $total = $subtotal + $tax;
                $customerName = 'Customer';
                $customerEmail = 'customer@example.com';
                $customerPhone = '';
                $bookingId = 'Processing...'; // Will be updated when webhook processes
                
                return view('payment.success', compact(
                    'event',
                    'eventId',
                    'ticketCount',
                    'gateway',
                    'customerName',
                    'customerEmail',
                    'customerPhone',
                    'subtotal',
                    'tax',
                    'total',
                    'bookingId'
                ));
            }
            
            // For PayPal payments, continue with the existing logic
            // Get customer details from session or request
            $customerName = $request->query('customer_name') ?? 'Customer';
            $customerEmail = $request->query('customer_email') ?? 'customer@example.com';
            $customerPhone = $request->query('customer_phone') ?? '';
            
            // Calculate amounts (you might want to get these from the actual payment)
            $subtotal = $event ? (floatval($event->price) * intval($ticketCount)) : 199.99;
            $tax = 0; // TODO: Get tax rate from settings, default to 0 if not enabled
            $total = $subtotal + $tax;
            
            // Generate booking ID
            $bookingId = 'BK' . strtoupper(uniqid());
            
            // Create actual booking record in database (only for PayPal)
            if ($eventId && $event && $gateway === 'paypal') {
                try {
                    $bookingId = DB::table('bookings')->insertGetId([
                        'event_id' => $eventId,
                        'user_id' => 1, // Default user ID for now
                        'ticket_count' => $ticketCount,
                        'total_amount' => $total,
                        'status' => 'confirmed',
                        'payment_status' => 'paid',
                        'payment_method' => 'paypal',
                        'booking_reference' => 'BK' . strtoupper(uniqid()),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    
                    // Update event availability
                    DB::table('events')
                        ->where('id', $eventId)
                        ->decrement('available_seats', $ticketCount);
                    
                    // Log the successful booking
                    Log::info('PayPal booking created successfully', [
                        'booking_id' => $bookingId,
                        'event_id' => $eventId,
                        'ticket_count' => $ticketCount,
                        'total_amount' => $total,
                        'customer_email' => $customerEmail
                    ]);

                    // Prepare booking data for emails
                    $bookingData = [
                        'bookingId' => $bookingId,
                        'ticketCount' => $ticketCount,
                        'totalAmount' => $total,
                        'paymentMethod' => $gateway ?? 'paypal',
                        'bookingDate' => now()->format('Y-m-d H:i:s')
                    ];

                    $customerData = [
                        'name' => $customerName,
                        'email' => $customerEmail,
                        'phone' => $customerPhone
                    ];

                    // Send emails for PayPal payments
                    try {
                        // 1. Send payment success email to customer
                        $this->emailService->sendPaymentSuccessEmail(
                            $customerEmail, 
                            $customerName, 
                            $event, 
                            $bookingData
                        );

                        // 2. Send booking confirmation email to customer
                        $this->emailService->sendBookingConfirmationEmail(
                            $customerEmail, 
                            $customerName, 
                            $event, 
                            $bookingData
                        );

                        // 3. Send admin notification email
                        $this->emailService->sendAdminNotificationEmail(
                            $event, 
                            $bookingData, 
                            $customerData
                        );

                        Log::info('All PayPal confirmation emails sent successfully', [
                            'booking_id' => $bookingId,
                            'customer_email' => $customerEmail
                        ]);

                    } catch (\Exception $emailError) {
                        Log::error('Failed to send PayPal confirmation emails', [
                            'error' => $emailError->getMessage(),
                            'booking_id' => $bookingId
                        ]);
                        // Continue with the success page even if emails fail
                    }
                    
                } catch (\Exception $e) {
                    Log::error('Failed to create PayPal booking record', [
                        'error' => $e->getMessage(),
                        'event_id' => $eventId
                    ]);
                    // Continue with the success page even if booking creation fails
                }
            }
            
            return view('payment.success', compact(
                'event',
                'eventId',
                'ticketCount',
                'gateway',
                'customerName',
                'customerEmail',
                'customerPhone',
                'subtotal',
                'tax',
                'total',
                'bookingId'
            ));
            
        } catch (\Exception $e) {
            Log::error('Payment success page error', ['error' => $e->getMessage()]);
            return view('payment.success');
        }
    }

    public function paymentCancel(Request $request)
    {
        try {
            $eventId = $request->query('event_id');
            $gateway = $request->query('gateway');
            $customerEmail = $request->query('customer_email');
            $customerName = $request->query('customer_name') ?? 'Customer';
            
            // Get event details if event_id is provided
            $event = null;
            if ($eventId) {
                $event = DB::table('events')->where('id', $eventId)->first();
            }

            // Send cancellation email if we have customer details
            if ($event && $customerEmail) {
                try {
                    $this->emailService->sendPaymentCancellationEmail(
                        $customerEmail,
                        $customerName,
                        $event
                    );

                    Log::info('Payment cancellation email sent', [
                        'customer_email' => $customerEmail,
                        'event_id' => $eventId
                    ]);
                } catch (\Exception $emailError) {
                    Log::error('Failed to send cancellation email', [
                        'error' => $emailError->getMessage(),
                        'customer_email' => $customerEmail
                    ]);
                }
            }
            
            return view('payment.cancel', compact('event', 'eventId', 'gateway'));
            
        } catch (\Exception $e) {
            Log::error('Payment cancel page error', ['error' => $e->getMessage()]);
            return view('payment.cancel');
        }
    }
}
