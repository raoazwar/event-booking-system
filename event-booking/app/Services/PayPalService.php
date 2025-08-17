<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class PayPalService
{
    protected $config;
    protected $baseUrl;
    protected $accessToken;

    public function __construct()
    {
        $this->loadConfigFromDatabase();
        $this->baseUrl = $this->config['mode'] === 'live' 
            ? 'https://api-m.paypal.com' 
            : 'https://api-m.sandbox.paypal.com';
    }

    protected function loadConfigFromDatabase()
    {
        // Try to load from database first (dashboard settings)
        try {
            $settings = DB::table('website_settings')->first();
            if ($settings && $settings->payment_gateways) {
                $paymentGateways = json_decode($settings->payment_gateways, true);
                if (isset($paymentGateways['paypal'])) {
                    $this->config = $paymentGateways['paypal'];
                    return;
                }
            }
        } catch (\Exception $e) {
            Log::warning('Could not load PayPal config from database, using defaults');
        }

        // Fallback to environment variables
        $this->config = Config::get('payment.paypal', [
            'enabled' => false,
            'mode' => 'sandbox',
            'client_id' => '',
            'client_secret' => '',
        ]);
    }

    protected function getAccessToken()
    {
        if ($this->accessToken) {
            return $this->accessToken;
        }

        try {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Accept-Language' => 'en_US',
            ])->withBasicAuth($this->config['client_id'], $this->config['client_secret'])
              ->asForm()
              ->post($this->baseUrl . '/v1/oauth2/token', [
                'grant_type' => 'client_credentials',
              ]);

            if ($response->successful()) {
                $this->accessToken = $response->json('access_token');
                return $this->accessToken;
            }

            Log::error('Failed to get PayPal access token', [
                'response' => $response->body(),
                'status' => $response->status()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('PayPal access token error', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    public function createOrder($amount, $currency, $description, $returnUrl, $cancelUrl)
    {
        try {
            $accessToken = $this->getAccessToken();
            if (!$accessToken) {
                return [
                    'success' => false,
                    'error' => 'Failed to authenticate with PayPal',
                ];
            }

            $payload = [
                'intent' => 'CAPTURE',
                'application_context' => [
                    'return_url' => $returnUrl,
                    'cancel_url' => $cancelUrl,
                    'brand_name' => 'Event Booking System',
                    'landing_page' => 'BILLING',
                    'user_action' => 'PAY_NOW',
                ],
                'purchase_units' => [
                    [
                        'reference_id' => uniqid('event_'),
                        'description' => $description,
                        'amount' => [
                            'currency_code' => $currency,
                            'value' => number_format($amount, 2, '.', ''),
                        ],
                    ],
                ],
            ];

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/v2/checkout/orders', $payload);

            if ($response->successful()) {
                $order = $response->json();
                
                Log::info('PayPal order created successfully', [
                    'order_id' => $order['id'],
                    'amount' => $amount,
                    'currency' => $currency
                ]);

                // Find the approval URL from links
                $approvalUrl = '';
                foreach ($order['links'] as $link) {
                    if ($link['rel'] === 'approve') {
                        $approvalUrl = $link['href'];
                        break;
                    }
                }

                return [
                    'success' => true,
                    'order_id' => $order['id'],
                    'approval_url' => $approvalUrl,
                ];
            }

            Log::error('PayPal order creation failed', [
                'response' => $response->body(),
                'status' => $response->status()
            ]);

            return [
                'success' => false,
                'error' => 'Failed to create order: ' . $response->status(),
            ];

        } catch (\Exception $e) {
            Log::error('PayPal order creation failed', [
                'error' => $e->getMessage(),
                'amount' => $amount,
                'currency' => $currency
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function captureOrder($orderId)
    {
        try {
            $accessToken = $this->getAccessToken();
            if (!$accessToken) {
                return [
                    'success' => false,
                    'error' => 'Failed to authenticate with PayPal',
                ];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/v2/checkout/orders/' . $orderId . '/capture');

            if ($response->successful()) {
                $order = $response->json();
                
                if ($order['status'] === 'COMPLETED') {
                    $capture = $order['purchase_units'][0]['payments']['captures'][0];
                    
                    Log::info('PayPal order captured successfully', [
                        'order_id' => $orderId,
                        'transaction_id' => $capture['id'],
                        'amount' => $capture['amount']['value'],
                    ]);

                    return [
                        'success' => true,
                        'transaction_id' => $capture['id'],
                        'amount' => $capture['amount']['value'],
                        'currency' => $capture['amount']['currency_code'],
                        'status' => $order['status'],
                    ];
                }

                return [
                    'success' => false,
                    'error' => 'Order not completed',
                    'status' => $order['status'],
                ];
            }

            Log::error('PayPal order capture failed', [
                'response' => $response->body(),
                'status' => $response->status()
            ]);

            return [
                'success' => false,
                'error' => 'Failed to capture order: ' . $response->status(),
            ];

        } catch (\Exception $e) {
            Log::error('PayPal order capture failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function getOrder($orderId)
    {
        try {
            $accessToken = $this->getAccessToken();
            if (!$accessToken) {
                return [
                    'success' => false,
                    'error' => 'Failed to authenticate with PayPal',
                ];
            }

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
            ])->get($this->baseUrl . '/v2/checkout/orders/' . $orderId);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'order' => $response->json(),
                ];
            }

            return [
                'success' => false,
                'error' => 'Failed to retrieve order: ' . $response->status(),
            ];

        } catch (\Exception $e) {
            Log::error('PayPal order retrieval failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    public function isEnabled()
    {
        return $this->config['enabled'] && 
               !empty($this->config['client_id']) && 
               !empty($this->config['client_secret']);
    }
}
