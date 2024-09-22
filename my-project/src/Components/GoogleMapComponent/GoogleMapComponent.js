import React, { useCallback } from "react";
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 40.73061,
  lng: -73.935242
};

const stylez = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [
      {
        saturation: -10,
      },
    ],
  },
];

function GoogleMapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY// Replace with your Google Maps API key
  });

  const onLoad = useCallback(function onLoad(mapInstance) {
    const mapType = new window.google.maps.StyledMapType(stylez, {
      name: "Grayscale",
    });
    mapInstance.mapTypes.set("gMap", mapType);
    mapInstance.setMapTypeId("gMap");

    const geocoder = new window.google.maps.Geocoder();
    const address = "New York";
    geocoder.geocode({ address: address }, function (results, status) {
      if (status === window.google.maps.GeocoderStatus.OK) {
        mapInstance.setCenter(results[0].geometry.location);
        new window.google.maps.Marker({
          map: mapInstance,
          position: results[0].geometry.location,
        });
      } else {
        
      }
    });
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      onLoad={onLoad}
      options={{
        scrollwheel: false,
        scaleControl: false,
        disableDefaultUI: true,
      }}
    />
  ) : <></>
}

export default React.memo(GoogleMapComponent);
