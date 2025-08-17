<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Services\BookingService;
use App\Http\Requests\StoreBookingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BookingController extends Controller
{
    protected $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    public function store(StoreBookingRequest $request)
    {
        try {
            $booking = $this->bookingService->createBooking(
                $request->validated(),
                $request->user()
            );

            return response()->json([
                'booking' => $booking->load(['event', 'user']),
                'message' => 'Booking created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function index(Request $request)
    {
        $bookings = $request->user()->bookings()->with('event')->get();

        return response()->json($bookings);
    }

    public function show(Request $request, $id)
    {
        $booking = $request->user()->bookings()->with('event')->findOrFail($id);

        return response()->json($booking);
    }

    public function cancel(Request $request, $id)
    {
        $booking = $request->user()->bookings()->findOrFail($id);
        
        try {
            $this->bookingService->cancelBooking($booking);
            
            return response()->json([
                'message' => 'Booking cancelled successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function getQRCode(Request $request, $id)
    {
        $booking = $request->user()->bookings()->findOrFail($id);
        
        if (!$booking->qr_code) {
            return response()->json([
                'message' => 'QR code not available for this booking'
            ], 404);
        }
        
        $path = storage_path('app/public/' . $booking->qr_code);
        
        if (!file_exists($path)) {
            return response()->json([
                'message' => 'QR code file not found'
            ], 404);
        }
        
        return response()->file($path);
    }
}
