<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'Tech Conference 2024',
                'description' => 'Join us for the biggest tech conference of the year featuring industry leaders and cutting-edge innovations.',
                'date' => now()->addDays(30),
                'venue' => 'Convention Center',
                'price' => 299.99,
                'total_seats' => 500,
                'available_seats' => 500,
                'status' => 'published',
            ],
            [
                'title' => 'Music Festival',
                'description' => 'A weekend of amazing music featuring top artists from around the world.',
                'date' => now()->addDays(45),
                'venue' => 'Central Park',
                'price' => 149.99,
                'total_seats' => 1000,
                'available_seats' => 1000,
                'status' => 'published',
            ],
            [
                'title' => 'Business Workshop',
                'description' => 'Learn essential business skills from successful entrepreneurs.',
                'date' => now()->addDays(15),
                'venue' => 'Business Center',
                'price' => 99.99,
                'total_seats' => 100,
                'available_seats' => 100,
                'status' => 'published',
            ],
            [
                'title' => 'Art Exhibition',
                'description' => 'Discover amazing artworks from local and international artists.',
                'date' => now()->addDays(60),
                'venue' => 'Art Gallery',
                'price' => 49.99,
                'total_seats' => 200,
                'available_seats' => 200,
                'status' => 'published',
            ],
            [
                'title' => 'Food & Wine Festival',
                'description' => 'Taste the finest cuisines and wines from around the world.',
                'date' => now()->addDays(90),
                'venue' => 'Downtown Plaza',
                'price' => 199.99,
                'total_seats' => 300,
                'available_seats' => 300,
                'status' => 'published',
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
