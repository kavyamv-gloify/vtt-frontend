import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import Api from '@api';
import axios from 'axios';
import keys from '@common/keys';
import {toast} from 'react-toastify';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuthUser} from '@crema/utility/AuthHooks';
import PopEdit from '@editpopup';
const EditForm = ({id, popBTNClick, openDialog, officeGeoPoint}) => {
  console.log('officeGeoPoint', officeGeoPoint);
  const [tempFData, settempFData] = useState({});
  const [geoPoint, setGeoPoint] = useState();
  const [showbtn, setshowbtn] = useState(true);
  const [tempDistance, setTempDistance] = useState();
  const [data, setData] = useState();
  const navigate = useNavigate();
  // const {id} = useParams();
  const {user} = useAuthUser();
  useEffect(() => {
    async function fetchData() {
      const baseURL = `${Api.nodal.nodalpoint}/${id}`;
      let response = await axios.get(`${baseURL}`);
      console.log('response', response);
      response.data.data.geopoint = response?.data?.data?.geoPoint;
      setData(response?.data?.data);
    }
    fetchData();
  }, [id]);
  useEffect(() => {
    console.log('data', data);
    setGeoPoint(data?.geoPoint);
  }, [data]);
  useEffect(() => {
    console.log('tempDistance', tempDistance);
  }, [tempDistance]);
  let template = {
    title: 'Nodal Point',
    layout: {
      coloum: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    fields: [
      {
        type: 'section',
        layout: {
          column: 2,
          spacing: 2,
          size: 'medium',
          label: 'fixed',
        },
        sectionName: 'officeLocation',
        sectiontitle: 'Nodal Point',
        fields: [
          {
            type: 'mappl',
            name: 'geopoint',
            id: 'geopoint',
            title: 'Area, Street, Sector, Village',
            distribute: [
              {name: 'temptown', value: 'city'},
              {name: 'tempstate', value: 'state'},
              {name: 'temppincode', value: 'pincode'},
            ],
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 50  characters',
              'e.g.: Noida Sector 48, UP ',
            ],
          },
          {
            type: 'text',
            name: 'latitude',
            id: 'latitude',
            title: 'Latitude',
            disabled: true,
          },

          {
            type: 'text',
            name: 'longitude',
            id: 'longitude',
            title: 'Longitude',
            disabled: true,
          },
          {
            type: 'text',
            name: 'locality',
            id: 'locality',
            defaultValue: geoPoint?.locality,
            title: 'Locality',
            infoMessage: ['Value will get prefetch from map'],
            // disabled: true,
          },
          {
            type: 'text',
            name: 'distancefromOffice',
            id: 'distancefromOffice',
            title: 'Distance from Office',
          },
        ],
      },

      {
        type: 'text',
        name: 'nodalStopName',
        id: 'nodalStopName',
        title: 'Nodal stop Name',
      },
    ],
  };

  const handleSubmit = async (values) => {
    if (values?.close) {
      popBTNClick(false);
      return;
    }
    console.log('values', values);
    let postData = {
      id: values?.data?.id,
      tenantId: values?.data?.tenantId,
      tenantName: '',
      status: 'ACTIVE',
      routeId: values?.data?.routeId,
      corporateId: values?.data?.corporateId,
      nodalStopName: values?.data?.nodalStopName,
      distancefromOffice: values?.data?.distancefromOffice,
      geoPoint: {
        locName: values?.data?.geopoint?.locName,
        latitude: values?.data?.geopoint?.latitude,
        longitude: values?.data?.geopoint?.longitude,
        distanceFromOffice: 0,
        locality: values?.data?.locality,
        networkStrength: 0,
        speed: 0,
        time: 0,
      },
    };
    axios
      .post(
        Api.baseUri + '/user-reg/office-route/update-nodalPointDetails',
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res?.data?.data);
          toast.success(
            `${res?.data?.data?.routeShortName}'s route details updated successfulyy`,
          );
          popBTNClick(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const handleChange = async (values) => {
    console.log('changing');
    console.log('values?.geopoint', values?.geopoint);
    setGeoPoint(values?.geopoint);

    axios
      .post(Api.baseUri + `/user-reg/getdist/geocode`, {
        origins: officeGeoPoint.ofclatitude + ',' + officeGeoPoint.ofclongitude,
        destinations:
          values?.geopoint?.latitude + ',' + values?.geopoint?.longitude,
      })
      .then((res) => {
        if (res?.data?.rows[0]?.elements[0]?.distance?.value)
          setTempDistance(
            res?.data?.rows[0]?.elements[0]?.distance?.value / 1000,
          );
      })
      .catch((err) => {});
  };
  useEffect(() => {
    console.log('geoPoint======', geoPoint);
  }, [geoPoint]);
  return (
    <>
      {data?.id && (
        // data?.latitude && data?.longitude &&
        <PopEdit
          title={data?.nodalStopName}
          poptemplate={template}
          defaultValues={data}
          openDialog={openDialog}
          showbtn={showbtn}
          buttons={['Update']}
          onChange={handleChange}
          setVal={[
            // {name: 'geopoint', value: geoPoint},
            // {name: 'locName', value: geoPoint?.locName},
            {name: 'latitude', value: geoPoint?.latitude},
            {name: 'longitude', value: geoPoint?.longitude},
            {name: 'locality', value: geoPoint?.locality},
            {name: 'distancefromOffice', value: tempDistance},
          ]}
          popAction={handleSubmit}
        />
      )}
    </>
  );
};

export default EditForm;
