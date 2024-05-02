import React, {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Api from '@api';
import axios from 'axios';
import Checkbox from '@mui/material/Checkbox';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {Grid} from '@mui/material';
import moment from 'moment';
import {ConstructionOutlined, DriveFileMoveRounded} from '@mui/icons-material';
import jsPDF from 'jspdf';
const TripSheet = ({
  tId,
  onclickChange,
  myref,
  handlePrintTripSheet,
  multipleTrip,
}) => {
  // {ind + index + 1}
  const [data, setData] = useState();
  const [trip, setTrip] = useState();
  const [companyName, setCompanyName] = useState();
  const [vendor, setVendor] = useState();
  const [escort, setEscort] = useState();
  const tableHeader = [
    'S.No',
    'Employee Code',
    'Employee Name',
    'Project/Dept',
    'Pickup/Drop Location',
    'Pickup/Drop Time',
    'Employee Signature',
    'Absent',
    'Opening Kms',
    'Closing Kms',
    'Total kms',
  ];
  const label = {inputProps: {'aria-label': 'Checkbox demo'}};
  const {user} = useAuthUser();
  useEffect(() => {}, [tId]);

  useEffect(() => {
    axios
      .get(
        Api.baseUri + `/user-reg/corporate-reg/${user?.userList?.corporateId}`,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setCompanyName(res?.data?.data?.companyName);
        }
      })
      .catch((err) => {
        setCompanyName('');
      });
  }, [user?.userList?.corporateId]);

  useEffect(() => {
    const createPDF = async () => {
      // setTripSheetId(id);
      const pdf = new jsPDF('landscape', 'pt', 'legal');
      const data = await document.querySelector('#pdftripSheet');

      // Set the dimensions of the content to match the page size
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      data.style.width = pdfWidth + 'px';
      data.style.height = pdfHeight + 'px';

      // Add the content to the PDF
      pdf.html(data).then(() => {
        // pdf.addPage();
        pdf.save('tripSheet.pdf');
        onclickChange();
      });
    };
    if (tId) {
      setTimeout(function () {
        createPDF();
      }, 2000);
    }
  }, []);

  return (
    <>
      {
        <div id='pdftripSheet' ref={myref}>
          {multipleTrip?.map((el) => {
            let mind = 0;
            return (
              <Table sx={{border: '1px solid black', marginBottom: '10px'}}>
                <TableHead sx={{padding: '0px'}}>
                  <TableRow>
                    <TableCell sx={{border: '1px solid black'}} colSpan={3}>
                      <div
                        className='inner-cell-border'
                        style={{
                          marginTop: '-12px',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 600,
                          }}
                        >
                          <strong>Trip Id:</strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>{el?.tripCode}</div>
                      </div>
                      <div className='inner-cell-border'>
                        <div style={{fontWeight: 600}}>
                          <strong>Route Number:</strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>{el?.routeName}</div>
                      </div>
                      <div className='inner-cell-border'>
                        <div style={{fontWeight: 600}}>
                          <strong> Driver Name:</strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>{el?.driverName}</div>
                      </div>
                      <div className='inner-cell-border'>
                        <div style={{fontWeight: 600}}>
                          <strong> Vehicle No.: </strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>{el?.vehicleNo}</div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          marginBottom: '-12px',
                          marginTop: '5px',
                        }}
                      >
                        <div style={{fontWeight: 600}}>
                          <strong> Vehicle type:</strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                          {el?.vehicleType}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{border: '1px solid black', alignItems: 'center'}}
                      colSpan={5}
                    >
                      <div
                        style={{
                          alignItems: 'center',
                          display: 'flex',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <img src={Api.imgUrl + el?.vendorLogo} />
                        <p style={{fontWeight: 600, fontSize: '20px'}}>
                          {el?.vendorName}
                        </p>
                        <p>
                          {el?.vendorAddress?.addressName?.split('++')?.[0] +
                            ' ' +
                            el?.vendorAddress?.addressName?.split('++')?.[1] +
                            ' ,' +
                            el?.vendorAddress?.city +
                            ', ' +
                            el?.vendorAddress?.state +
                            ' ,' +
                            el?.vendorAddress?.pinCode}
                        </p>
                        <p>{el?.vendorMobileNo + ',' + el?.vendorEmailId}</p>
                      </div>
                    </TableCell>
                    <TableCell sx={{border: '1px solid black'}} colSpan={3}>
                      <div
                        className='inner-cell-border'
                        style={{
                          marginTop: '-12px',
                        }}
                      >
                        <div style={{fontWeight: 600}}>
                          <strong>Date:</strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                          {moment(el?.date).format('DD-MM-YYYY')}
                        </div>
                      </div>
                      <div className='inner-cell-border'>
                        <div style={{fontWeight: 600}}>
                          <strong>Shift Time:</strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>
                          {el?.startTimeInMiliSecStr?.split(' ')?.[1]}
                        </div>
                      </div>
                      <div className='inner-cell-border'>
                        <div style={{fontWeight: 600}}>
                          <strong> Shift Type:</strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>{el?.shiftName}</div>
                      </div>
                      <div className='inner-cell-border'>
                        <div style={{fontWeight: 600}}>
                          <strong>Facility/Company: </strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>{companyName}</div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          marginBottom: '-12px',
                          marginTop: '5px',
                        }}
                      >
                        <div style={{fontWeight: 600}}>
                          <strong> Trip Type:</strong>
                        </div>
                        <div style={{marginLeft: '10px'}}>{el?.tripType}</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    {tableHeader?.map((el) => {
                      return (
                        <TableCell sx={{border: '1px solid black'}}>
                          {el}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {el?.stopList?.map((e, index) => (
                    <>
                      {e?.onBoardPassengers?.map((_emp, ind) => {
                        mind++;
                        if (_emp?.passType == 'ESCORT') {
                          mind--;
                          return;
                        }
                        return (
                          <TableRow>
                            <TableCell sx={{border: '1px solid black'}}>
                              {mind}
                            </TableCell>
                            <TableCell sx={{border: '1px solid black'}}>
                              {_emp?.empCode}
                            </TableCell>
                            <TableCell sx={{border: '1px solid black'}}>
                              {_emp?.name}
                            </TableCell>
                            <TableCell sx={{border: '1px solid black'}}>
                              {_emp?.empDepartmentName}
                            </TableCell>
                            <TableCell sx={{border: '1px solid black'}}>
                              {_emp?.location?.locName}
                            </TableCell>
                            <TableCell sx={{border: '1px solid black'}}>
                              {moment(_emp?.actualPickUpDateTime).format(
                                'HH:mm',
                              )}
                            </TableCell>
                            <TableCell sx={{border: '1px solid black'}}>
                              --
                            </TableCell>
                            <TableCell sx={{border: '1px solid black'}}>
                              <Checkbox
                                {...label}
                                checked={
                                  _emp?.status == 'ABSENT' ? true : false
                                }
                              />
                            </TableCell>
                            <TableCell
                              sx={{border: '1px solid black'}}
                            ></TableCell>
                            <TableCell
                              sx={{border: '1px solid black'}}
                            ></TableCell>
                            <TableCell
                              sx={{border: '1px solid black'}}
                            ></TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  ))}
                  {el?.stopList?.map((_el) => {
                    return (
                      <>
                        {_el?.onBoardPassengers?.map((escort) => {
                          if (escort?.passType !== 'ESCORT') {
                            return;
                          }
                          return (
                            <TableRow>
                              <TableCell
                                sx={{
                                  borderBottom: '1px solid white',
                                  borderLeft: '1px solid black',
                                  borderRight: '1px solid black',
                                }}
                                colSpan={11}
                              >
                                <Grid
                                  container
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Grid item md={3}>
                                    <strong>Escort Name:</strong>{' '}
                                    {escort?.escortName}
                                  </Grid>
                                  <Grid item md={3}>
                                    <strong>Escort Pickup Time:</strong>
                                    {moment(
                                      escort?.actualPickUpDateTime,
                                    )?.format('HH:mm')}
                                  </Grid>
                                  <Grid item md={3}>
                                    <strong>Escort Drop Time:</strong>
                                    {moment(escort?.actualDropDateTime)?.format(
                                      'HH:mm',
                                    )}
                                  </Grid>
                                  <Grid item md={3}>
                                    <strong>Escort Signature:</strong>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </>
                    );
                  })}
                  <TableRow>
                    <TableCell sx={{border: '1px solid black'}} colSpan={11}>
                      <Grid
                        container
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          // alignItems: 'center',
                          // width: '90%',
                          // margin: 'auto',
                          padding: '10px',
                        }}
                      >
                        <Grid
                          md={4}
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <strong>Vendor Supervisor Signature: </strong>
                        </Grid>
                        <Grid
                          md={4}
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <strong>Security Officer Signature: </strong>
                        </Grid>
                        <Grid
                          md={4}
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <strong>Audit Signature:</strong>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            );
          })}
        </div>
      }
    </>
  );
};

export default TripSheet;
