import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from 'react-google-maps';
import Card from '@mui/material/Card';
import './style.css';
import Api from '@api';
const OPTIONS = {
  minZoom: 4,
  maxZoom: 18,
};
const Map = ({
  paths,
  stops,
  vehicleCordinate,
  siteOfficeLocation,
  tripType_,
}) => {
  const mapRef = useRef(null);
  const [markerId, setMarkerId] = useState();
  const markerRef = useRef(null);
  const icon1 = {
    url: '/assets/images/car_topview_.png',
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
    scale: 0.7,
    rotation: 90,
  };
  // Fit bounds on mount, and when the markers change
  useEffect(() => {
    fitBounds();
  }, [paths, siteOfficeLocation?.latitude]);
  useEffect(() => {
    if (!vehicleCordinate?.heading && vehicleCordinate?.heading != 0) return;
    const marker = document.querySelector(`[src="${icon1?.url}"]`);
    if (marker)
      marker.style.transform = `rotate(${vehicleCordinate?.heading || 0}deg)`;
  }, [vehicleCordinate]);

  const fitBounds = () => {
    if (!stops?.data) return;
    const bounds = new window.google.maps.LatLngBounds();
    if (!paths?.length) {
      stops?.data?.map((item) => {
        bounds.extend(item);
        return item.id;
      });
    }
    paths?.map((item) => {
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

  return (
    <>
      {!stops?.data?.length && siteOfficeLocation?.latitude && (
        <Marker
          ref={markerRef}
          icon={{
            url: '/assets/images/officeMarker.png',
            scaledSize: new window.google.maps.Size(40, 50),
            anchor: new window.google.maps.Point(20, 20),
            scale: 0.7,
            rotation: 90,
          }}
          id={'stopss'}
          position={{
            lat: parseFloat(siteOfficeLocation.latitude),
            lng: parseFloat(siteOfficeLocation.longitude),
          }}
          key={'site'}
          title={'Office'}
        ></Marker>
      )}
      <Card variant='outlined'>
        <div className='gMapCont'>
          <GoogleMap ref={mapRef}>
            {stops?.data?.length > 0 && paths?.length > 0 && (
              <Polyline
                path={paths}
                options={{
                  strokeColor: '#0088FF',
                  strokeWeight: 6,
                  strokeOpacity: 0.6,
                  defaultVisible: true,
                }}
              />
            )}
            {stops?.data?.map((stop, index) => {
              console.log(stop, 'rqwerwqrwqer');
              return (
                <>
                  {
                    <Marker
                      key={index}
                      position={{
                        lat: stop.lat,
                        lng: stop.lng,
                      }}
                      //     ((tripType_ == 'DOWNTRIP' && index != 0) ||
                      // (tripType_ == 'UPTRIP' && index != stops?.data - 1))

                      icon={{
                        url:
                          index == 0
                            ? tripType_ == 'DOWNTRIP'
                              ? '/assets/images/officeMarker.png'
                              : 'https://maps.mappls.com/images/from.png'
                            : index + 1 == stops?.data?.length
                            ? tripType_ == 'UPTRIP'
                              ? '/assets/images/officeMarker.png'
                              : 'https://maps.mappls.com/images/to.png'
                            : 'https://maps.mappls.com/images/2.png',
                        scaledSize: {width: 30, height: 40},
                      }}
                      title={stop.id}
                      // label={`${index + 1}`}
                      onClick={() => {
                        setMarkerId(index);
                      }}
                    >
                      {markerId == index ? (
                        <InfoWindow
                          position={{
                            lat: stop.lat,
                            lng: stop.lng,
                          }}
                          Marker={false}
                          onCloseClick={(e) => {
                            setMarkerId(null);
                          }}
                          // ud?.name data?.stops[i]?.expectedArivalTimeStr?.split(' ')[1]ud?.location?.locName
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `<div style='color: black;' class='point-details deboard'><span class='img-s'><img class='user-image' src='${
                                stops?.data[index]?.photo == 'CORP'
                                  ? localStorage.getItem('COMPANY_LOGO')
                                  : Api.imgUrl + stops?.data[index]?.photo
                              } ' /></span><span class='user-info'><h4>${
                                stops?.data[index]?.name
                              }</h4><p class='eta-time'>${
                                stops?.data[index]?.eta
                              }</p><p>${
                                stops?.data[index]?.location
                              }</p></span></div>`,
                            }}
                          ></div>
                        </InfoWindow>
                      ) : null}
                    </Marker>
                  }
                </>
              );
            })}
            {paths && (
              <>
                <Polyline path={paths} options={{strokeColor: 'none'}} />
                <Marker
                  ref={markerRef}
                  icon={icon1}
                  position={vehicleCordinate}
                />
              </>
            )}
          </GoogleMap>
        </div>
      </Card>
    </>
  );
};
export default withScriptjs(withGoogleMap(Map));
