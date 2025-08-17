import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Save, X, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { RSVP } from '../types';

interface RSVPManagerProps {
  eventId: number;
  rsvpEnabled: boolean;
  onRSVPEnabledChange: (enabled: boolean) => void;
  rsvps: RSVP[];
  onRSVPsUpdate: (rsvps: RSVP[]) => void;
}

const RSVPManager: React.FC<RSVPManagerProps> = ({
  eventId,
  rsvpEnabled,
  onRSVPEnabledChange,
  rsvps,
  onRSVPsUpdate
}) => {
  const [editingRSVP, setEditingRSVP] = useState<RSVP | null>(null);
  const [newRSVP, setNewRSVP] = useState<Partial<RSVP>>({
    name: '',
    email: '',
    phone: '',
    guest_count: 1,
    status: 'pending'
  });

  const handleAddRSVP = () => {
    if (!newRSVP.name || !newRSVP.email || !newRSVP.phone) {
      return;
    }

    const rsvp: RSVP = {
      id: Date.now(), // Temporary ID for frontend
      event_id: eventId,
      name: newRSVP.name!,
      email: newRSVP.email!,
      phone: newRSVP.phone!,
      guest_count: newRSVP.guest_count || 1,
      status: newRSVP.status || 'pending',
      created_at: new Date().toISOString()
    };

    const updatedRSVPs = [...rsvps, rsvp];
    onRSVPsUpdate(updatedRSVPs);
    
    // Reset form
    setNewRSVP({
      name: '',
      email: '',
      phone: '',
      guest_count: 1,
      status: 'pending'
    });
  };

  const handleEditRSVP = (rsvp: RSVP) => {
    setEditingRSVP(rsvp);
  };

  const handleSaveEdit = () => {
    if (!editingRSVP) return;

    const updatedRSVPs = rsvps.map(rsvp =>
      rsvp.id === editingRSVP.id ? editingRSVP : rsvp
    );
    onRSVPsUpdate(updatedRSVPs);
    setEditingRSVP(null);
  };

  const handleDeleteRSVP = (rsvpId: number) => {
    const updatedRSVPs = rsvps.filter(rsvp => rsvp.id !== rsvpId);
    onRSVPsUpdate(updatedRSVPs);
  };

  const handleCancelEdit = () => {
    setEditingRSVP(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const totalGuests = rsvps.reduce((sum, rsvp) => sum + rsvp.guest_count, 0);
  const confirmedGuests = rsvps
    .filter(rsvp => rsvp.status === 'confirmed')
    .reduce((sum, rsvp) => sum + rsvp.guest_count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          RSVP Management
        </CardTitle>
        <CardDescription>Manage RSVP functionality and responses for this event</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* RSVP System Toggle */}
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
          <div>
            <Label htmlFor="rsvp_enabled" className="text-base font-medium">Enable RSVP System</Label>
            <p className="text-sm text-muted-foreground">Allow guests to RSVP for this event</p>
          </div>
          <Switch
            id="rsvp_enabled"
            checked={rsvpEnabled}
            onCheckedChange={onRSVPEnabledChange}
          />
        </div>

        {rsvpEnabled && (
          <>
            {/* RSVP Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{rsvps.length}</div>
                <div className="text-sm text-muted-foreground">Total RSVPs</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{totalGuests}</div>
                <div className="text-sm text-muted-foreground">Total Guests</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{confirmedGuests}</div>
                <div className="text-sm text-muted-foreground">Confirmed Guests</div>
              </div>
            </div>

            {/* Add New RSVP */}
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-4">Add New RSVP</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="rsvp_name">Name</Label>
                  <Input
                    id="rsvp_name"
                    value={newRSVP.name}
                    onChange={(e) => setNewRSVP(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Guest name"
                  />
                </div>
                <div>
                  <Label htmlFor="rsvp_email">Email</Label>
                  <Input
                    id="rsvp_email"
                    type="email"
                    value={newRSVP.email}
                    onChange={(e) => setNewRSVP(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="guest@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="rsvp_phone">Phone</Label>
                  <Input
                    id="rsvp_phone"
                    value={newRSVP.phone}
                    onChange={(e) => setNewRSVP(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="rsvp_guest_count">Guest Count</Label>
                  <Input
                    id="rsvp_guest_count"
                    type="number"
                    min="1"
                    value={newRSVP.guest_count}
                    onChange={(e) => setNewRSVP(prev => ({ ...prev, guest_count: parseInt(e.target.value) || 1 }))}
                    placeholder="1"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="rsvp_status">Status</Label>
                <select
                  id="rsvp_status"
                  value={newRSVP.status}
                  onChange={(e) => setNewRSVP(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full border border-input bg-background text-foreground px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <Button
                onClick={handleAddRSVP}
                className="mt-4 flex items-center gap-2"
                disabled={!newRSVP.name || !newRSVP.email || !newRSVP.phone}
              >
                <Plus className="h-4 w-4" />
                Add RSVP
              </Button>
            </div>

            {/* Existing RSVPs */}
            {rsvps.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">RSVP Responses</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Guests
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {rsvps.map((rsvp) => (
                        <tr key={rsvp.id} className="hover:bg-muted/50">
                          <td className="px-4 py-4">
                            <div className="text-sm font-medium text-foreground">{rsvp.name}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-foreground">{rsvp.email}</div>
                            <div className="text-sm text-muted-foreground">{rsvp.phone}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-foreground">{rsvp.guest_count} guest{rsvp.guest_count > 1 ? 's' : ''}</div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge variant={getStatusBadgeVariant(rsvp.status)} className="flex items-center gap-1">
                              {getStatusIcon(rsvp.status)}
                              {rsvp.status.charAt(0).toUpperCase() + rsvp.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-muted-foreground">
                              {new Date(rsvp.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditRSVP(rsvp)}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteRSVP(rsvp.id!)}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No RSVP responses yet.</p>
                <p className="text-sm">RSVPs will appear here once guests start responding.</p>
              </div>
            )}
          </>
        )}

        {!rsvpEnabled && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>RSVP system is currently disabled.</p>
            <p className="text-sm">Enable it above to start collecting RSVPs for this event.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RSVPManager;
