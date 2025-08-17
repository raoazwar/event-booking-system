<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Mailer
    |--------------------------------------------------------------------------
    |
    | This option controls the default mailer that is used to send any email
    | messages sent by your application. Alternative mailers may be setup
    | and used as needed; however, this mailer will be used by default.
    |
    */

    'default' => env('MAIL_MAILER', 'smtp'),

    /*
    |--------------------------------------------------------------------------
    | Mailer Configurations
    |--------------------------------------------------------------------------
    |
    | Here you may configure all of the mailers used by your application plus
    | their respective settings. Several examples have been configured for
    | you and you are free to add your own as your application requires.
    |
    | Laravel supports a variety of mail "transport" drivers to be used while
    | sending an e-mail. You will specify which one you are using for your
    | mailers below. You are free to add additional mailers as required.
    |
    | Supported: "smtp", "sendmail", "mailgun", "ses",
    |            "postmark", "log", "array", "failover"
    |
    */

    'mailers' => [
        'smtp' => [
            'transport' => 'smtp',
            'host' => env('MAIL_HOST', 'smtp.mailgun.org'),
            'port' => env('MAIL_PORT', 587),
            'encryption' => env('MAIL_ENCRYPTION', 'tls'),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN'),
        ],

        'ses' => [
            'transport' => 'ses',
        ],

        'mailgun' => [
            'transport' => 'mailgun',
        ],

        'postmark' => [
            'transport' => 'postmark',
        ],

        'sendmail' => [
            'transport' => 'sendmail',
            'path' => '/usr/sbin/sendmail -bs -i',
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => [
                'smtp',
                'log',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Global "From" Address
    |--------------------------------------------------------------------------
    |
    | You may wish for all e-mails sent by your application to be sent from
    | the same address. Here, you may specify a name and address that is
    | used globally for all e-mails that are sent by your application.
    |
    */

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'noreply@eventbooking.com'),
        'name' => env('MAIL_FROM_NAME', 'Event Booking System'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Markdown Mail Settings
    |--------------------------------------------------------------------------
    |
    | If you are using Markdown based email templates, then you can configure
    | the theme and component paths here, allowing you to customize the design
    | and look of your emails. Or, you may simply stick with the Laravel
    | defaults!
    |
    */

    'markdown' => [
        'theme' => 'default',

        'paths' => [
            resource_path('views/vendor/mail'),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Admin Email Settings
    |--------------------------------------------------------------------------
    |
    | Configure the admin email address for notifications
    |
    */

    'admin_email' => env('ADMIN_EMAIL', 'admin@eventbooking.com'),
    'admin_name' => env('ADMIN_NAME', 'Event Booking Admin'),

    /*
    |--------------------------------------------------------------------------
    | Support Email Settings
    |--------------------------------------------------------------------------
    |
    | Configure the support email address for customer inquiries
    |
    */

    'support_email' => env('SUPPORT_EMAIL', 'support@eventbooking.com'),
    'support_name' => env('SUPPORT_NAME', 'Event Booking Support'),

    /*
    |--------------------------------------------------------------------------
    | Email Templates
    |--------------------------------------------------------------------------
    |
    | Configure default email templates and branding
    |
    */

    'templates' => [
        'company_name' => env('COMPANY_NAME', 'Event Booking System'),
        'company_website' => env('COMPANY_WEBSITE', 'https://eventbooking.com'),
        'company_phone' => env('COMPANY_PHONE', '+1 (555) 123-4567'),
        'company_address' => env('COMPANY_ADDRESS', '123 Event Street, City, State 12345'),
    ],
];
