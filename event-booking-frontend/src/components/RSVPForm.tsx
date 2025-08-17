import React, { useState } from 'react';
import { Users, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface RSVPFormProps {
  eventTitle: string;
  onSubmit: (rsvpData: RSVPFormData) => Promise<void>;
}

interface RSVPFormData {
  name: string;
  email: string;
  phone: string;
  guest_count: number;
  message?: string;
}

const RSVPForm: React.FC<RSVPFormProps> = ({
  eventTitle,
  onSubmit
}) => {
  const [formData, setFormData] = useState<RSVPFormData>({
    name: '',
    email: '',
    phone: '',
    guest_count: 1,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        guest_count: 1,
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit RSVP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof RSVPFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">RSVP Submitted!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for your RSVP. We look forward to seeing you at {eventTitle}!
          </p>
          <Button
            onClick={() => setSuccess(false)}
            variant="outline"
            className="flex items-center gap-2"
          >
            Submit Another RSVP
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600" />
          RSVP for this Event
        </CardTitle>
        <CardDescription>
          Let us know if you'll be attending {eventTitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rsvp_name">Full Name *</Label>
              <Input
                id="rsvp_name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="rsvp_email">Email Address *</Label>
              <Input
                id="rsvp_email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rsvp_phone">Phone Number *</Label>
              <Input
                id="rsvp_phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <Label htmlFor="rsvp_guest_count">Number of Guests *</Label>
              <select
                id="rsvp_guest_count"
                value={formData.guest_count}
                onChange={(e) => handleInputChange('guest_count', parseInt(e.target.value))}
                className="w-full border border-input bg-background text-foreground px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>
                    {num} guest{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="rsvp_message">Additional Message (Optional)</Label>
            <Textarea
              id="rsvp_message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Any special requests or dietary requirements?"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.name || !formData.email || !formData.phone}
            className="w-full flex items-center gap-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
            {loading ? 'Submitting...' : 'Submit RSVP'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By submitting this RSVP, you agree to receive event updates and confirmations.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default RSVPForm;
