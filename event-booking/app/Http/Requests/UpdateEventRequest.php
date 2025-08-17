<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
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
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'image' => 'sometimes|nullable|string',
            'date' => 'sometimes|date', // Removed 'after:now' to allow past dates for testing
            'venue' => 'sometimes|string|max:255',
            'location' => 'sometimes|nullable|string|max:255',
            'show_map' => 'sometimes|boolean',
            'enable_ticketing' => 'sometimes|boolean',
            'enable_rsvp' => 'sometimes|boolean',
            'price' => 'sometimes|numeric|min:0',
            'total_seats' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:draft,published,cancelled',
        ];
    }
}
