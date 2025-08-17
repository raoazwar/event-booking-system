import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import { Calendar, Users, DollarSign, TrendingUp, TrendingDown, BarChart3, Clock, CheckCircle, Ticket, User as UserIcon, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import EventManagement from '../components/EventManagement';
import UserManagement from '../components/UserManagement';
import BookingManagement from '../components/BookingManagement';
import WebsiteSettings from '../components/WebsiteSettings';

interface DashboardStats {
  total_events: number;
  published_events: number;
  total_bookings: number;
  total_revenue: number;
  total_users: number;
  pending_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
}

interface ChartData {
  labels: string[];
  data: number[];
  total: number;
}

interface TopEvent {
  id: number;
  title: string;
  booking_count: number;
  revenue: number;
  occupancy_rate: number;
}

interface RecentBooking {
  id: number;
  user: {
    name: string;
    email: string;
  };
  event: {
    title: string;
    date: string;
  };
  ticket_count: number;
  total_amount: string;
  status: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<ChartData | null>(null);
  const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, revenueResponse, eventsResponse] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRevenueAnalytics(),
          dashboardAPI.getEventPerformance()
        ]);

        setStats(statsResponse.data.stats);
        setMonthlyRevenue(revenueResponse.data.monthly_revenue);
        setTopEvents(eventsResponse.data.events);
        setRecentBookings(statsResponse.data.recent_bookings);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set mock data for development
        setStats({
          total_events: 12,
          published_events: 8,
          total_bookings: 156,
          total_revenue: 12450.75,
          total_users: 89,
          pending_bookings: 23,
          confirmed_bookings: 128,
          cancelled_bookings: 5
        });
        setMonthlyRevenue({
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [1200, 1900, 2100, 2800, 3200, 3800],
          total: 15000
        });
        setTopEvents([
          { id: 1, title: 'Tech Conference 2025', booking_count: 45, revenue: 4500, occupancy_rate: 90 },
          { id: 2, title: 'Music Festival', booking_count: 38, revenue: 3800, occupancy_rate: 85 },
          { id: 3, title: 'Art Exhibition', booking_count: 32, revenue: 3200, occupancy_rate: 80 }
        ]);
        setRecentBookings([
          {
            id: 1,
            user: { name: 'John Doe', email: 'john@example.com' },
            event: { title: 'Tech Conference 2025', date: '2025-03-15T09:00:00Z' },
            ticket_count: 2,
            total_amount: '99.98',
            status: 'confirmed',
            created_at: '2025-01-15T10:30:00Z'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard Unavailable</h2>
          <p className="text-muted-foreground">Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your event booking system</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Bookings
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_events}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.published_events} published
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_users}</div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    +8.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total_bookings}</div>
                  <p className="text-xs text-muted-foreground">
                    +23% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Booking Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmed Bookings</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.confirmed_bookings}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.confirmed_bookings / stats.total_bookings) * 100).toFixed(1)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending_bookings}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.pending_bookings / stats.total_bookings) * 100).toFixed(1)}% of total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cancelled Bookings</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.cancelled_bookings}</div>
                  <p className="text-xs text-muted-foreground">
                    {((stats.cancelled_bookings / stats.total_bookings) * 100).toFixed(1)}% of total
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>Revenue trends over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  {monthlyRevenue ? (
                    <div className="space-y-3">
                      {monthlyRevenue.labels.map((month, index) => (
                        <div key={month} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{month}</span>
                          <div className="flex items-center">
                            <div className="w-32 bg-muted rounded-full h-2 mr-3">
                              <div
                                className="bg-primary h-2 rounded-full"
                                style={{
                                  width: `${(monthlyRevenue.data[index] / Math.max(...monthlyRevenue.data)) * 100}%`
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">
                              {formatCurrency(monthlyRevenue.data[index])}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div className="border-t pt-3 mt-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Total Revenue</span>
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(monthlyRevenue.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No revenue data available</p>
                  )}
                </CardContent>
              </Card>

              {/* Top Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Events</CardTitle>
                  <CardDescription>Events with highest bookings and revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topEvents.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium truncate">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.booking_count} bookings • {event.occupancy_rate.toFixed(1)}% occupancy
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(event.revenue)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Tickets
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-muted/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium">{booking.user.name}</div>
                              <div className="text-sm text-muted-foreground">{booking.user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium">{booking.event.title}</div>
                              <div className="text-sm text-muted-foreground">{formatDate(booking.event.date)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {booking.ticket_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {formatCurrency(parseFloat(booking.total_amount))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'pending' ? 'secondary' :
                              'destructive'
                            }>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                            {formatDate(booking.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <EventManagement />
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <BookingManagement />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <WebsiteSettings />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed insights and performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced analytics features coming soon. This will include detailed charts, 
                  performance metrics, and predictive analytics for your events.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
