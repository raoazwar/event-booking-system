<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TicketType extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'price',
        'description',
        'available_quantity',
        'max_per_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'available_quantity' => 'integer',
        'max_per_order' => 'integer',
    ];

    /**
     * Get the event that owns the ticket type.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Check if tickets are available.
     */
    public function hasAvailableTickets(): bool
    {
        return $this->available_quantity > 0;
    }
}
