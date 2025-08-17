import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface GoogleMapProps {
  location: string;
  eventTitle: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ location, eventTitle }) => {
  // Get API key from environment variable
  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Create Google Maps iframe URL with location search (only if API key is available)
  const getMapUrl = (location: string) => {
    if (!GOOGLE_MAPS_API_KEY) {
      return null; // No API key available
    }
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodedLocation}`;
  };

  // Alternative: Use Google Maps search URL (no API key required)
  const getSearchUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  const mapUrl = getMapUrl(location);

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
        {/* Map iframe - only show if API key is available */}
        {mapUrl ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden border">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing location for ${eventTitle}`}
            />
          </div>
        ) : (
          <div className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Map preview not available</p>
              <p className="text-xs">Click "Open in Google Maps" to view location</p>
            </div>
          </div>
        )}
        
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
