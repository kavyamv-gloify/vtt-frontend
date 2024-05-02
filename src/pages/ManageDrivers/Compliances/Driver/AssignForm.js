import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Api from '@api';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import {toast} from 'react-toastify';
import {getFormData} from '@hoc';
const label = {inputProps: {'aria-label': 'Checkbox demo'}};

const AssignForm = ({id, driverId, close}) => {
  const [data, setData] = useState();
  const [driverData, setdriverData] = useState();

  function getcomplianceDetail() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/compliance-topic/get-compliance-topic-byid/' +
          id,
      )
      .then((res) => {
        if (!driverId) return;
        const baseURL = `${Api.driver.list}/${driverId}`;
        axios
          .get(baseURL)
          .then((response) => {
            setdriverData(response.data.data);
            if (response.data?.data?.complianceDto?.compliances?.length) {
              res.data.data.compliances =
                response.data?.data?.complianceDto?.compliances;
            }

            setData(res?.data?.data);
          })
          .catch((err) => {
            setdriverData({});
          });
      })
      .catch((err) => {
        setData();
      });
  }

  useEffect(() => {
    getcomplianceDetail();
  }, []);

  function handleChange(e, i) {
    const {checked} = e.target;
    let tem = data;
    if (checked) tem.compliances[i].status = 'YES';
    else tem.compliances[i].status = 'NO';
    setData(tem);
  }

  function handleDialSubmit() {
    let postData = driverData;
    postData.complianceDto = {
      topicId: data?.id,
      compliances: data?.compliances,
    };
    // postData.complianceDto.compliances?.map((el, ind) => {
    //     delete postData.complianceDto.compliances[ind].id;
    //     postData.complianceDto.compliances[ind].status = postData.complianceDto.compliances[ind].status || "NO"
    // })

    let dataSet = {};
    let allElem = {};
    Object.keys(postData).map((key) => {
      if (typeof postData[key]?.[0]?.name == 'string') {
        dataSet = {
          ...dataSet,
          [key]: postData[key][0],
        };
      } else {
        allElem = {
          ...allElem,
          [key]: postData[key],
        };
      }
    });
    dataSet = {
      ...dataSet,
      data: JSON.stringify(allElem),
    };

    // return;
    axios({
      method: 'put',
      url: Api.driver.list,
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    })
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success(res?.data?.message ?? 'Compliances added succesfully');
          close();
        } else {
          toast.error(res?.data?.message ?? 'Something Went Wrong');
        }
      })
      .catch((err) => {
        toast.error('Something Went Wrong');
      });
  }
  return (
    <>
      <TableContainer component={Paper} sx={{marginTop: '10px'}}>
        <Table sx={{minWidth: 50}} aria-label='simple table'>
          <TableHead sx={{background: 'rgb(244, 242, 242)'}}>
            <TableRow>
              <TableCell sx={{width: '10px'}}>S.No.</TableCell>
              <TableCell align='left'>Compliance</TableCell>
              <TableCell align='center' sx={{width: '20px'}}>
                Select
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.compliances?.map((el) => {})}
            {data?.compliances?.map((el, index) => (
              <TableRow
                key={index}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell
                  align='center'
                  component='th'
                  scope='row'
                  sx={{width: '10px'}}
                >
                  {Number(index) + 1}
                </TableCell>
                <TableCell align='left'>{el?.subTopicName}</TableCell>
                <TableCell align='center' sx={{width: '20px'}}>
                  {driverData ? (
                    <Checkbox
                      {...label}
                      // defaultChecked
                      name={index}
                      defaultChecked={
                        data?.compliances?.length &&
                        driverData?.complianceDto?.compliances[index]?.status ==
                          'YES'
                      }
                      onChange={(e) => {
                        handleChange(e, index);
                      }}
                    />
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{paddingTop: '30px', width: '10%', margin: 'auto'}}>
        <Button id='btnMui123' variant='contained' onClick={handleDialSubmit}>
          Submit
        </Button>
      </div>
    </>
  );
};

export default AssignForm;
