import React, {useEffect} from 'react';
import {Button} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import {pink} from '@mui/material/colors';
import Checkbox from '@mui/material/Checkbox';
import RouteIcon from '@mui/icons-material/Route';
const label = {inputProps: {'aria-label': 'Checkbox demo'}};
const CarouselCard = (props) => {
  // const fetchDataAsync = async () => {
  //   try {
  //     // Fetch storedSelectedIds from local storage
  //     const storedSelectedIds =
  //       JSON.parse(localStorage.getItem('selectedIds')) || [];
  //     console.log('storedSelectedIds', storedSelectedIds);
  //     // Loop through each selected id and call the function
  //     for (const selectedId of storedSelectedIds) {
  //       try {
  //         await props.getSelectedbyLocalstorage(selectedId);
  //       } catch (error) {
  //         // Handle errors for individual calls if needed
  //       }
  //     }
  //   } catch (error) {
  //     // Handle errors for fetching storedSelectedIds if needed
  //     console.error('Error fetching storedSelectedIds:', error);
  //   }
  // };
  // useEffect(() => {
  //   const storedSelectedIds =
  //     JSON.parse(localStorage.getItem('selectedIds')) || [];

  //   if (storedSelectedIds.length > 0) {
  //     fetchDataAsync();
  //   }
  // }, []);
  return (
    <>
      <div
        onClick={() => {
          props.getSelected(props?.rosterList?.id); 
        }}
        style={{
          maxWidth: '100%',
          borderRadius: '10px',
          wordBreak: 'break-word',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          boxShadow: '0 8px 16px 0 rgb(0 0 0 / 25%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            wordBreak: 'break-word',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {props?.rosterList?.id?.split('__')[1] == 'LOGIN' ? (
            <img
              style={{height: '30px', marginLeft: '12px'}}
              src='/assets/images/login_icon.png'
            />
          ) : (
            <img
              style={{height: '30px', marginLeft: '12px'}}
              src='/assets/images/logout_icon.png'
            />
          )}
          <div style={{marginLeft: '1em', postion: 'absolute'}}>
            <h2 style={{fontWeight: 'bold', fontSize: '2.5em'}}>
              {props.rosterList?.time}
            </h2>
            <div style={{display: 'flex', postion: 'absolute'}}>
              <WbTwilightIcon style={{fontSize: '1.4em', fontWeight: 'bold'}} />
              <h4
                style={{
                  //   fontWeight: 'bold',
                  fontWeight: 'bold',
                  width: '100px',
                  overflow: 'hidden',
                  paddingLeft: '10px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {props?.shiftName}
              </h4>
              <ImportExportIcon
                style={{fontSize: '1.4em', fontWeight: 'bold'}}
              />
            </div>
          </div>
        </div>
        <div
          variant='contained'
          style={{
            display: 'flex',
            fontWeight: 600,
            color: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            background:
              props?.rosterList?.id?.split('__')[1] == 'LOGIN'
                ? 'rgb(30 140 186)'
                : '#feac4e',
            borderRadius: '0px 0px 10px 10px',
            height: '3em',
          }}
        >
          <span>{props.name}</span>
          {/* <span><RouteIcon style={{ fontSize: '16px' }} /></span> */}
        </div>
      </div>
    </>
  );
};

export default CarouselCard;
