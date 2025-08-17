import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CreditCard, Lock, Shield, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Ticket, Download, Mail, Share2 } from 'lucide-react';
import { Event } from '../types';

interface TicketPurchaseProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingData: any) => void;
}

interface PurchaseFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ticketCount: number;
  selectedTicketType?: number;
  paymentMethod: 'stripe' | 'paypal' | 'razorpay';
}

interface PaymentSettings {
  stripe: { enabled: boolean; publishableKey: string };
  paypal: { enabled: boolean; clientId: string };
  razorpay: { enabled: boolean; keyId: string };
}

interface BookingData {
  id: string;
  event_id: number;
  ticket_count: number;
  total_amount: number;
  status: string;
  payment_status: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  created_at: string;
  payment_method: string;
  card_last4?: string;
}

// Separate Success Page Component
const BookingSuccessPage: React.FC<{
  bookingData: BookingData;
  event: Event;
  onClose: () => void;
}> = ({ bookingData, event, onClose }) => {
  const handleDownloadTicket = () => {
    // TODO: Generate and download PDF ticket
    alert('Ticket download feature will be implemented');
  };

  const handleEmailTicket = () => {
    // TODO: Send email with ticket
    alert('Email ticket feature will be implemented');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `I just booked tickets for ${event.title}!`,
        text: `Check out this amazing event: ${event.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-bold text-green-600 mb-2">🎉 Payment Successful!</h3>
        <p className="text-lg text-muted-foreground">Your tickets have been booked successfully.</p>
        <p className="text-sm text-muted-foreground mt-1">A confirmation email has been sent to {bookingData.customer.email}</p>
      </div>

      <div className="border rounded-lg p-6 space-y-6">
        <h4 className="font-semibold text-xl">📋 Booking Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Booking ID</p>
            <p className="font-mono font-medium bg-gray-100 px-2 py-1 rounded">{bookingData.id}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Event</p>
            <p className="font-medium">{event.title}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Tickets</p>
            <p className="font-medium">{bookingData.ticket_count} × ${(bookingData.total_amount / bookingData.ticket_count).toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium text-lg font-bold text-green-600">${bookingData.total_amount.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Payment Method</p>
            <p className="font-medium capitalize">{bookingData.payment_method}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant="success" className="capitalize text-sm">{bookingData.status}</Badge>
          </div>
        </div>

        <div className="border-t pt-4">
          <h5 className="font-semibold mb-3">👤 Customer Information</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{bookingData.customer.firstName} {bookingData.customer.lastName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{bookingData.customer.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{bookingData.customer.phone}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{new Date(bookingData.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={handleDownloadTicket} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Ticket
        </Button>
        <Button onClick={handleEmailTicket} variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Ticket
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Event
        </Button>
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>✅ Your booking is confirmed and secure</p>
        <p>📧 Check your email for detailed information</p>
        <p>📱 You can also view your bookings in your profile</p>
      </div>

      <Button onClick={onClose} className="w-full max-w-xs">
        Close & Return to Event
      </Button>
    </div>
  );
};

const TicketPurchase: React.FC<TicketPurchaseProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PurchaseFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ticketCount: 1,
    paymentMethod: 'stripe',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripe: { enabled: true, publishableKey: 'pk_test_...' },
    paypal: { enabled: false, clientId: '' },
    razorpay: { enabled: false, keyId: '' },
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const totalSteps = 3;

  useEffect(() => {
    if (isOpen) {
      loadPaymentSettings();
      // Reset form when modal opens
      setCurrentStep(1);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        ticketCount: 1,
        paymentMethod: 'stripe',
      });
      setShowSuccess(false);
      setBookingData(null);
      setError(null);
    }
  }, [isOpen]);

  // Set default payment method to first enabled gateway
  useEffect(() => {
    if (paymentSettings.paypal.enabled) {
      setFormData(prev => ({ ...prev, paymentMethod: 'paypal' }));
    } else if (paymentSettings.stripe.enabled) {
      setFormData(prev => ({ ...prev, paymentMethod: 'stripe' }));
    } else if (paymentSettings.razorpay.enabled) {
      setFormData(prev => ({ ...prev, paymentMethod: 'razorpay' }));
    }
  }, [paymentSettings]);

  const loadPaymentSettings = async () => {
    try {
      // Load payment settings from API
      const response = await fetch('http://localhost:8000/api/payment/gateways');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const gateways = result.data; // API returns data, not gateways
          
          // Update local state with API settings
          setPaymentSettings({
            stripe: { 
              enabled: gateways.stripe?.enabled || false, 
              publishableKey: gateways.stripe?.publishable_key || 'pk_test_...'
            },
            paypal: { 
              enabled: gateways.paypal?.enabled || false, 
              clientId: gateways.paypal?.client_id || ''
            },
            razorpay: { 
              enabled: gateways.razorpay?.enabled || false, 
              keyId: gateways.razorpay?.key_id || ''
            },
          });
          
          console.log('Payment settings loaded from API:', gateways);
        }
      } else {
        console.log('Failed to load payment settings from API, using defaults');
      }
    } catch (error) {
      console.error('Error loading payment settings:', error);
      // Fallback to localStorage if API fails
      try {
        const savedSettings = localStorage.getItem('websiteSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          const paymentSettings = parsedSettings.payment_gateways;
          
          setPaymentSettings({
            stripe: { 
              enabled: paymentSettings.stripe.enabled, 
              publishableKey: paymentSettings.stripe.publishable_key || 'pk_test_...' 
            },
            paypal: { 
              enabled: paymentSettings.paypal.enabled, 
              clientId: paymentSettings.paypal.client_id || '' 
            },
            razorpay: { 
              enabled: paymentSettings.razorpay.enabled, 
              keyId: paymentSettings.razorpay.key_id || '' 
            },
          });
        }
      } catch (localError) {
        console.error('Error loading from localStorage:', localError);
      }
    }
  };

  const handleInputChange = (field: keyof PurchaseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    
    switch (step) {
      case 1:
        if (!formData.firstName.trim()) {
          setError('First name is required');
          return false;
        }
        if (!formData.lastName.trim()) {
          setError('Last name is required');
          return false;
        }
        if (!formData.email.trim()) {
          setError('Email is required');
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setError('Please enter a valid email');
          return false;
        }
        if (!formData.phone.trim()) {
          setError('Phone number is required');
          return false;
        }
        break;
      case 2:
        if (formData.ticketCount < 1) {
          setError('Please select at least 1 ticket');
          return false;
        }
        if (formData.ticketCount > (event.available_seats || event.total_seats)) {
          setError(`Only ${event.available_seats || event.total_seats} tickets available`);
          return false;
        }
        break;
      case 3:
        // Check if any payment gateways are enabled
        if (!paymentSettings.stripe.enabled && !paymentSettings.paypal.enabled && !paymentSettings.razorpay.enabled) {
          setError('No payment gateways are configured. Please enable at least one in Website Settings.');
          return false;
        }
        
        if (!paymentSettings[formData.paymentMethod].enabled) {
          setError('Selected payment method is not available');
          return false;
        }
        
        // Validate card details for Stripe
        if (formData.paymentMethod === 'stripe') {
          // No validation needed for Stripe Checkout - Stripe handles all validation
          // Just ensure the payment method is enabled
          if (!paymentSettings.stripe.enabled) {
            setError('Stripe payments are not available');
            return false;
          }
        }
        break;
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateSubtotal = (): number => {
    const basePrice = formData.selectedTicketType 
      ? (event.ticket_types?.find(t => t.id === formData.selectedTicketType)?.price || parseFloat(event.price))
      : parseFloat(event.price);
    return basePrice * formData.ticketCount;
  };

  const calculateTax = (): number => {
    // Get tax rate from settings or default to 0 if not enabled
    const taxRate = 0; // TODO: Get from backend settings
    return calculateSubtotal() * taxRate;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePayment = async () => {
    if (!formData.paymentMethod) {
      setError('Please select a payment method');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const paymentData = {
        amount: calculateTotal(),
        currency: 'usd',
        paymentMethod: formData.paymentMethod,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        event: {
          id: event.id,
          title: event.title,
        },
        tickets: {
          count: formData.ticketCount,
          type: formData.selectedTicketType,
        },
      };

      console.log('Processing payment:', paymentData);

      if (formData.paymentMethod === 'paypal') {
        const paypalResponse = await fetch('http://localhost:8000/api/payment/paypal/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: calculateTotal(),
            currency: 'USD',
            description: `${event.title} - ${formData.ticketCount} ticket(s)`,
            event_id: event.id,
            ticket_count: formData.ticketCount,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            customer_phone: formData.phone,
          }),
        });
        const paypalResult = await paypalResponse.json();
        if (paypalResult.success && paypalResult.approval_url) {
          window.location.href = paypalResult.approval_url;
          return;
        } else {
          throw new Error(paypalResult.error || 'Failed to create PayPal order');
        }
      } else if (formData.paymentMethod === 'stripe') {
        const stripeResponse = await fetch('http://localhost:8000/api/payment/stripe/create-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Remove Authorization header since this endpoint doesn't require authentication
          },
          body: JSON.stringify({
            amount: calculateSubtotal() / formData.ticketCount, // Send per-ticket price, not total
            currency: 'usd', // Stripe expects lowercase currency
            description: `${event.title} - ${formData.ticketCount} ticket(s)`,
            event_id: event.id,
            ticket_count: formData.ticketCount,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            customer_phone: formData.phone,
          }),
        });

        if (!stripeResponse.ok) {
          const errorData = await stripeResponse.json();
          throw new Error(errorData.error || `HTTP ${stripeResponse.status}: ${stripeResponse.statusText}`);
        }

        const stripeResult = await stripeResponse.json();
        if (stripeResult.success && stripeResult.checkout_url) {
          // Redirect to Stripe Checkout
          window.location.href = stripeResult.checkout_url;
          return;
        } else {
          throw new Error(stripeResult.error || 'Failed to create Stripe checkout session');
        }
      } else {
        throw new Error('Unsupported payment method');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Customer Information';
      case 2: return 'Ticket Selection';
      case 3: return 'Payment';
      default: return '';
    }
  };

  const getStepDescription = (step: number): string => {
    switch (step) {
      case 1: return 'Please provide your contact information';
      case 2: return 'Select the number of tickets you need';
      case 3: return 'Complete your purchase securely';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Purchase Tickets - {event.title}
          </DialogTitle>
          <DialogDescription>
            Complete your ticket purchase in {totalSteps} simple steps
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i + 1} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep > i + 1 
                    ? 'bg-primary border-primary text-white' 
                    : currentStep === i + 1
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground text-muted-foreground'
                }`}>
                  {currentStep > i + 1 ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    currentStep > i + 1 ? 'bg-primary' : 'bg-muted-foreground'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <p className="text-sm font-medium">{getStepTitle(currentStep)}</p>
            <p className="text-xs text-muted-foreground">{getStepDescription(currentStep)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          )}

          {/* Step 2: Ticket Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Ticket Type Selection */}
              {event.ticket_types && event.ticket_types.length > 0 ? (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select Ticket Type</Label>
                  {event.ticket_types.map((ticketType) => (
                    <div
                      key={ticketType.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        formData.selectedTicketType === ticketType.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleInputChange('selectedTicketType', ticketType.id)}
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
              ) : (
                <div className="p-3 border rounded-lg bg-muted/20">
                  <div className="text-center">
                    <p className="font-medium">{event.title} - General Admission</p>
                    <p className="text-sm text-muted-foreground">
                      {event.available_seats || event.total_seats} seats available at ${parseFloat(event.price).toFixed(2)} each
                    </p>
                  </div>
                </div>
              )}

              {/* Ticket Count */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Number of Tickets</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('ticketCount', Math.max(1, formData.ticketCount - 1))}
                    disabled={formData.ticketCount <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 border rounded-md min-w-[60px] text-center">
                    {formData.ticketCount}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('ticketCount', formData.ticketCount + 1)}
                    disabled={formData.ticketCount >= (event.available_seats || event.total_seats)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Price Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {calculateTax() > 0 && (
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-1 font-medium">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && !showSuccess && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Method</Label>
                
                {/* Check if any payment gateways are enabled */}
                {!paymentSettings.stripe.enabled && !paymentSettings.paypal.enabled && !paymentSettings.razorpay.enabled ? (
                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <div className="text-center">
                      <p className="text-yellow-800 font-medium">No Payment Gateways Configured</p>
                      <p className="text-yellow-700 text-sm mt-1">
                        Please enable at least one payment gateway in the Website Settings.
                      </p>
                    </div>
                  </div>
                ) : (
                  <Tabs value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <TabsList className="grid w-full" style={{ 
                      gridTemplateColumns: `repeat(${
                        [paymentSettings.stripe.enabled, paymentSettings.paypal.enabled, paymentSettings.razorpay.enabled]
                          .filter(Boolean).length
                      }, 1fr)` 
                    }}>
                      {paymentSettings.stripe.enabled && (
                        <TabsTrigger value="stripe">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Credit Card
                        </TabsTrigger>
                      )}
                      {paymentSettings.paypal.enabled && (
                        <TabsTrigger value="paypal">
                          <CreditCard className="h-4 w-4 mr-2" />
                          PayPal
                        </TabsTrigger>
                      )}
                      {paymentSettings.razorpay.enabled && (
                        <TabsTrigger value="razorpay">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Razorpay
                        </TabsTrigger>
                      )}
                    </TabsList>
                  
                    <TabsContent value="stripe" className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Lock className="h-4 w-4" />
                          Secure payment powered by Stripe Checkout
                        </div>
                      </div>
                      <div className="text-center py-8">
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                              <CreditCard className="h-8 w-8 text-green-600" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-lg mb-2">Stripe Checkout</h4>
                            <p className="text-muted-foreground text-sm mb-4">
                              You will be redirected to Stripe to complete your payment securely with any payment method
                            </p>
                            <div className="bg-muted rounded-lg p-4 text-sm">
                              <div className="flex justify-between mb-2">
                                <span>Amount:</span>
                                <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Currency:</span>
                                <span className="font-medium">USD</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="paypal" className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          Pay securely with your PayPal account
                        </div>
                      </div>
                      <div className="text-center py-8">
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                              <CreditCard className="h-8 w-8 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-lg mb-2">PayPal Checkout</h4>
                            <p className="text-muted-foreground text-sm mb-4">
                              You will be redirected to PayPal to complete your payment securely
                            </p>
                            <div className=" rounded-lg p-4 text-sm">
                              <div className="flex justify-between mb-2">
                                <span>Amount:</span>
                                <span className="font-medium">${calculateTotal().toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Currency:</span>
                                <span className="font-medium">USD</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="razorpay" className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          Secure payment powered by Razorpay
                        </div>
                      </div>
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Razorpay integration will be implemented</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </div>

              {/* Final Price Summary */}
              <div className="border rounded-lg p-4 space-y-2">
                <h4 className="font-medium">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Event:</span>
                    <span className="text-right max-w-[200px]">{event.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tickets:</span>
                    <span>{formData.ticketCount} × ${(calculateSubtotal() / formData.ticketCount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  {calculateTax() > 0 && (
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-1 font-medium text-lg">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Page */}
          {showSuccess && bookingData && (
            <BookingSuccessPage bookingData={bookingData} event={event} onClose={onClose} />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex-shrink-0 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        <DialogFooter className="flex-shrink-0 gap-2 pt-4 border-t">
          {showSuccess ? (
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          ) : (
            <>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handlePayment} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {formData.paymentMethod === 'stripe' ? 'Processing Credit Card...' :
                        formData.paymentMethod === 'paypal' ? 'Redirecting to PayPal...' :
                        formData.paymentMethod === 'razorpay' ? 'Processing Razorpay...' :
                        'Processing Payment...'}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ${calculateTotal().toFixed(2)}
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketPurchase;
