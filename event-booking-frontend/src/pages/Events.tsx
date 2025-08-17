import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Search, Filter, ArrowRight, Star, Clock, MapPin as LocationIcon } from 'lucide-react';
import { eventsAPI } from '../services/api';
import { Event } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { AnimatedContainer } from '../components/ui/animated-container';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedEvents = events
    .filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { variant: 'success' as const, icon: <Star className="h-3 w-3" />, text: 'Published' },
      draft: { variant: 'secondary' as const, icon: <Clock className="h-3 w-3" />, text: 'Draft' },
      cancelled: { variant: 'destructive' as const, icon: <Clock className="h-3 w-3" />, text: 'Cancelled' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant} size="sm" icon={config.icon} iconPosition="left">
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <AnimatedContainer animation="slideDown" className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find and book tickets for the best events in your area. From concerts to workshops, 
            we have something for everyone.
          </p>
        </AnimatedContainer>

        {/* Filters and Search */}
        <AnimatedContainer animation="slideUp" delay={200} className="mb-8">
          <Card variant="glass" className="p-6 border-0 bg-white/5 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by event name, description, or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'name')}
                className="border border-input bg-background text-foreground px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="name">Sort by Name</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-input bg-background text-foreground px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  // Reset filters to show all events
                  setSearchTerm('');
                  setFilterStatus('all');
                  setSortBy('date');
                }}
              >
                <Filter className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </Card>
        </AnimatedContainer>

        {/* Events Grid */}
        <AnimatedContainer animation="slideUp" delay={400} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map((event, index) => (
              <Card
                key={event.id}
                variant="elevated"
                hover
                className="group border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden"
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                {event.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(event.status)}
                    </div>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="font-medium">{formatDate(event.date)}</span>
                      <span className="mx-2">•</span>
                      <span>{formatTime(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      <LocationIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="line-clamp-1">{event.venue}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{event.available_seats || event.total_seats} available</span>
                      </div>
                      <div className="font-bold text-primary text-lg">
                        ${parseFloat(event.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Link to={`/events/${event.id}`} className="block">
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                        <span className="flex items-center justify-center w-full">
                          View Event Details
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AnimatedContainer>

        {/* No Events Message */}
        {filteredAndSortedEvents.length === 0 && (
          <AnimatedContainer animation="fadeIn" delay={800} className="text-center py-16">
            <Card variant="glass" className="max-w-md mx-auto border-0 bg-white/5 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or check back later for new events.
                </p>
                <Button onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </AnimatedContainer>
        )}
      </div>
    </div>
  );
};

export default Events;
