'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

// Fix for default marker icons in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icon for Airbnb-style pins
const createCustomIcon = (price: number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: #FF385C;
        color: white;
        border-radius: 50% 50% 50% 0;
        width: 32px;
        height: 32px;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        cursor: pointer;
        border: 2px solid white;
      ">
        <span style="
          transform: rotate(45deg);
          font-size: 10px;
          font-weight: bold;
        ">$${Math.round(price / 100)}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface InteractiveMapProps {
  listings: Listing[];
  center?: [number, number];
  zoom?: number;
}

function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 10);
    }
  }, [center, zoom, map]);
  
  return null;
}

export function InteractiveMap({ listings, center = [20.5937, 78.9629], zoom = 4 }: InteractiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    );
  }

  // Filter listings with valid coordinates
  const validListings = listings.filter(
    (l) => l.latitude && l.longitude && l.latitude !== 0 && l.longitude !== 0
  );

  const mapCenter: [number, number] = validListings.length > 0 
    ? [validListings[0].latitude!, validListings[0].longitude!] 
    : center;

  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-lg relative">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <MapUpdater center={mapCenter} zoom={zoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validListings.map((listing) => {
          const icon = createCustomIcon(listing.price_per_night);
          const position: [number, number] = [listing.latitude!, listing.longitude!];
          
          return (
            <Marker
              key={listing.id}
              position={position}
              icon={icon}
            >
              <Popup className="w-64">
                <div className="p-2">
                  <Link href={`/listings/${listing.id}`} className="block">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden mb-2">
                      {listing.images && listing.images.length > 0 ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 256px) 100vw, 256px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No image</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {listing.location}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">
                        ${(listing.price_per_night / 100).toFixed(0)}
                        <span className="font-normal text-gray-500 dark:text-gray-400 text-xs ml-0.5">/night</span>
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">⭐</span>
                        <span className="text-xs font-medium">{listing.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <button className="mt-2 w-full bg-[#FF385C] text-white text-xs py-1 rounded-lg hover:bg-[#D70466] transition">
                      View Details
                    </button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {validListings.length > 20 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-lg text-xs text-gray-600 dark:text-gray-300">
            {validListings.length} properties on map
          </div>
        )}
      </MapContainer>

      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FF385C] rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-300">Available</span>
        </div>
      </div>
    </div>
  );
}
