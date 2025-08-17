import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Search, Filter, MoreHorizontal, Calendar, User, DollarSign, Ticket, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
  id: number;
  user: {
    name: string;
    email: string;
  };
  event: {
    title: string;
    date: string;
    venue: string;
  };
  ticket_count: number;
  total_amount: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  payment_status: 'pending' | 'completed' | 'failed';
}

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, paymentFilter]);

  const fetchBookings = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockBookings: Booking[] = [
        {
          id: 1,
          user: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          event: {
            title: 'Tech Conference 2025',
            date: '2025-03-15T09:00:00Z',
            venue: 'Convention Center'
          },
          ticket_count: 2,
          total_amount: '99.98',
          status: 'confirmed',
          created_at: '2025-01-15T10:30:00Z',
          payment_status: 'completed'
        },
        {
          id: 2,
          user: {
            name: 'Jane Smith',
            email: 'jane@example.com'
          },
          event: {
            title: 'Music Festival',
            date: '2025-04-20T18:00:00Z',
            venue: 'City Park'
          },
          ticket_count: 1,
          total_amount: '49.99',
          status: 'pending',
          created_at: '2025-01-20T14:15:00Z',
          payment_status: 'pending'
        },
        {
          id: 3,
          user: {
            name: 'Mike Johnson',
            email: 'mike@example.com'
          },
          event: {
            title: 'Art Exhibition',
            date: '2025-02-10T11:00:00Z',
            venue: 'Gallery Space'
          },
          ticket_count: 3,
          total_amount: '89.97',
          status: 'cancelled',
          created_at: '2025-01-10T16:45:00Z',
          payment_status: 'failed'
        }
      ];
      
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings.filter(booking => {
      const matchesSearch = 
        booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.event.title.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || booking.payment_status === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    });

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Failed</Badge>;
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

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
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
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">Monitor and manage all event bookings</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total Bookings: {bookings.length}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
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
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Payments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{booking.event.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {booking.user.name} • {booking.user.email}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusBadge(booking.status)}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowBookingDetails(true);
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
                {formatDate(booking.event.date)} at {formatTime(booking.event.date)}
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Ticket className="h-4 w-4 mr-2" />
                {booking.ticket_count} ticket{booking.ticket_count !== 1 ? 's' : ''}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {formatCurrency(booking.total_amount)}
                </div>
                <div className="flex items-center gap-2">
                  {getPaymentStatusBadge(booking.payment_status)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredBookings.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No bookings found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'No bookings have been made yet'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete information about this booking</DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Customer:</span>
                  <div className="mt-1">
                    <div>{selectedBooking.user.name}</div>
                    <div className="text-muted-foreground">{selectedBooking.user.email}</div>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Event:</span>
                  <div className="mt-1">
                    <div>{selectedBooking.event.title}</div>
                    <div className="text-muted-foreground">{selectedBooking.event.venue}</div>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Date & Time:</span>
                  <div className="mt-1">
                    {formatDate(selectedBooking.event.date)} at {formatTime(selectedBooking.event.date)}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Tickets:</span>
                  <div className="mt-1">{selectedBooking.ticket_count}</div>
                </div>
                <div>
                  <span className="font-medium">Total Amount:</span>
                  <div className="mt-1 font-semibold">{formatCurrency(selectedBooking.total_amount)}</div>
                </div>
                <div>
                  <span className="font-medium">Booking Status:</span>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
                <div>
                  <span className="font-medium">Payment Status:</span>
                  <div className="mt-1">{getPaymentStatusBadge(selectedBooking.payment_status)}</div>
                </div>
                <div>
                  <span className="font-medium">Booked On:</span>
                  <div className="mt-1">{formatDate(selectedBooking.created_at)}</div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowBookingDetails(false);
                setSelectedBooking(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingManagement;
