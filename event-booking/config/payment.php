<?php

return [
    'paypal' => [
        'enabled' => env('PAYPAL_ENABLED', false),
        'mode' => env('PAYPAL_MODE', 'sandbox'), // sandbox or live
        'client_id' => env('PAYPAL_CLIENT_ID', ''),
        'client_secret' => env('PAYPAL_CLIENT_SECRET', ''),
        'webhook_id' => env('PAYPAL_WEBHOOK_ID', ''),
        'ipn_url' => env('PAYPAL_IPN_URL', ''),
        'api_base_url' => [
            'sandbox' => 'https://api-m.sandbox.paypal.com',
            'live' => 'https://api-m.paypal.com',
        ],
    ],
    
    'stripe' => [
        'enabled' => env('STRIPE_ENABLED', false),
        'mode' => env('STRIPE_MODE', 'test'), // 'test' or 'live'
        'publishable_key' => env('STRIPE_PUBLISHABLE_KEY', ''),
        'secret_key' => env('STRIPE_SECRET_KEY', ''),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET', ''),
        'api_base_url' => env('STRIPE_API_BASE_URL', 'https://api.stripe.com/v1'),
    ],
    
    'razorpay' => [
        'enabled' => env('RAZORPAY_ENABLED', false),
        'key_id' => env('RAZORPAY_KEY_ID', ''),
        'key_secret' => env('RAZORPAY_KEY_SECRET', ''),
    ],
    
    'currency' => env('PAYMENT_CURRENCY', 'USD'),
    'currency_symbol' => env('PAYMENT_CURRENCY_SYMBOL', '$'),
    
    'defaults' => [
        'currency' => 'USD',
        'currency_symbol' => '$',
        'tax_rate' => 0.085, // 8.5% default tax rate
    ],
];
