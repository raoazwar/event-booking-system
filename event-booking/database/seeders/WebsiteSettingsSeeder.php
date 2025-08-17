<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WebsiteSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            'site_settings' => [
                'site_name' => 'Event Booking System',
                'site_description' => 'Professional event management and ticketing platform',
                'contact_email' => 'admin@example.com',
                'contact_phone' => '+1 (555) 123-4567',
                'address' => '123 Event Street, City, State 12345',
            ],
            'payment_gateways' => [
                'paypal' => [
                    'enabled' => false,
                    'mode' => 'sandbox',
                    'client_id' => '',
                    'client_secret' => '',
                    'webhook_id' => '',
                    'ipn_url' => '',
                ],
                'stripe' => [
                    'enabled' => false,
                    'publishable_key' => '',
                    'secret_key' => '',
                    'webhook_secret' => '',
                ],
                'razorpay' => [
                    'enabled' => false,
                    'key_id' => '',
                    'key_secret' => '',
                ],
            ],
            'features' => [
                'enable_registration' => true,
                'enable_rsvp' => true,
                'enable_ticketing' => true,
                'enable_maps' => true,
                'enable_analytics' => true,
            ],
            'social_media' => [
                'facebook' => 'https://facebook.com/eventsystem',
                'twitter' => 'https://twitter.com/eventsystem',
                'instagram' => 'https://instagram.com/eventsystem',
                'linkedin' => 'https://linkedin.com/company/eventsystem',
            ],
            'contact_info' => [
                'email' => 'admin@example.com',
                'phone' => '+1 (555) 123-4567',
                'address' => '123 Event Street, City, State 12345',
            ],
        ];

        DB::table('website_settings')->insert([
            'site_settings' => json_encode($settings['site_settings']),
            'payment_gateways' => json_encode($settings['payment_gateways']),
            'features' => json_encode($settings['features']),
            'social_media' => json_encode($settings['social_media']),
            'contact_info' => json_encode($settings['contact_info']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
