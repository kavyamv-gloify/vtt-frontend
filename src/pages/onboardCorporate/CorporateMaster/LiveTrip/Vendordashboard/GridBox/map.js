import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  Polyline,
  InfoWindow,
} from 'react-google-maps';
import React, {useEffect, useRef, useState} from 'react';
import Api from '@api';
import axios from 'axios';
import MapWithAMarker from './mappage';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';

const Map = ({stops, psDetails, tripId, polyLine}) => {
  console.log('tripId', tripId);
  const [siteOfficeLocation, setSiteOfficeLocation] = useState({});
  const [MyStops, setMyStops] = useState([]);
  const [pullingLatandlong, setPullingLatandlong] = useState([]);
  const [pullingStopPage, setPullingStopPage] = useState([]);
  const mapRef = useRef(null);
  useEffect(() => {
    let d = [];
    stops?.length &&
      stops?.map((el, ind) => {
        d.push({
          lat: parseFloat(el.location?.latitude),
          lng: parseFloat(el.location?.longitude),
          locName: el.location?.locName,
          psDetails: el.onBoardPassengers || el.deBoardPassengers,
          id: ind + 'v',
        });
      });
    setMyStops(d || []);
  }, [stops]);
  useEffect(() => {
    axios
      .get(`${Api.siteOffice.list}/corporate?page=0&size=1000&officeName=null`)
      .then((res) => {
        setSiteOfficeLocation({
          ...res.data.data.body['SiteOffice List'][0].location,
          isOfc: true,
          officeName: res.data.data.body['SiteOffice List'][0].officeName,
        });
      });
  }, []);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(
          `${Api.baseUri}/user-reg/trip-route/get-all-trip-LatLongDataByTripId/${tripId}`,
        )
        .then((res) => {
          setPullingLatandlong(res?.data?.data[0]?.latLongList);
        })
        .catch((error) => {
          // Handle error
          console.error('Error fetching data: ', error);
        });
    };
    const fetchDataForStopPage = () => {
      axios
        .get(`${Api.baseUri}/user-reg/trip-driver/get-StopageHistory/${tripId}`)
        .then((res) => {
          setPullingStopPage(res?.data?.data);
        })
        .catch((error) => {
          // Handle error
          console.error('Error fetching data: ', error);
        });
    };
    fetchData();
    fetchDataForStopPage();

    // Fetch data every 5 minutes
    const interval = setInterval(() => {
      fetchData();
      fetchDataForStopPage();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [tripId]);

  useEffect(() => {
    console.log('PullingLatandlong');
  }, [pullingLatandlong]);
  console.log('PullingLatandlong', pullingLatandlong, pullingStopPage);

  return (
    <div className='gMapCont'>
      <MapWithAMarker
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${GoogleMapsAPI}`}
        siteOfficeLocation={siteOfficeLocation}
        stops={MyStops}
        psDetails={psDetails}
        containerElement={<div style={{height: `400px`}} />}
        mapElement={<div style={{height: `100%`}} />}
        loadingElement={`   `}
        pullingInfo={pullingLatandlong}
        pullingStopPage={pullingStopPage}
        tripId={tripId}
        polyLine={polyLine}
      />
    </div>
  );
};

export default Map;
