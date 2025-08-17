<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventAnalyticsController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WebsiteSettingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Test endpoint to check CORS
Route::get('/test', function () {
    return response()->json(['message' => 'CORS is working!', 'timestamp' => now()]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes (no authentication required)
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

// Payment routes
// Route::get('/payment/gateways', [PaymentController::class, 'getPaymentGateways']); // Removed - duplicate route

// PayPal routes
Route::post('/payment/paypal/create-order', [PaymentController::class, 'createPayPalOrder']);
Route::post('/payment/paypal/capture-order', [PaymentController::class, 'capturePayPalOrder']);

// Stripe routes
Route::post('/payment/stripe/create-checkout', [PaymentController::class, 'createStripeCheckout']);
Route::post('/payment/stripe/webhook', [PaymentController::class, 'handleStripeWebhook']);

// Test endpoint for development (remove in production)
Route::post('/payment/stripe/test-webhook', [PaymentController::class, 'testStripeWebhook']);

// Website settings routes
Route::get('/website-settings', [WebsiteSettingsController::class, 'index']);
Route::post('/website-settings', [WebsiteSettingsController::class, 'update']);
Route::get('/payment/gateways', [WebsiteSettingsController::class, 'getPaymentGateways']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin-only event management
    Route::middleware('is_admin')->group(function () {
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);
    });

    // Bookings (requires authentication)
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::delete('/bookings/{id}', [BookingController::class, 'cancel']);
    Route::get('/bookings/{id}/qr-code', [BookingController::class, 'getQRCode']);

    // Dashboard (admin only)
    Route::middleware('is_admin')->group(function () {
        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/dashboard/events/{id}/analytics', [DashboardController::class, 'getEventAnalytics']);
        Route::get('/dashboard/analytics/events', [EventAnalyticsController::class, 'getEventPerformance']);
        Route::get('/dashboard/analytics/revenue', [EventAnalyticsController::class, 'getRevenueAnalytics']);
        Route::get('/dashboard/analytics/users', [EventAnalyticsController::class, 'getUserAnalytics']);
        Route::get('/dashboard/analytics/realtime', [EventAnalyticsController::class, 'getRealTimeStats']);
    });
});
