import React, {useEffect} from 'react';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useNavigate} from 'react-router-dom';
import UserPop from './userPop';
// import axios from 'axios';
import ReactLoginMS from 'react-ms-login';
import Api from '@api';
import './style.css';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SmartForm from '@smart-form';
import GroupIcon from '@mui/icons-material/Group';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import {Bar} from 'react-chartjs-2';
import SosIcon from '@mui/icons-material/Sos';
import {Chart as ChartJS, registerables} from 'chart.js';
import regex from '@regex';
import {Chart} from 'react-chartjs-2';
// class ButtonContent extends React.Component {
//   render(){
//       return (
//       <span>
//           MS Login
//       </span>)
//   }
// }
ChartJS.register(...registerables);
// import LineDemo from './LiveDemo';
// const styles = {
//   fontFamily: 'sans-serif',
//   textAlign: 'center',
// };
// import downDoc from '@common/fileDownload';
const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,99,132,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      //stack: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [65, 59, 80, 81, 56, 55, 40],
    },

    {
      label: 'My second dataset',
      backgroundColor: 'rgba(155,231,91,0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 1,
      //stack: 1,
      hoverBackgroundColor: 'rgba(255,99,132,0.4)',
      hoverBorderColor: 'rgba(255,99,132,1)',
      data: [45, 79, 50, 41, 16, 85, 20],
    },
  ],
};
const options = {
  responsive: true,
  legend: {
    display: false,
  },
  type: 'bar',
  //   scales: {
  //     xAxes: [{
  //         stacked: true
  //     }],
  //     yAxes: [{
  //         stacked: true
  //     }]
  // }
};

let template = {
  layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed', type: 'grid'},
  // title: 'Bank Type',
  description: 'Form for applying Job',
  sections: [
    {
      layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
      id: 'personal_information',
      fields: [
        {
          type: 'text',
          name: 'code',
          id: 'code',
          title: 'Search Vehicle by ID / Reg. Number Plate',
        },
        {
          type: 'text',
          name: 'code',
          id: 'code',
          title: 'Search Employee by ID / Email Mobile No',
        },
        {
          type: 'text',
          name: 'code',
          id: 'code',
          title: 'Search Trip by Id',
        },
      ],
    },
  ],
};

const TravelMatedashboard = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();

  useEffect(() => {
    if (user?.userList?.userStatus == 'DEFAULT') {
      navigate('/my-profile');
    }
  }, [user?.userList?.userStatus]);

  return (
    <>
      <div className='grid-containers'>
        <div className='grid-items'>
          <GroupIcon className='orange' />
          <label style={{marginLeft: '8px', position: 'relative', top: '-6px'}}>
            Total Trips <span className='bold orange'>(4)</span>
          </label>
        </div>
        <div className='grid-items'>
          <DirectionsCarIcon className='orange' />
          <label style={{marginLeft: '8px', position: 'relative', top: '-6px'}}>
            Aligned Vehicles <span className='bold orange'>(40)</span>
          </label>
        </div>
        <div className='grid-items'>
          <TimelapseIcon className='orange' />
          <label style={{marginLeft: '8px', position: 'relative', top: '-6px'}}>
            Delayed Trips <span className='bold orange'>(40)</span>
          </label>
        </div>
        <div className='grid-items'>
          <TimelapseIcon className='orange' />
          <label style={{marginLeft: '8px', position: 'relative', top: '-6px'}}>
            Delayed Trips <span className='bold orange'>(10)</span>
          </label>
        </div>
        <div className='grid-items'>
          <SosIcon className='orange' />
          <label style={{marginLeft: '8px', position: 'relative', top: '-6px'}}>
            SOS in Trips <span className='bold orange'>(4)</span>
          </label>
        </div>
      </div>

      <div className='row'>
        <div className='column'>
          <div>
            <Bar
              data={data}
              width={null}
              height={null}
              options={options}
              style={{paddingTop: '20px', margingBottom: '20px'}}
            />
            <Bar data={data} width={null} height={null} options={options} />
          </div>
        </div>
        <div className='column'>
          {/* <ReactLoginMS
    clientId="a157e2ad-7d43-4478-9051-541fd1b2023f" // required: 'application id/client id' obtained from https://apps.dev.microsoft.com for your app
    redirectUri="http://localhost:9999/authComplete.html" // required: redirectUri registered in https://apps.dev.microsoft.com for your app
    scopes={["user.read"]} //optional: defaults to "user.read" full list is present https://developer.microsoft.com/en-us/graph/docs/concepts/permissions_reference
    responseType="token" //optional: valid values are "token" for `Implicite OAuth flow` and "code" for `Authorization Code flow` defaults to "token"
    cssClass="some-css-class" // optional: space separated class names which are applied on the html Button element
    btnContent={ButtonContent} // optional: can be string or a valid react component which can be rendered inside html Button element
    handleLogin={(data) =>  }// required: callback to receive token/code after successful login
/> */}
          <SmartForm
            template={template}
            // onSubmit={handleSubmit}
            // buttons={['submit']}
          />
        </div>
      </div>
    </>
  );
};

export default TravelMatedashboard;
