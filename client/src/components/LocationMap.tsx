import { SetStateAction, useCallback, useMemo, useState } from "react";
import {
  GeolocateControl,
  Map,
  Marker,
  NavigationControl,
  Popup,
} from "react-map-gl";
import { Link } from "react-router-dom";

import Pin from "./Pin";

const MAPBOX_PUBLIC_TOKEN = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

type LocationMapProps = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
}[];

function LocationMap({ data }: { data: LocationMapProps }) {
  const initialLat = data.length === 1 ? data[0].latitude : 53;
  const initialLong = data.length === 1 ? data[0].longitude : -1;

  const [viewport, setViewport] = useState<{
    latitude: number;
    longitude: number;
    zoom: number;
  }>({
    latitude: initialLat,
    longitude: initialLong,
    zoom: 6,
  });

  const [selectedPlace, setSelectedPlace] = useState<null | {
    id: string;
    title: string;
    latitude: number;
    longitude: number;
  }>(null);

  const handeOnMove = useCallback(
    (event: {
      viewState: SetStateAction<{
        latitude: number;
        longitude: number;
        zoom: number;
      }>;
    }) => setViewport(event.viewState),
    [],
  );

  const handleMarkerClick = useCallback(
    (
      id: string,
      title: string,
      latitude: number,
      longitude: number,
      event: React.MouseEvent,
    ) => {
      event.stopPropagation(); // Prevent event bubbling
      setSelectedPlace({ id, title, latitude, longitude });
    },
    [],
  );

  const handleMapClick = useCallback(() => {
    setSelectedPlace(null);
  }, []);

  const markers = useMemo(
    () =>
      data.map(({ id, title, latitude, longitude }) => (
        <Marker
          latitude={latitude}
          longitude={longitude}
          anchor="bottom"
          key={id}
        >
          <div
            onClick={(event) =>
              handleMarkerClick(id, title, latitude, longitude, event)
            }
          >
            <Pin />
          </div>
        </Marker>
      )),
    [data, handleMarkerClick],
  );

  return (
    <Map
      reuseMaps
      {...viewport}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMove={handeOnMove}
      mapboxAccessToken={MAPBOX_PUBLIC_TOKEN}
      onClick={handleMapClick} // Close popup when clicking on the map
    >
      <NavigationControl position="top-right" />
      <GeolocateControl position="top-right" />
      {markers}
      {selectedPlace && (
        <Popup
          latitude={selectedPlace.latitude}
          longitude={selectedPlace.longitude}
          anchor="top"
          onClose={() => setSelectedPlace(null)}
        >
          <Link to={`/${selectedPlace.id}`}>{selectedPlace.title}</Link>
        </Popup>
      )}
    </Map>
  );
}

export default LocationMap;
