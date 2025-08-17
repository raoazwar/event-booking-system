import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  price: string;
  total_seats: string;
  image: string;
  status: string;
  show_map: boolean;
  enable_ticketing: boolean;
  enable_rsvp: boolean;
}

interface EventFormProps {
  event?: EventFormData;
  onSubmit: (data: EventFormData) => void;
  loading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    location: '',
    price: '',
    total_seats: '',
    image: '',
    status: 'draft',
    show_map: false,
    enable_ticketing: false,
    enable_rsvp: false,
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleInputChange = (field: keyof EventFormData, value: string | number | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data being submitted:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full border border-input bg-background text-foreground px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            required
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Enter event description"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="time">Time *</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => handleInputChange('time', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="venue">Venue *</Label>
          <Input
            id="venue"
            value={formData.venue}
            onChange={(e) => handleInputChange('venue', e.target.value)}
            placeholder="Enter venue name"
            required
          />
        </div>

        <div>
          <Label htmlFor="location">Location Address *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="Enter full address (e.g., 123 Main St, City, State)"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <Label htmlFor="total_seats">Total Seats *</Label>
          <Input
            id="total_seats"
            type="number"
            min="1"
            value={formData.total_seats}
            onChange={(e) => handleInputChange('total_seats', e.target.value)}
            placeholder="100"
            required
          />
        </div>

        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => handleInputChange('image', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Event Features</h3>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="show_map">Show Google Map</Label>
            <p className="text-sm text-muted-foreground">
              Display a map showing the event location
            </p>
          </div>
          <Switch
            id="show_map"
            checked={formData.show_map}
            onCheckedChange={(checked) => handleInputChange('show_map', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enable_ticketing">Enable Ticketing System</Label>
            <p className="text-sm text-muted-foreground">
              Allow users to purchase tickets with different types
            </p>
          </div>
          <Switch
            id="enable_ticketing"
            checked={formData.enable_ticketing}
            onCheckedChange={(checked) => handleInputChange('enable_ticketing', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="enable_rsvp">Enable RSVP System</Label>
            <p className="text-sm text-muted-foreground">
              Allow users to RSVP for the event
            </p>
          </div>
          <Switch
            id="enable_rsvp"
            checked={formData.enable_rsvp}
            onCheckedChange={(checked) => handleInputChange('enable_rsvp', checked)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : (
            'Save Event'
          )}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
