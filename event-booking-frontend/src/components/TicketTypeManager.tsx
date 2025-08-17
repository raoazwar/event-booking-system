import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { TicketType } from '../types';

interface TicketTypeManagerProps {
  eventId: number;
  ticketTypes: TicketType[];
  onUpdate: (ticketTypes: TicketType[]) => void;
}

const TicketTypeManager: React.FC<TicketTypeManagerProps> = ({
  eventId,
  ticketTypes,
  onUpdate
}) => {
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [newTicket, setNewTicket] = useState<Partial<TicketType>>({
    name: '',
    price: 0,
    description: '',
    available_quantity: 0,
    max_per_order: 10
  });

  const handleAddTicket = () => {
    if (!newTicket.name || !newTicket.price || !newTicket.available_quantity) {
      return;
    }

    const ticket: TicketType = {
      id: Date.now(), // Temporary ID for frontend
      event_id: eventId,
      name: newTicket.name!,
      price: newTicket.price!,
      description: newTicket.description || '',
      available_quantity: newTicket.available_quantity!,
      max_per_order: newTicket.max_per_order || 10
    };

    const updatedTickets = [...ticketTypes, ticket];
    onUpdate(updatedTickets);
    
    // Reset form
    setNewTicket({
      name: '',
      price: 0,
      description: '',
      available_quantity: 0,
      max_per_order: 10
    });
  };

  const handleEditTicket = (ticket: TicketType) => {
    setEditingTicket(ticket);
  };

  const handleSaveEdit = () => {
    if (!editingTicket) return;

    const updatedTickets = ticketTypes.map(ticket =>
      ticket.id === editingTicket.id ? editingTicket : ticket
    );
    onUpdate(updatedTickets);
    setEditingTicket(null);
  };

  const handleDeleteTicket = (ticketId: number) => {
    const updatedTickets = ticketTypes.filter(ticket => ticket.id !== ticketId);
    onUpdate(updatedTickets);
  };

  const handleCancelEdit = () => {
    setEditingTicket(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Ticket Types
        </CardTitle>
        <CardDescription>Manage different ticket types for this event</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Ticket Type */}
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-4">Add New Ticket Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="ticket_name">Name</Label>
              <Input
                id="ticket_name"
                value={newTicket.name}
                onChange={(e) => setNewTicket(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., VIP, General, Student"
              />
            </div>
            <div>
              <Label htmlFor="ticket_price">Price ($)</Label>
              <Input
                id="ticket_price"
                type="number"
                min="0"
                step="0.01"
                value={newTicket.price}
                onChange={(e) => setNewTicket(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="ticket_quantity">Available Quantity</Label>
              <Input
                id="ticket_quantity"
                type="number"
                min="0"
                value={newTicket.available_quantity}
                onChange={(e) => setNewTicket(prev => ({ ...prev, available_quantity: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="ticket_max_order">Max Per Order</Label>
              <Input
                id="ticket_max_order"
                type="number"
                min="1"
                value={newTicket.max_per_order}
                onChange={(e) => setNewTicket(prev => ({ ...prev, max_per_order: parseInt(e.target.value) || 10 }))}
                placeholder="10"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="ticket_description">Description (Optional)</Label>
            <Textarea
              id="ticket_description"
              value={newTicket.description}
              onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this ticket type..."
              rows={2}
            />
          </div>
          <Button
            onClick={handleAddTicket}
            className="mt-4 flex items-center gap-2"
            disabled={!newTicket.name || !newTicket.price || !newTicket.available_quantity}
          >
            <Plus className="h-4 w-4" />
            Add Ticket Type
          </Button>
        </div>

        {/* Existing Ticket Types */}
        {ticketTypes.length > 0 ? (
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Existing Ticket Types</h4>
            {ticketTypes.map((ticket) => (
              <div key={ticket.id} className="border border-border rounded-lg p-4">
                {editingTicket?.id === ticket.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`edit_name_${ticket.id}`}>Name</Label>
                        <Input
                          id={`edit_name_${ticket.id}`}
                          value={editingTicket?.name || ''}
                          onChange={(e) => setEditingTicket(prev => prev ? { ...prev, name: e.target.value } : prev!)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit_price_${ticket.id}`}>Price ($)</Label>
                        <Input
                          id={`edit_price_${ticket.id}`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={editingTicket?.price || 0}
                          onChange={(e) => setEditingTicket(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : prev!)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit_quantity_${ticket.id}`}>Available Quantity</Label>
                        <Input
                          id={`edit_quantity_${ticket.id}`}
                          type="number"
                          min="0"
                          value={editingTicket?.available_quantity || 0}
                          onChange={(e) => setEditingTicket(prev => prev ? { ...prev, available_quantity: parseInt(e.target.value) || 0 } : prev!)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit_max_order_${ticket.id}`}>Max Per Order</Label>
                        <Input
                          id={`edit_max_order_${ticket.id}`}
                          type="number"
                          min="1"
                          value={editingTicket?.max_per_order || 10}
                          onChange={(e) => setEditingTicket(prev => prev ? { ...prev, max_per_order: parseInt(e.target.value) || 10 } : prev!)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`edit_description_${ticket.id}`}>Description</Label>
                                             <Textarea
                         id={`edit_description_${ticket.id}`}
                         value={editingTicket?.description || ''}
                         onChange={(e) => setEditingTicket(prev => prev ? { ...prev, description: e.target.value } : prev!)}
                         rows={2}
                       />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit} className="flex items-center gap-2">
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-medium text-foreground">{ticket.name}</h5>
                        <Badge variant="secondary">${ticket.price.toFixed(2)}</Badge>
                        <Badge variant={ticket.available_quantity > 0 ? 'default' : 'destructive'}>
                          {ticket.available_quantity > 0 ? `${ticket.available_quantity} available` : 'Sold Out'}
                        </Badge>
                      </div>
                      {ticket.description && (
                        <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                      )}
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Max per order: {ticket.max_per_order}</span>
                        <span>Event ID: {ticket.event_id}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTicket(ticket)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTicket(ticket.id!)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Ticket className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No ticket types configured yet.</p>
            <p className="text-sm">Add your first ticket type above to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketTypeManager;
