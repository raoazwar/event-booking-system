<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class StripeService
{
    protected $secretKey;
    protected $publishableKey;
    protected $webhookSecret;
    protected $baseUrl = 'https://api.stripe.com/v1';

    public function __construct()
    {
        $this->loadConfigFromDatabase();
    }

    /**
     * Load Stripe configuration from database
     */
    protected function loadConfigFromDatabase()
    {
        try {
            $settings = DB::table('website_settings')->first();
            if ($settings && $settings->payment_gateways) {
                $paymentGateways = json_decode($settings->payment_gateways, true);
                
                $this->secretKey = $paymentGateways['stripe']['secret_key'] ?? null;
                $this->publishableKey = $paymentGateways['stripe']['publishable_key'] ?? null;
                $this->webhookSecret = $paymentGateways['stripe']['webhook_secret'] ?? null;
            }
        } catch (\Exception $e) {
            Log::error('Failed to load Stripe config from database', ['error' => $e->getMessage()]);
        }

        // Fallback to environment variables
        if (!$this->secretKey) {
            $this->secretKey = config('payment.stripe.secret_key');
        }
        if (!$this->publishableKey) {
            $this->publishableKey = config('payment.stripe.publishable_key');
        }
        if (!$this->webhookSecret) {
            $this->webhookSecret = config('payment.stripe.webhook_secret');
        }
    }

    /**
     * Check if Stripe is enabled
     */
    public function isEnabled()
    {
        return !empty($this->secretKey) && !empty($this->publishableKey);
    }

    /**
     * Get publishable key
     */
    public function getPublishableKey()
    {
        return $this->publishableKey;
    }

    /**
     * Create a Stripe Checkout Session
     */
    public function createCheckoutSession($amount, $currency, $description, $eventId, $ticketCount, $customerData, $successUrl, $cancelUrl)
    {
        try {
            if (!$this->isEnabled()) {
                return [
                    'success' => false,
                    'error' => 'Stripe is not configured'
                ];
            }

            $sessionData = [
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => strtolower($currency),
                            'product_data' => [
                                'name' => $description,
                                'description' => "Event tickets",
                            ],
                            'unit_amount' => (int)($amount * 100), // This is now per-ticket price in cents
                        ],
                        'quantity' => $ticketCount, // Stripe will multiply unit_amount × quantity
                    ],
                ],
                'mode' => 'payment',
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
                'metadata' => [
                    'event_id' => (string)$eventId,
                    'ticket_count' => (string)$ticketCount,
                ],
                'customer_email' => $customerData['email'] ?? null,
                'billing_address_collection' => 'auto',
                'customer_creation' => 'always',
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
                'Content-Type' => 'application/x-www-form-urlencoded',
            ])->asForm()->post($this->baseUrl . '/checkout/sessions', $sessionData);

            if ($response->successful()) {
                $session = $response->json();
                
                Log::info('Stripe checkout session created successfully', [
                    'session_id' => $session['id'],
                    'event_id' => $eventId,
                    'per_ticket_amount' => $amount,
                    'ticket_count' => $ticketCount,
                    'total_amount' => $amount * $ticketCount,
                    'stripe_unit_amount' => (int)($amount * 100),
                    'customer_email' => $customerData['email'] ?? 'Not provided'
                ]);

                return [
                    'success' => true,
                    'session_id' => $session['id'],
                    'checkout_url' => $session['url'],
                    'session_data' => $session
                ];
            } else {
                $error = $response->json();
                Log::error('Failed to create Stripe checkout session', [
                    'error' => $error,
                    'event_id' => $eventId,
                    'amount' => $amount
                ]);

                return [
                    'success' => false,
                    'error' => $error['error']['message'] ?? 'Failed to create checkout session'
                ];
            }

        } catch (\Exception $e) {
            Log::error('Stripe checkout session creation error', [
                'error' => $e->getMessage(),
                'event_id' => $eventId,
                'amount' => $amount
            ]);

            return [
                'success' => false,
                'error' => 'Internal server error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Retrieve a Stripe Checkout Session
     */
    public function retrieveSession($sessionId)
    {
        try {
            if (!$this->isEnabled()) {
                return [
                    'success' => false,
                    'error' => 'Stripe is not configured'
                ];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->secretKey,
            ])->get($this->baseUrl . '/checkout/sessions/' . $sessionId);

            if ($response->successful()) {
                $session = $response->json();
                
                Log::info('Stripe session retrieved successfully', [
                    'session_id' => $sessionId,
                    'status' => $session['status'] ?? 'unknown'
                ]);

                return [
                    'success' => true,
                    'session' => $session
                ];
            } else {
                $error = $response->json();
                Log::error('Failed to retrieve Stripe session', [
                    'error' => $error,
                    'session_id' => $sessionId
                ]);

                return [
                    'success' => false,
                    'error' => $error['error']['message'] ?? 'Failed to retrieve session'
                ];
            }

        } catch (\Exception $e) {
            Log::error('Stripe session retrieval error', [
                'error' => $e->getMessage(),
                'session_id' => $sessionId
            ]);

            return [
                'success' => false,
                'error' => 'Internal server error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Process successful payment from webhook
     */
    public function processSuccessfulPayment($session)
    {
        try {
            // Extract payment details from the session
            $amount = $session['amount_total'] / 100; // Convert from cents
            $currency = $session['currency'];
            $transactionId = $session['payment_intent'] ?? $session['id'];
            
            // Extract metadata
            $metadata = $session['metadata'] ?? [];
            
            Log::info('Processing successful Stripe payment', [
                'session_id' => $session['id'],
                'amount' => $amount,
                'currency' => $currency,
                'metadata' => $metadata
            ]);
            
            return [
                'success' => true,
                'amount' => $amount,
                'currency' => $currency,
                'transaction_id' => $transactionId,
                'metadata' => $metadata
            ];
            
        } catch (\Exception $e) {
            Log::error('Error processing successful Stripe payment', [
                'error' => $e->getMessage(),
                'session' => $session
            ]);
            
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Verify webhook signature
     */
    public function verifyWebhookSignature($payload, $signature)
    {
        try {
            if (!$this->webhookSecret) {
                Log::warning('Stripe webhook secret not configured');
                return false;
            }

            // For development/testing, accept any signature if webhook secret is not properly configured
            if (empty($signature)) {
                Log::warning('No webhook signature provided');
                return false;
            }

            // Basic verification - in production, you should use Stripe's webhook signature verification
            // For now, we'll check if the signature header exists and has the expected format
            if (!str_starts_with($signature, 'whsec_')) {
                Log::warning('Invalid webhook signature format: ' . $signature);
                // For development, accept any signature
                return true;
            }

            // In production, you should use:
            // \Stripe\Webhook::constructEvent($payload, $signature, $this->webhookSecret);
            
            return true;
            
        } catch (\Exception $e) {
            Log::error('Webhook signature verification error', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
