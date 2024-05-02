import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Button, Grid} from '@mui/material';
import {defaultsDeep} from 'lodash';
import moment from 'moment';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Autocomplete from '@mui/material/Autocomplete';
import {toast} from 'react-toastify';
import axios from 'axios';
import Api from '@api';
import TripInfo_copy from './TripInfo_copy';
const TripInfo = ({content, close}) => {
  const [value, setValue] = React.useState('1');
  const [trackerInput, setTrackerInput] = React.useState();
  const [comment, setComment] = React.useState();
  const [commentList, setCommentList] = useState();
  const handleChanges = (event) => {
    setAge(event.target.value);
  };
  const valueArray = [
    'Guard Not Available',
    'Guard Unable to Check-in',
    'Delay in Guard Boarding',
    'Vehicle Issue',
    'Driver Issue ',
    'Vendor Issue',
    'Other',
  ];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const title = [
    {title: 'Trip Id', value: content?.tripCode},
    {
      title: 'Planned Start Time',
      value: content?.startTime,
    },
    {
      title: 'Actual Start Time',
      value:
        content?.actualTripStartTime == 0
          ? '--'
          : moment(content?.actualTripStartTime).format('hh:mm'),
    },
    {
      title: 'Actual End Time',
      value:
        content?.actualTripCompletionTime == 0
          ? '--'
          : moment(content?.actualTripCompletionTime).format('hh:mm'),
    },
    {title: 'Vehicle Reg No.', value: content?.vehicleNo},
    {title: 'Vendor Name', value: content?.vendorName},
    {title: 'Driver Name', value: content?.driverName},
    {title: 'Driver Mobile', value: content?.driverMobileNo},
  ];
  console.log('currentData', content);

  useEffect(() => {
    axios
      .get(Api.baseUri + `/user-reg/trip-route/get-trip-by-id/${content?._id}`)
      .then((res) => {
        if (res?.data?.status == '200') {
          console.log('res', res);
          setCommentList(res?.data?.data?.tripCommentDto);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, [content?._id]);
  function Comment({list}) {
    return (
      <>
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow sx={{background: '#f6f6f6'}}>
                <TableCell
                  // align='right'
                  sx={{fontWeight: '800', fontSize: '13px'}}
                >
                  Tracker Input
                </TableCell>
                <TableCell
                  // align='right'
                  sx={{fontWeight: '800', fontSize: '13px'}}
                >
                  Comment
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list?.map((el) => {
                return (
                  <TableRow>
                    <TableCell
                      // align='right'
                      sx={{fontSize: '13px'}}
                    >
                      {el?.trackerInput}
                    </TableCell>
                    <TableCell
                      // align='right'
                      sx={{fontSize: '13px'}}
                    >
                      {el?.comments}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
  return (
    <div>
      <Box sx={{width: '100%', typography: 'body1'}}>
        <TabContext value={value}>
          <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
            <TabList onChange={handleChange} aria-label='lab API tabs example'>
              <Tab label='Input' value='1' />
              <Tab label='Comments' value='2' />
            </TabList>
          </Box>
          <TabPanel value='1'>
            <>
              <TripInfo_copy content={content} close={() => close()} />
            </>
          </TabPanel>
          <TabPanel value='2'>
            <Comment list={commentList} />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};

export default TripInfo;
