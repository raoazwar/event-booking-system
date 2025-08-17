<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::where('status', 'published')
                      ->orderBy('date', 'asc')
                      ->get();

        return response()->json($events);
    }

    public function show($id)
    {
        $event = Event::findOrFail($id);
        
        return response()->json($event);
    }

    public function store(StoreEventRequest $request)
    {
        try {
            $event = Event::create($request->validated());

            return response()->json([
                'event' => $event,
                'message' => 'Event created successfully'
            ], 201);
        } catch (\Exception $e) {
            Log::error('Event creation error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating event: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateEventRequest $request, $id)
    {
        $event = Event::findOrFail($id);
        $event->update($request->validated());

        return response()->json([
            'event' => $event,
            'message' => 'Event updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
}
