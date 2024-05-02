import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import {useAuthUser} from '@crema/utility/AuthHooks';
import axios from 'axios';
import {GoogleMapsAPI} from '@smart-form/GoogleMap/g-config';
import Api from '@api';
import keys from '@common/keys';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import {responsiveProperty} from '@mui/material/styles/cssUtils';
const CreateForm = (props) => {
  const {user} = useAuthUser();
  //
  const [showbtn, setshowbtn] = useState(true);
  const [tempDistance, setTempDistance] = useState(0);
  const [geoPoint, setGeoPoint] = useState();

  const navigate = useNavigate();

  let template = {
    // title: "Nodal Point",
    layout: {
      coloum: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal information',
        fields: [
          {
            type: 'mappl',
            name: 'geopoint',
            id: 'geopoint',
            title: 'Geo Point',
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 30 characters',
              'e.g.:LU12345DL2022',
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'nodalStopName',
            id: 'nodalStopName',
            infoMessage: [
              'Alphanumeric characters are allowed',
              'Maximum length should be 30 characters',
              'e.g.:LU12345DL2022',
            ],
            title: 'Nodal stop Name',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'number',
            name: 'latitude',
            id: 'latitude',
            title: 'Latitude',
            infoMessage: ['Value will get prefetch from map'],
            disabled: true,
          },
          {
            type: 'number',
            name: 'longitude',
            id: 'longitude',
            title: 'Longitude',
            infoMessage: ['Value will get prefetch from map'],
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
            infoMessage: ['Value will get prefetch from map'],
            disabled: true,
          },
          {
            type: 'text',
            name: 'locName',
            id: 'locName',
            title: 'Area',
            infoMessage: ['Value will get prefetch from map'],
            disabled: true,
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
        ],
      },
    ],
  };

  const handleChange = async (values) => {
    console.log('values?.geopoint', values?.geopoint);
    setGeoPoint(values?.geopoint);

    axios
      .post(Api.baseUri + `/user-reg/getdist/geocode`, {
        origins: props.geoPoint.ofclatitude + ',' + props.geoPoint.ofclongitude,
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

  const handleSubmit = async (values) => {
    setshowbtn(false);
    let reqData = {
      nodalStopName: values?.data?.nodalStopName,
      routeId: props?.routeId,
      distancefromOffice: values?.data?.distancefromOffice,
      geoPoint: {
        locName: values?.data?.locName,
        latitude: values?.data?.latitude,
        longitude: values?.data?.longitude,
        locality: values?.data?.locality,
      },
    };
    if (values.button.toUpperCase() === 'SUBMIT') {
      //
      axios
        .post(Api.masters.addnodalpoint, reqData)
        .then((response) => {
          if (response?.data?.status == '200') {
            toast.success(
              `${response?.data?.data?.nodalStopName} created successfully`,
            );
            // toast.success('Details has been successfully submitted.');
            // close(false);
            props.isSubmited();
            // navigate('/onbordTenent/NodelPoint/table');
          } else {
            toast.error(response?.data?.message ?? 'Something went wrong');
          }
          setshowbtn(true);
        })
        .catch((er) => {
          setshowbtn(true);
          toast.error('Something went wrong');
        });
    }
  };

  return (
    <>
      <SmartForm
        template={template}
        showbtn={showbtn}
        defaultValues={
          {
            // locName:geoPoint?.locName,
            // latitude:geoPoint?.latitude,
            // longitude:geoPoint?.longitude,
            // geopoint:geoPoint,
            // distancefromOffice:tempDistance
          }
        }
        mode='onTouched'
        buttons={['Submit']}
        onSubmit={handleSubmit}
        onChange={handleChange}
        setVal={[
          {name: 'geopoint', value: geoPoint},
          {name: 'locName', value: geoPoint?.locName},
          {name: 'latitude', value: geoPoint?.latitude},
          {name: 'longitude', value: geoPoint?.longitude},
          {name: 'locality', value: geoPoint?.locality},
          {name: 'distancefromOffice', value: tempDistance},
        ]}
      />
    </>
  );
};

export default CreateForm;
