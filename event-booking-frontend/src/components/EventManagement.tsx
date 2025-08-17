import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { eventsAPI } from '../services/api';
import EventForm from './EventForm';
import { Event } from '../types';

const EventManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter]);

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredEvents(filtered);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || !eventToDelete.id) return;

    try {
      await eventsAPI.delete(eventToDelete.id!);
      await fetchEvents();
      setShowDeleteDialog(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleCreateEvent = async (eventData: any) => {
    try {
      // Combine date and time into a single datetime string
      const combinedDateTime = `${eventData.date}T${eventData.time}:00`;
      
      const eventPayload = {
        ...eventData,
        date: combinedDateTime,
        price: parseFloat(eventData.price),
        total_seats: parseInt(eventData.total_seats),
        show_map: eventData.show_map || false,
        enable_ticketing: eventData.enable_ticketing || false,
        enable_rsvp: eventData.enable_rsvp || false,
      };

      console.log('Creating event with payload:', eventPayload);
      await eventsAPI.create(eventPayload);
      await fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async (eventData: any) => {
    if (!selectedEvent?.id) return;

    try {
      // Combine date and time into a single datetime string
      const combinedDateTime = `${eventData.date}T${eventData.time}:00`;
      
      const eventPayload = {
        ...eventData,
        date: combinedDateTime,
        price: parseFloat(eventData.price),
        total_seats: parseInt(eventData.total_seats),
        show_map: eventData.show_map || false,
        enable_ticketing: eventData.enable_ticketing || false,
        enable_rsvp: eventData.enable_rsvp || false,
      };

      await eventsAPI.update(selectedEvent.id, eventPayload);
      await fetchEvents();
      setShowEventDetails(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Published</Badge>;
      case 'draft':
        return <Badge className="bg-muted text-muted-foreground">Draft</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Event Management</h2>
          <p className="text-muted-foreground">Manage all your events from one place</p>
        </div>
        <EventForm onSubmit={handleCreateEvent} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {event.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusBadge(event.status)}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowEventDetails(true);
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(event.date)} at {formatTime(event.date)}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {event.venue}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {event.available_seats} / {event.total_seats} seats
                </div>
                <div className="font-semibold text-primary">
                  {formatCurrency(event.price)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredEvents.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating your first event'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <EventForm onSubmit={handleCreateEvent} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Event Details Dialog */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>Event details and actions</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            {selectedEvent && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Status:</span>
                    <div className="mt-1">{getStatusBadge(selectedEvent.status)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Price:</span>
                    <div className="mt-1">{formatCurrency(selectedEvent.price)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>
                    <div className="mt-1">{formatDate(selectedEvent.date)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Time:</span>
                    <div className="mt-1">{formatTime(selectedEvent.date)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Venue:</span>
                    <div className="mt-1">{selectedEvent.venue}</div>
                  </div>
                  <div>
                    <span className="font-medium">Seats:</span>
                    <div className="mt-1">{selectedEvent.available_seats} / {selectedEvent.total_seats}</div>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>

                {/* Edit Form */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Edit Event</h4>
                  <EventForm 
                    onSubmit={handleUpdateEvent}
                    event={{
                      title: selectedEvent.title,
                      description: selectedEvent.description,
                      date: selectedEvent.date.split('T')[0],
                      time: selectedEvent.date.split('T')[1]?.substring(0, 5) || '',
                      venue: selectedEvent.venue,
                      location: selectedEvent.location || '',
                      price: selectedEvent.price.toString(),
                      total_seats: selectedEvent.total_seats.toString(),
                      image: selectedEvent.image || '',
                      status: selectedEvent.status,
                      show_map: selectedEvent.show_map || false,
                      enable_ticketing: selectedEvent.enable_ticketing || false,
                      enable_rsvp: selectedEvent.enable_rsvp || false,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowEventDetails(false);
                setSelectedEvent(null);
              }}
            >
              Close
            </Button>
            {selectedEvent && (
              <Button
                variant="destructive"
                onClick={() => {
                  setEventToDelete(selectedEvent);
                  setShowDeleteDialog(true);
                  setShowEventDetails(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManagement;
