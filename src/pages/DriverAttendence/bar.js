import {Button} from '@mui/material';
import React from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import 'pages/ManageRoutes/index.css';
const Mybar = ({graphData}) => {
  return (
    <div>
      <div>
        <div
          className='route-graph-upper-container'
          style={{marginTop: '28px'}}
        >
          {graphData[0]?.count ? (
            <span
              className='route-master-graph-div'
              style={{
                width: graphData[0]?.percent + '%',
              }}
            >
              <Button id='btnMui123' className='route-master-graph-div-btn'>
                <span>{graphData[0]?.percent + '%'}</span>
                <span className='route-master-graph-inner-span'>
                  <span className='route-master-graph-inner-span-2'>
                    <img
                      className='route-graph-upper-img'
                      src='/assets/images/travelling.png'
                    />
                  </span>
                  <span style={{marginLeft: '2px'}}>{graphData[0]?.count}</span>
                </span>
                <ArrowDropDownIcon className='route-arrow-down-icon' />
              </Button>
            </span>
          ) : null}
          {graphData[1]?.count ? (
            <span
              className='route-master-graph-div'
              style={{
                width: graphData[1]?.percent + '%',
              }}
            >
              <Button
                id='btnMui123'
                className='route-master-graph-div-btn'
                style={{marginLeft: '-40px'}}
              >
                <span>{graphData[1]?.percent + '%'}</span>
                <span className='route-master-graph-inner-span'>
                  <span className='route-master-graph-inner-span-2'>
                    <img
                      className='route-graph-upper-img'
                      src='/assets/images/travelling.png'
                    />
                  </span>
                  <span style={{marginLeft: '2px'}}>{graphData[1]?.count}</span>
                </span>
                <ArrowDropDownIcon className='route-arrow-down-icon' />
              </Button>
            </span>
          ) : null}
        </div>
        <div className='route-master-graph-bar-head'>
          <span
            className='route-master-graph-bar-body-left'
            style={{
              width: graphData[0]?.percent + '%',
            }}
          >
            {/* <ManIcon style={{fontSize: '15px'}} />
            <span className='route-graph-bar-count'>{graphData[0]?.count}</span> */}
          </span>
          <span
            style={{width: graphData[1]?.percent + '%'}}
            className='route-master-graph-bar-body-center'
          >
            {/* <ManIcon style={{fontSize: '15px'}} />
            <span className='route-graph-bar-count'>{graphData[1]?.count}</span> */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Mybar;
