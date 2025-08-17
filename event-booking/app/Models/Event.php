<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image',
        'date',
        'venue',
        'location',
        'latitude',
        'longitude',
        'show_map',
        'enable_ticketing',
        'enable_rsvp',
        'price',
        'total_seats',
        'available_seats',
        'status',
    ];

    protected $casts = [
        'date' => 'datetime',
        'price' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'show_map' => 'boolean',
        'enable_ticketing' => 'boolean',
        'enable_rsvp' => 'boolean',
    ];

    /**
     * Get the bookings for the event.
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get the ticket types for the event.
     */
    public function ticketTypes()
    {
        return $this->hasMany(TicketType::class);
    }

    /**
     * Get the RSVPs for the event.
     */
    public function rsvps()
    {
        return $this->hasMany(RSVP::class);
    }

    /**
     * Check if event is published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    /**
     * Check if event has available seats.
     */
    public function hasAvailableSeats(): bool
    {
        return $this->available_seats > 0;
    }

    /**
     * Check if event has location coordinates.
     */
    public function hasLocation(): bool
    {
        return !is_null($this->latitude) && !is_null($this->longitude);
    }

    /**
     * Boot method to set available_seats when creating an event
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (!isset($event->available_seats)) {
                $event->available_seats = $event->total_seats;
            }
        });
    }
}
