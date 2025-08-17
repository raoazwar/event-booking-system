<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class WebsiteSettingsController extends Controller
{
    /**
     * Get website settings
     */
    public function index()
    {
        try {
            $settings = DB::table('website_settings')->first();
            
            if (!$settings) {
                return response()->json([
                    'success' => false,
                    'message' => 'Website settings not found'
                ], 404);
            }

            $siteSettings = json_decode($settings->site_settings, true);
            $paymentGateways = json_decode($settings->payment_gateways, true);
            $features = json_decode($settings->features, true);
            $socialMedia = json_decode($settings->social_media, true);
            $contactInfo = json_decode($settings->contact_info, true);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'site_name' => $siteSettings['site_name'] ?? '',
                    'site_description' => $siteSettings['site_description'] ?? '',
                    'contact_email' => $siteSettings['contact_email'] ?? '',
                    'contact_phone' => $siteSettings['contact_phone'] ?? '',
                    'address' => $siteSettings['address'] ?? '',
                    'social_media' => $socialMedia ?? [],
                    'features' => $features ?? [],
                    'payment_gateways' => $paymentGateways ?? [],
                    'currency' => [
                        'code' => 'USD',
                        'symbol' => '$',
                        'position' => 'before',
                    ],
                    'tax_settings' => [
                        'enable_tax' => false,
                        'tax_rate' => 0,
                        'tax_name' => 'Sales Tax',
                    ],
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching website settings', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch website settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update website settings
     */
    public function update(Request $request)
    {
        try {
            $request->validate([
                'site_name' => 'required|string|max:255',
                'site_description' => 'nullable|string',
                'contact_email' => 'required|email',
                'contact_phone' => 'nullable|string',
                'address' => 'nullable|string',
                'social_media' => 'nullable|array',
                'features' => 'nullable|array',
                'payment_gateways' => 'nullable|array',
                'payment_gateways.stripe.enabled' => 'nullable|boolean',
                'payment_gateways.stripe.publishable_key' => 'nullable|string',
                'payment_gateways.stripe.secret_key' => 'nullable|string',
                'payment_gateways.stripe.webhook_secret' => 'nullable|string',
                'payment_gateways.stripe.mode' => 'nullable|string|in:test,live',
                'payment_gateways.paypal.enabled' => 'nullable|boolean',
                'payment_gateways.paypal.client_id' => 'nullable|string',
                'payment_gateways.paypal.client_secret' => 'nullable|string',
                'payment_gateways.paypal.mode' => 'nullable|string|in:sandbox,live',
                'payment_gateways.razorpay.enabled' => 'nullable|boolean',
                'payment_gateways.razorpay.key_id' => 'nullable|string',
                'payment_gateways.razorpay.key_secret' => 'nullable|string',
                'currency' => 'nullable|array',
                'tax_settings' => 'nullable|array',
            ]);

            $settings = DB::table('website_settings')->first();
            
            if (!$settings) {
                return response()->json([
                    'success' => false,
                    'message' => 'Website settings not found'
                ], 404);
            }

            // Get current settings
            $currentSiteSettings = json_decode($settings->site_settings, true) ?? [];
            $currentPaymentGateways = json_decode($settings->payment_gateways, true) ?? [];
            $currentFeatures = json_decode($settings->features, true) ?? [];
            $currentSocialMedia = json_decode($settings->social_media, true) ?? [];
            $currentContactInfo = json_decode($settings->contact_info, true) ?? [];

            // Update site settings
            $updatedSiteSettings = array_merge($currentSiteSettings, [
                'site_name' => $request->site_name,
                'site_description' => $request->site_description,
                'contact_email' => $request->contact_email,
                'contact_phone' => $request->contact_phone,
                'address' => $request->address,
            ]);

            // Update other settings if provided
            $updatedPaymentGateways = $request->payment_gateways ? array_merge($currentPaymentGateways, $request->payment_gateways) : $currentPaymentGateways;
            $updatedFeatures = $request->features ? array_merge($currentFeatures, $request->features) : $currentFeatures;
            $updatedSocialMedia = $request->social_media ? array_merge($currentSocialMedia, $request->social_media) : $currentSocialMedia;
            $updatedContactInfo = $request->contact_info ? array_merge($currentContactInfo, $request->contact_info) : $currentContactInfo;

            // Update the database
            DB::table('website_settings')
                ->where('id', $settings->id)
                ->update([
                    'site_settings' => json_encode($updatedSiteSettings),
                    'payment_gateways' => json_encode($updatedPaymentGateways),
                    'features' => json_encode($updatedFeatures),
                    'social_media' => json_encode($updatedSocialMedia),
                    'contact_info' => json_encode($updatedContactInfo),
                    'updated_at' => now(),
                ]);

            Log::info('Website settings updated successfully', [
                'settings' => [
                    'site_settings' => $updatedSiteSettings,
                    'payment_gateways' => $updatedPaymentGateways,
                ]
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Website settings updated successfully',
                'data' => [
                    'site_name' => $updatedSiteSettings['site_name'],
                    'site_description' => $updatedSiteSettings['site_description'],
                    'contact_email' => $updatedSiteSettings['contact_email'],
                    'contact_phone' => $updatedSiteSettings['contact_phone'],
                    'address' => $updatedSiteSettings['address'],
                    'social_media' => $updatedSocialMedia,
                    'features' => $updatedFeatures,
                    'payment_gateways' => $updatedPaymentGateways,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating website settings', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update website settings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment gateways configuration
     */
    public function getPaymentGateways()
    {
        try {
            $settings = DB::table('website_settings')->first();
            
            if (!$settings) {
                return response()->json([
                    'success' => false,
                    'message' => 'Website settings not found'
                ], 404);
            }

            $paymentGateways = json_decode($settings->payment_gateways, true);
            
            return response()->json([
                'success' => true,
                'data' => $paymentGateways
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching payment gateways', ['error' => $e->getMessage()]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch payment gateways',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
