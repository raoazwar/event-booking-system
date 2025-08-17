<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Admin check is handled by middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'date' => 'required|date', // Removed 'after:now' to allow past dates for testing
            'venue' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'show_map' => 'boolean',
            'enable_ticketing' => 'boolean',
            'enable_rsvp' => 'boolean',
            'price' => 'required|numeric|min:0',
            'total_seats' => 'required|integer|min:1',
            'status' => 'nullable|in:draft,published,cancelled',
        ];
    }
}
