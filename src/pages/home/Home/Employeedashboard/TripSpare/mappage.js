import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  DirectionsRenderer,
} from 'react-google-maps';
const OPTIONS = {
  minZoom: 4,
  maxZoom: 18,
};
const Map = ({siteOfficeLocation, stops}) => {
  const [directions, setDirections] = useState();
  const fitBounds = () => {
    if (!stops?.length || !siteOfficeLocation?.latitude) return;
    const bounds = new window.google.maps.LatLngBounds();
    stops?.map((item) => {
      bounds.extend(item);
      return item.id;
    });
    if (siteOfficeLocation?.latitude)
      bounds.extend({
        lat: parseFloat(siteOfficeLocation.latitude),
        lng: parseFloat(siteOfficeLocation.longitude),
      });
    mapRef.current.fitBounds(bounds);
  };
  useEffect(() => {
    fitBounds();
  }, [siteOfficeLocation, stops]);
  const mapRef = useRef(null);
  useEffect(() => {
    const google = window.google;
    if (!stops.length || !siteOfficeLocation?.latitude) return;
    let tem_waypts = [];
    stops?.map((el, i) => {
      tem_waypts.push({
        location: new google.maps.LatLng(
          parseFloat(stops[i]?.lat),
          stops[i]?.lng,
        ),
      });
    });

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: {
          lat: parseFloat(siteOfficeLocation?.latitude),
          lng: parseFloat(siteOfficeLocation?.longitude),
        },
        destination: stops[stops?.length - 1],
        waypoints: tem_waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          //
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      },
    );
    //
  }, [siteOfficeLocation, stops]);
  return (
    <>
      {siteOfficeLocation?.latitude && (
        <GoogleMap
          ref={mapRef}
          defaultZoom={8}
          options={OPTIONS}
          defaultCenter={{
            lat: parseFloat(siteOfficeLocation?.latitude),
            lng: parseFloat(siteOfficeLocation?.longitude),
          }}
        >
          {stops?.map((el, index) => {
            return (
              <Marker
                icon={{
                  url:
                    index == 0
                      ? 'https://maps.mappls.com/images/from.png'
                      : 'https://maps.mappls.com/images/to.png',
                  scaledSize: {width: 30, height: 40},
                }}
                position={{
                  lat: parseFloat(el?.lat),
                  lng: parseFloat(el?.lng),
                }}
              />
            );
          })}

          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: true,
              polylineOptions: {
                strokeOpacity: 1,
                strokeWeight: 6,
                strokeColor: '#119BF0',
              },
            }}
          />
        </GoogleMap>
      )}
    </>
  );
};
export default withScriptjs(withGoogleMap(Map));
