import {rechartsConfigs} from './recharts';
import React from 'react';
import ColorPicker from './reactColor';
import GoogleMap from './googleMap';
import ReactNotificationEx from './reactNotification';
import ReactDropzone from './reactDropzone';
import ReactPlayer from './reactPlayer';
import Calendar from './calendar';
import ReactSlick from './reactSlick';
import Timeline from './timeLine';

export const thirdPartyConfigs = [
  ...rechartsConfigs,
  {
    path: '/third-party/react-color',
    element: <ColorPicker />,
  },
  {
    path: '/third-party/google-map',
    element: <GoogleMap />,
  },
  {
    path: '/third-party/react-notification',
    element: <ReactNotificationEx />,
  },
  {
    path: '/third-party/react-dropzone',
    element: <ReactDropzone />,
  },
  {
    path: '/third-party/react-player',
    element: <ReactPlayer />,
  },
  {
    path: '/third-party/calendar',
    element: <Calendar />,
  },
  {
    path: '/third-party/slider',
    element: <ReactSlick />,
  },
  {
    path: '/third-party/time-line',
    element: <Timeline />,
  },
];
