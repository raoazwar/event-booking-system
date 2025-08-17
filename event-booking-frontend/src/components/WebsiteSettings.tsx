import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { CreditCard, Globe, Mail, Shield, Settings, DollarSign, CheckCircle } from 'lucide-react';

interface WebsiteSettingsData {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_media: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  features: {
    enable_registration: boolean;
    enable_rsvp: boolean;
    enable_ticketing: boolean;
    enable_maps: boolean;
    enable_analytics: boolean;
  };
  payment_gateways: {
    stripe: {
      enabled: boolean;
      publishable_key: string;
      secret_key: string;
      webhook_secret: string;
      mode: 'test' | 'live';
    };
    paypal: {
      enabled: boolean;
      client_id: string;
      client_secret: string;
      mode: 'sandbox' | 'live';
    };
    razorpay: {
      enabled: boolean;
      key_id: string;
      key_secret: string;
    };
  };
  currency: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
  tax_settings: {
    enable_tax: boolean;
    tax_rate: number;
    tax_name: string;
  };
}

const WebsiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettingsData>({
    site_name: 'Event Booking System',
    site_description: 'Professional event management and ticketing platform',
    contact_email: 'admin@example.com',
    contact_phone: '+1 (555) 123-4567',
    address: '123 Event Street, City, State 12345',
    social_media: {
      facebook: 'https://facebook.com/eventsystem',
      twitter: 'https://twitter.com/eventsystem',
      instagram: 'https://instagram.com/eventsystem',
      linkedin: 'https://linkedin.com/company/eventsystem',
    },
    features: {
      enable_registration: true,
      enable_rsvp: true,
      enable_ticketing: true,
      enable_maps: true,
      enable_analytics: true,
    },
    payment_gateways: {
      stripe: {
        enabled: false,
        publishable_key: '',
        secret_key: '',
        webhook_secret: '',
        mode: 'test',
      },
      paypal: {
        enabled: false,
        client_id: '',
        client_secret: '',
        mode: 'sandbox',
      },
      razorpay: {
        enabled: false,
        key_id: '',
        key_secret: '',
      },
    },
    currency: {
      code: 'USD',
      symbol: '$',
      position: 'before',
    },
    tax_settings: {
      enable_tax: false,
      tax_rate: 0,
      tax_name: 'Sales Tax',
    },
  });

  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load settings from API/localStorage
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Fetch settings from API
      const response = await fetch('http://localhost:8000/api/website-settings');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setSettings(result.data);
        } else {
          console.error('Failed to load settings:', result.message);
        }
      } else {
        console.error('Failed to fetch settings:', response.statusText);
        // Fallback to localStorage if API fails
        loadFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Fallback to localStorage if API fails
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedSettings = localStorage.getItem('websiteSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        
        // Ensure all nested objects exist with fallback values
        const completeSettings = {
          ...settings, // Use default settings as base
          ...parsedSettings, // Override with saved settings
          // Ensure nested objects exist
          social_media: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            ...parsedSettings.social_media,
          },
          features: {
            enable_registration: true,
            enable_rsvp: true,
            enable_ticketing: true,
            enable_maps: true,
            enable_analytics: true,
            ...parsedSettings.features,
          },
          payment_gateways: {
            stripe: {
              enabled: parsedSettings.payment_gateways?.stripe?.enabled || false,
              publishable_key: parsedSettings.payment_gateways?.stripe?.publishable_key || '',
              secret_key: parsedSettings.payment_gateways?.stripe?.secret_key || '',
              webhook_secret: parsedSettings.payment_gateways?.stripe?.webhook_secret || '',
              mode: parsedSettings.payment_gateways?.stripe?.mode || 'test',
            },
            paypal: {
              enabled: parsedSettings.payment_gateways?.paypal?.enabled || false,
              client_id: parsedSettings.payment_gateways?.paypal?.client_id || '',
              client_secret: parsedSettings.payment_gateways?.paypal?.client_secret || '',
              mode: parsedSettings.payment_gateways?.paypal?.mode || 'sandbox',
            },
            razorpay: {
              enabled: parsedSettings.payment_gateways?.razorpay?.enabled || false,
              key_id: parsedSettings.payment_gateways?.razorpay?.key_id || '',
              key_secret: parsedSettings.payment_gateways?.razorpay?.key_secret || '',
            },
          },
          currency: {
            code: 'USD',
            symbol: '$',
            position: 'before',
            ...parsedSettings.currency,
          },
          tax_settings: {
            enable_tax: false,
            tax_rate: 0,
            tax_name: 'Sales Tax',
            ...parsedSettings.tax_settings,
          },
        };
        
        setSettings(completeSettings);
      }
      console.log('Loading settings from localStorage...');
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      // Save to API
      const response = await fetch('http://localhost:8000/api/website-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          site_name: settings.site_name,
          site_description: settings.site_description,
          contact_email: settings.contact_email,
          contact_phone: settings.contact_phone,
          address: settings.address,
          social_media: settings.social_media,
          features: settings.features,
          payment_gateways: settings.payment_gateways,
          currency: settings.currency,
          tax_settings: settings.tax_settings,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log('Settings saved successfully to database!');
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
          
          // Also save to localStorage as backup
          localStorage.setItem('websiteSettings', JSON.stringify(settings));
        } else {
          throw new Error(result.message || 'Failed to save settings');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      alert(`Error saving settings: ${error.message || 'Unknown error'}. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setSettings(prev => {
      const currentSection = prev[section as keyof WebsiteSettingsData] || {};
      
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [field]: value,
        },
      };
    });
  };

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: any) => {
    setSettings(prev => {
      const currentSection = prev[section as keyof WebsiteSettingsData] || {};
      const currentSubsection = (currentSection as any)[subsection] || {};
      
      return {
        ...prev,
        [section]: {
          ...currentSection,
          [subsection]: {
            ...currentSubsection,
            [field]: value,
          },
        },
      };
    });
  };

  const getGatewayStatus = (gateway: any) => {
    return gateway.enabled ? (
      <Badge variant="success" className="text-xs">Active</Badge>
    ) : (
      <Badge variant="secondary" className="text-xs">Inactive</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading settings...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Website Settings</h2>
              <p className="text-muted-foreground">Configure your website and payment settings</p>
            </div>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Settings className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Features
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="tax" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Tax & Currency
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Information</CardTitle>
                  <CardDescription>Basic website and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="site_name">Site Name</Label>
                      <Input
                        id="site_name"
                        value={settings.site_name || ''}
                        onChange={(e) => handleInputChange('site_name', 'site_name', e.target.value)}
                        placeholder="Enter site name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Contact Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={settings.contact_email || ''}
                        onChange={(e) => handleInputChange('contact_email', 'contact_email', e.target.value)}
                        placeholder="Enter contact email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site_description">Site Description</Label>
                    <Input
                      id="site_description"
                      value={settings.site_description || ''}
                      onChange={(e) => handleInputChange('site_description', 'site_description', e.target.value)}
                      placeholder="Enter site description"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Contact Phone</Label>
                      <Input
                        id="contact_phone"
                        value={settings.contact_phone || ''}
                        onChange={(e) => handleInputChange('contact_phone', 'contact_phone', e.target.value)}
                        placeholder="Enter contact phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={settings.address || ''}
                        onChange={(e) => handleInputChange('address', 'address', e.target.value)}
                        placeholder="Enter address"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>Your social media links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={settings.social_media?.facebook || ''}
                        onChange={(e) => handleNestedInputChange('social_media', 'facebook', 'facebook', e.target.value)}
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={settings.social_media?.twitter || ''}
                        onChange={(e) => handleNestedInputChange('social_media', 'twitter', 'twitter', e.target.value)}
                        placeholder="https://twitter.com/yourpage"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={settings.social_media?.instagram || ''}
                        onChange={(e) => handleNestedInputChange('social_media', 'instagram', 'instagram', e.target.value)}
                        placeholder="https://instagram.com/yourpage"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={settings.social_media?.linkedin || ''}
                        onChange={(e) => handleNestedInputChange('social_media', 'linkedin', 'linkedin', e.target.value)}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Features Settings */}
            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Toggles</CardTitle>
                  <CardDescription>Enable or disable system features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {settings.features && Object.entries(settings.features).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <Label htmlFor={key} className="capitalize">
                            {key.replace(/_/g, ' ')}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            {key === 'enable_registration' && 'Allow new users to register'}
                            {key === 'enable_rsvp' && 'Enable RSVP functionality for events'}
                            {key === 'enable_ticketing' && 'Enable ticket sales and bookings'}
                            {key === 'enable_maps' && 'Show Google Maps for event locations'}
                            {key === 'enable_analytics' && 'Track event and user analytics'}
                          </p>
                        </div>
                        <Switch
                          id={key}
                          checked={value}
                          onCheckedChange={(checked) => handleNestedInputChange('features', key, key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Settings */}
            <TabsContent value="payments" className="space-y-4">
              {/* Stripe Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Stripe Payment Gateway
                      </CardTitle>
                      <CardDescription>Configure Stripe for credit card payments</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getGatewayStatus(settings.payment_gateways?.stripe || { enabled: false })}
                      <Switch
                        checked={settings.payment_gateways?.stripe?.enabled || false}
                        onCheckedChange={(checked) => handleNestedInputChange('payment_gateways', 'stripe', 'enabled', checked)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripe_publishable_key">Publishable Key</Label>
                      <Input
                        id="stripe_publishable_key"
                        type="password"
                        value={settings.payment_gateways?.stripe?.publishable_key || ''}
                        onChange={(e) => handleNestedInputChange('payment_gateways', 'stripe', 'publishable_key', e.target.value)}
                        placeholder="pk_test_..."
                        disabled={!settings.payment_gateways?.stripe?.enabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stripe_secret_key">Secret Key</Label>
                      <Input
                        id="stripe_secret_key"
                        type="password"
                        value={settings.payment_gateways?.stripe?.secret_key || ''}
                        onChange={(e) => handleNestedInputChange('payment_gateways', 'stripe', 'secret_key', e.target.value)}
                        placeholder="sk_test_..."
                        disabled={!settings.payment_gateways?.stripe?.enabled}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe_webhook_secret">Webhook Secret</Label>
                    <Input
                      id="stripe_webhook_secret"
                      type="password"
                      value={settings.payment_gateways?.stripe?.webhook_secret || ''}
                      onChange={(e) => handleNestedInputChange('payment_gateways', 'stripe', 'webhook_secret', e.target.value)}
                      placeholder="whsec_..."
                      disabled={!settings.payment_gateways?.stripe?.enabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripe_mode">Mode</Label>
                    <select
                      id="stripe_mode"
                      value={settings.payment_gateways?.stripe?.mode || 'test'}
                      onChange={(e) => handleNestedInputChange('payment_gateways', 'stripe', 'mode', e.target.value)}
                      className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={!settings.payment_gateways?.stripe?.enabled}
                    >
                      <option value="test">Test (Development)</option>
                      <option value="live">Live (Production)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* PayPal Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        PayPal Payment Gateway
                      </CardTitle>
                      <CardDescription>Configure PayPal for online payments</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getGatewayStatus(settings.payment_gateways?.paypal || { enabled: false })}
                      <Switch
                        checked={settings.payment_gateways?.paypal?.enabled || false}
                        onCheckedChange={(checked) => handleNestedInputChange('payment_gateways', 'paypal', 'enabled', checked)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paypal_client_id">Client ID</Label>
                      <Input
                        id="paypal_client_id"
                        type="password"
                        value={settings.payment_gateways?.paypal?.client_id || ''}
                        onChange={(e) => handleNestedInputChange('payment_gateways', 'paypal', 'client_id', e.target.value)}
                        placeholder="Enter PayPal Client ID"
                        disabled={!settings.payment_gateways?.paypal?.enabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paypal_client_secret">Client Secret</Label>
                      <Input
                        id="paypal_client_secret"
                        type="password"
                        value={settings.payment_gateways?.paypal?.client_secret || ''}
                        onChange={(e) => handleNestedInputChange('payment_gateways', 'paypal', 'client_secret', e.target.value)}
                        placeholder="Enter PayPal Client Secret"
                        disabled={!settings.payment_gateways?.paypal?.enabled}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypal_mode">Mode</Label>
                    <select
                      id="paypal_mode"
                      value={settings.payment_gateways?.paypal?.mode || 'sandbox'}
                      onChange={(e) => handleNestedInputChange('payment_gateways', 'paypal', 'mode', e.target.value)}
                      className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={!settings.payment_gateways?.paypal?.enabled}
                    >
                      <option value="sandbox">Sandbox (Testing)</option>
                      <option value="live">Live (Production)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Razorpay Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Razorpay Payment Gateway
                      </CardTitle>
                      <CardDescription>Configure Razorpay for Indian payments</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getGatewayStatus(settings.payment_gateways?.razorpay || { enabled: false })}
                      <Switch
                        checked={settings.payment_gateways?.razorpay?.enabled || false}
                        onCheckedChange={(checked) => handleNestedInputChange('payment_gateways', 'razorpay', 'enabled', checked)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="razorpay_key_id">Key ID</Label>
                      <Input
                        id="razorpay_key_id"
                        type="password"
                        value={settings.payment_gateways?.razorpay?.key_id || ''}
                        onChange={(e) => handleNestedInputChange('payment_gateways', 'razorpay', 'key_id', e.target.value)}
                        placeholder="Enter Razorpay Key ID"
                        disabled={!settings.payment_gateways?.razorpay?.enabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="razorpay_key_secret">Key Secret</Label>
                      <Input
                        id="razorpay_key_secret"
                        type="password"
                        value={settings.payment_gateways?.razorpay?.key_secret || ''}
                        onChange={(e) => handleNestedInputChange('payment_gateways', 'razorpay', 'key_secret', e.target.value)}
                        placeholder="Enter Razorpay Key Secret"
                        disabled={!settings.payment_gateways?.razorpay?.enabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tax & Currency Settings */}
            <TabsContent value="tax" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Currency Settings</CardTitle>
                  <CardDescription>Configure your currency and display preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency_code">Currency Code</Label>
                      <Input
                        id="currency_code"
                        value={settings.currency?.code || 'USD'}
                        onChange={(e) => handleNestedInputChange('currency', 'code', 'code', e.target.value)}
                        placeholder="USD"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency_symbol">Currency Symbol</Label>
                      <Input
                        id="currency_symbol"
                        value={settings.currency?.symbol || '$'}
                        onChange={(e) => handleNestedInputChange('currency', 'symbol', 'symbol', e.target.value)}
                        placeholder="$"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency_position">Symbol Position</Label>
                      <select
                        id="currency_position"
                        value={settings.currency?.position || 'before'}
                        onChange={(e) => handleNestedInputChange('currency', 'position', 'position', e.target.value)}
                        className="w-full border border-input bg-background px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="before">Before Amount ($100)</option>
                        <option value="after">After Amount (100$)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Settings</CardTitle>
                  <CardDescription>Configure tax rates and calculations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable_tax">Enable Tax</Label>
                      <p className="text-sm text-muted-foreground">
                        Add tax calculations to ticket prices
                      </p>
                    </div>
                    <Switch
                      id="enable_tax"
                      checked={settings.tax_settings?.enable_tax || false}
                      onCheckedChange={(checked) => handleNestedInputChange('tax_settings', 'enable_tax', 'enable_tax', checked)}
                    />
                  </div>
                  
                  {settings.tax_settings?.enable_tax && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tax_name">Tax Name</Label>
                        <Input
                          id="tax_name"
                          value={settings.tax_settings?.tax_name || 'Sales Tax'}
                          onChange={(e) => handleNestedInputChange('tax_settings', 'tax_name', 'tax_name', e.target.value)}
                          placeholder="Sales Tax"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                        <Input
                          id="tax_rate"
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={settings.tax_settings?.tax_rate || 0}
                          onChange={(e) => handleNestedInputChange('tax_settings', 'tax_rate', 'tax_rate', parseFloat(e.target.value))}
                          placeholder="8.5"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default WebsiteSettings;
