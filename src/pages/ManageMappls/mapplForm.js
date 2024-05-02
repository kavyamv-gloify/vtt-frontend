import React, {useState, useEffect} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
} from '@mui/material';
import keys from '@common/keys';
import { useNavigate } from 'react-router-dom';
import Steppers from '@smart-form/stepper';
import { useAuthUser } from '@crema/utility/AuthHooks';
import regex from '@regex';
import axios from 'axios';
import api from '@api';
import { toast } from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
import PersonIcon from '@mui/icons-material/Person';
import RouteIcon from '@mui/icons-material/Route';
import Api from '@api';

const MapplForm = () => {
  let stepperTemplate = {
    title: "Register Employee Detail",
    layout: { type: 'horizontal', position: 'center', labelPos: 'top', maxWidth: '80%', margin: '10px 20px' },
    steps: [
      {
        layout: {},
        title: 'Employee Personal Details',
        buttons: ['next'],
        buttonStyle: {
          type: 'square',
          text: true,
          icon: '',
          size: '',
          bgColor: '',
          textColor: '',
          fontSize: '',
        },
        form: {
          layout: { column: 1, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
          // title: "Employee Registration Form",
          // layout: { type: 'horizontal', position: 'center', labelPos: 'top', maxWidth: '80%', margin: '10px 20px' },
          sections: [
            {
              type: "section",
              layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
              fields: [
                {
                  type: 'text',
                  name: 'firstName',
                  id: 'firstName',
                  title: 'First Name',
                },
                {
                  type: 'text',
                  name: 'lastName',
                  id: 'lastName',
                  title: 'First Name',
                },
              ]
            },
            
          ]
        }
      },
      {
        layout: {},
        title: 'Address Details',
        buttons: ['next'],
        buttonStyle: {
          type: 'square',
          text: true,
          icon: '',
          size: '',
          bgColor: '',
          textColor: '',
          fontSize: '',
        },
        form: {
          layout: { column: 1, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
          sections: [
            {
              type: "section",
              layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
              fields: [
                {
                    type: 'mappl',
                    name: 'location',
                    id: 'location',
                    title: 'Location',
                    distribute:[{name:'address', value:'locName'}, {name:'district', value:'district'}, {name:'subDistrict', value:'subDistrict'}, {name:'state', value:'state'},{name:'city', value:'city'},{name:'pincode', value:'pincode'}],
                    infoMessage: ["Alphanumeric characters are allowed", "Maximum length should be 100 characters", "e.g.: Noida Sector 48, UP "],
                    validationProps: {
                      required: "required"
                    }
                },
                {
                  type: 'text',
                  name: 'address',
                  id: 'address',
                  title: 'Address',
                  infoMessage: ["Alphanumerics are allowed", "Maximum length should be 30 characters", "e.g.: Software"],
                },
                {
                  type: 'text',
                  name: 'district',
                  id: 'district',
                  title: 'District',
                },
                {
                  type: 'text',
                  name: 'subDistrict',
                  id: 'subDistrict',
                  title: 'Sub District',
                },
                {
                  type: 'text',
                  name: 'area',
                  id: 'area',
                  title: 'Area',
                },
                {
                  type: 'text',
                  name: 'state',
                  id: 'state',
                  title: 'State',
                },
                {
                  type: 'text',
                  name: 'city',
                  id: 'city',
                  title: 'City',
                },
                {
                  type: 'text',
                  name: 'pincode',
                  id: 'pincode',
                  title: 'Pincode',
                },
              ]
            },
          ]
        }
      },
      {
        layout: {},
        title: 'Cost Center',
        buttons: ['submit'],
        buttonStyle: {
          type: 'square',
          text: true,
          icon: '',
          size: '',
          bgColor: '',
          textColor: '',
          fontSize: '',
        },
        form: {
          layout: { column: 1, spacing: 2, size: 'medium', label: 'fixed', type: 'grid' },
          sections: [
            {
              type: "section",
              layout: { column: 2, spacing: 2, size: 'medium', label: 'fixed' },
              fields: [
                {
                  type: 'text',
                  name: 'costCenter',
                  id: 'costcenter',
                  title: 'Cost Center',
                },
              ]
            },
          ]
        }
      }
    ]
  }

  return (
    <>
      <Steppers
        template={stepperTemplate}
        // showbtn={showbtn}
        // SecretFun={SecretFun}
        // afterSubmit={handleSubmit}
        // onChange={handleChange}
        buttons={['submit']}
        mode='onTouched'
        icons={{ 1: <PersonIcon />, 2: <RouteIcon />, }}
      />
    </>
  );

}
export default MapplForm;
