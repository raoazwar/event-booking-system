import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface GoogleMapProps {
  location: string;
  eventTitle: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ location, eventTitle }) => {
  // Create Google Maps iframe URL with location search
  const getMapUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodedLocation}`;
  };

  // Alternative: Use Google Maps search URL (no API key required)
  const getSearchUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Event Location
        </CardTitle>
        <CardDescription>
          {location}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map iframe */}
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <iframe
            src={getMapUrl(location)}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing location for ${eventTitle}`}
          />
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => window.open(getSearchUrl(location), '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            Open in Google Maps
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              // Copy location to clipboard
              navigator.clipboard.writeText(location);
              // You could add a toast notification here
            }}
          >
            <MapPin className="h-4 w-4" />
            Copy Address
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleMap;
