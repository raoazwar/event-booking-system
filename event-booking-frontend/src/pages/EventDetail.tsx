import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventsAPI, bookingsAPI, rsvpAPI } from '../services/api';
import { Event, Booking } from '../types';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { AnimatedContainer } from '../components/ui/animated-container';
import GoogleMap from '../components/GoogleMap';
import RSVPForm from '../components/RSVPForm';
import TicketPurchase from '../components/TicketPurchase';
import { Calendar, MapPin, Users, DollarSign, Clock, Star, ArrowLeft, CreditCard } from 'lucide-react';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState<number | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getById(parseInt(id!));
      setEvent(response.data);
    } catch (error: any) {
      console.error('Error fetching event:', error);
      setBookingError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user || !event) return;

    try {
      setBookingLoading(true);
      setBookingError(null);
      
      const bookingData: any = {
        event_id: event.id!,
        ticket_count: ticketCount,
      };

      if (selectedTicketType) {
        bookingData.ticket_type_id = selectedTicketType;
      }

      await bookingsAPI.create(bookingData);
      setBookingSuccess(true);
      
      // Redirect to profile page after successful booking
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      setBookingError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePurchaseSuccess = (bookingData: any) => {
    console.log('Purchase successful:', bookingData);
    // You can handle the successful purchase here
    // For now, just show success message
    setBookingSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  const handleRSVPSubmit = async (rsvpData: any) => {
    try {
      await rsvpAPI.create({
        event_id: event!.id!,
        ...rsvpData
      });
      // You could add a success message here
      console.log('RSVP submitted successfully');
    } catch (error: any) {
      console.error('Error submitting RSVP:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading event details..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Event not found</h1>
          <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/events')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { variant: 'success' as const, text: 'Published' },
      draft: { variant: 'secondary' as const, text: 'Draft' },
      cancelled: { variant: 'destructive' as const, text: 'Cancelled' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} size="sm">
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <AnimatedContainer animation="slideRight" className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/events')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
        </AnimatedContainer>

        {/* Event Header */}
        <AnimatedContainer animation="slideDown" className="mb-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusBadge(event.status)}
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">{event.title}</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{event.description}</p>
          </div>
        </AnimatedContainer>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Image */}
            {event.image && (
              <AnimatedContainer animation="slideUp" delay={200}>
                <Card className="overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-64 object-cover"
                  />
                </Card>
              </AnimatedContainer>
            )}

            {/* Event Information */}
            <AnimatedContainer animation="slideUp" delay={300}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-primary" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formatDate(event.date)}</p>
                        <p className="text-sm text-muted-foreground">{formatTime(event.date)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Venue</p>
                        <p className="text-sm text-muted-foreground">{event.venue}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Available Seats</p>
                        <p className="text-sm text-muted-foreground">
                          {event.available_seats || event.total_seats} / {event.total_seats}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Price</p>
                        <p className="text-sm text-muted-foreground">${parseFloat(event.price).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            {/* Google Map */}
            {event.show_map && event.location && (
              <AnimatedContainer animation="slideUp" delay={400}>
                <GoogleMap 
                  location={event.location} 
                  eventTitle={event.title} 
                />
              </AnimatedContainer>
            )}

            {/* RSVP Form */}
            {(event.enable_rsvp !== false && event.rsvp_enabled !== false) && (
              <AnimatedContainer animation="slideUp" delay={500}>
                <RSVPForm 
                  onSubmit={handleRSVPSubmit}
                  eventTitle={event.title}
                />
              </AnimatedContainer>
            )}
          </div>

          {/* Sidebar - Booking Section */}
          <div className="space-y-6">
            <AnimatedContainer animation="slideLeft" delay={400}>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Book Tickets
                  </CardTitle>
                  <CardDescription>
                    Secure your spot at this amazing event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ticket Type Selection */}
                  {(event.enable_ticketing !== false) && event.ticket_types && event.ticket_types.length > 0 ? (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Select Ticket Type</label>
                      {event.ticket_types.map((ticketType) => (
                        <div
                          key={ticketType.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedTicketType === ticketType.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedTicketType(ticketType.id || null)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{ticketType.name}</p>
                              <p className="text-sm text-muted-foreground">{ticketType.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">${ticketType.price}</p>
                              <div className="text-xs text-muted-foreground">
                                {ticketType.available_quantity} available
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (event.enable_ticketing !== false) ? (
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        {event.ticket_types && event.ticket_types.length > 0 ? 'Available Tickets' : 'Event Tickets'}
                      </label>
                      <div className="p-3 border rounded-lg bg-muted/20">
                        <div className="text-center">
                          <p className="font-medium">{event.title} - {event.venue ? `${event.venue} Tickets` : 'Event Tickets'}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.available_seats || event.total_seats} seats available at ${parseFloat(event.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        Ticketing system is disabled for this event
                      </p>
                    </div>
                  )}

                  {/* Ticket Count - Always show if ticketing is enabled */}
                  {(event.enable_ticketing !== false) && (
                    <div>
                      <label className="text-sm font-medium text-foreground">Number of Tickets</label>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                          disabled={ticketCount <= 1}
                        >
                          -
                        </Button>
                        <span className="px-4 py-2 border rounded-md min-w-[60px] text-center">
                          {ticketCount}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTicketCount(ticketCount + 1)}
                          disabled={ticketCount >= (event.available_seats || event.total_seats)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Total Price - Always show if ticketing is enabled */}
                  {(event.enable_ticketing !== false) && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-medium">Total Price:</span>
                        <span className="text-2xl font-bold text-primary">
                          ${(parseFloat(event.price) * ticketCount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Book Button */}
                  {user ? (
                    <Button
                      onClick={() => setShowPurchaseModal(true)}
                      disabled={bookingLoading || bookingSuccess}
                      className="w-full"
                      size="lg"
                    >
                      {bookingLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Processing...
                        </>
                      ) : bookingSuccess ? (
                        'Booking Successful!'
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Purchase Tickets
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate('/login')}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      Login to Purchase
                    </Button>
                  )}

                  {/* Error Message */}
                  {bookingError && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                      {bookingError}
                    </div>
                  )}

                  {/* Success Message */}
                  {bookingSuccess && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                      Your booking has been confirmed! Redirecting to your profile...
                    </div>
                  )}
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>
        </div>
      </div>

      {/* Ticket Purchase Modal */}
      <TicketPurchase
        event={event}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
};

export default EventDetail;
