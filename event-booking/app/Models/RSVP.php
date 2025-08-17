<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RSVP extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'name',
        'email',
        'phone',
        'guest_count',
        'status',
    ];

    protected $casts = [
        'guest_count' => 'integer',
    ];

    /**
     * Get the event that owns the RSVP.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    /**
     * Check if RSVP is confirmed.
     */
    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    /**
     * Check if RSVP is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
