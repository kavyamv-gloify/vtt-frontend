import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Api from '@api';
import moment from 'moment';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import downDoc from '@common/fileDownload';
import _ from 'lodash';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
const ItemWiseSummary = ({driverListOptions}) => {
  const [success, setSuccess] = useState(true);
  const [mySummary, setMySummary] = useState([]);
  const [driverListOptions_t, setdriverListOptions_t] = useState([]);
  const {user} = useAuthUser();
  useEffect(() => {
    let apibaseUrl =
      user?.userList?.userRole == 'VENDOR'
        ? `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${user?.userList?.corporateId}&vendorId=${user?.userList?.profileId}`
        : `/user-reg/associateVehicle/getAllAssociatedVehicles?corporateId=${
            user?.userList?.corporateId
          }&vendorId=${null}`;
    axios
      .get(
        Api.baseUri +
          // '/user-reg/driver-reg/corporateId?page=0&size=1000&dlNumber=null&emailId=null&mobileNo=null',
          apibaseUrl,
      )
      .then((response) => {
        console.log('res', response);
        let _tem = [];
        response?.data?.data?.map((el) => {
          _tem.push({
            title:
              el?.vehicle?.vehicleNumberPlate + ' ' + el?.vehicle?.vehicleBrand,
            value: el?.vehicle?.id,
          });
        });

        // if (user?.userList?.userRoleName == 'VENDOR') {
        //   response?.data?.data?.body?.data?.map((el) => {
        //     if (el?.vendorId == user?.userList?.profileId) {
        //       _tem.push(el);
        //     }
        //   });
        // } else {
        //   _tem = response?.data?.data?.body?.data;
        // }
        // let ar = [];
        // let tem = _tem;
        // tem?.map((el) => {
        //   ar.push({title: el?.firstName + ' ' + el?.lastName, value: el?.id});
        // });
        setdriverListOptions_t([..._tem]);
      })
      .catch((er) => {});
  }, [user?.userList]);
  const penaltySummaryTemplate = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'section',
            layout: {column: 1, spacing: 2, size: 'medium', label: 'fixed'},
            fields: [
              {
                type: 'autocomplete',
                name: 'did',
                id: 'did',
                title: 'Vehicle',
                options: driverListOptions_t || [],
                validationProps: {
                  required: 'This is a mandatory field',
                },
              },
              {
                type: 'section',
                layout: {column: 2, spacing: 2, size: 'medium', label: 'fixed'},
                fields: [
                  {
                    type: 'date',
                    name: 'fromDate',
                    id: 'fromDate',
                    title: 'From Date',
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                  },
                  {
                    type: 'date',
                    name: 'toDate',
                    id: 'toDate',
                    title: 'Till Date',
                    validationProps: {
                      required: 'This is a mandatory field',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
  function getPenaltyList(val) {
    axios
      .post(
        Api.baseUri +
          '/user-reg/driver-reg/get-all-penalty/' +
          val?.fromDate +
          '/' +
          val?.toDate,
        {
          entityId: val?.did,
        },
      )
      .then((res) => {
        setMySummary(res?.data?.data || []);
      })
      .catch((er) => {
        setMySummary([]);
      });
  }
  const handleExport = () => {
    let csvData = [];
    mySummary?.map((n, index) => {
      csvData.push({
        'S.No': index + 1,
        'Effective Date': moment(n.penaltyEffectiveDate).format('DD-MM-YYYY'),
        'Compliance Name': `${n?.topicNameKey || '-'}`,
        Status: `${n?.status?.charAt(0) || 'N'}`,
        'Wave Off Amount': n?.waveOffAmount,
        ' Default Penalty': n?.defaultPenalty,
        'Final Penalty': (n?.defaultPenalty || 0) - (n?.waveOffAmount || 0),
      });
    });
    if (_.isEmpty(csvData)) {
      toast.error('No Data found!');
    } else {
      downDoc.downloadReport(
        {
          PanaltySummary: csvData,
        },
        'ItemWise_Panalty_Driver',
      );
    }
  };
  return (
    <div>
      <>
        <SmartForm
          template={penaltySummaryTemplate}
          defaultValues={{
            fromDate: moment().format('YYYY-MM-DD'),
            toDate: moment().format('YYYY-MM-DD'),
          }}
          onSubmit={(e) => {
            setSuccess(false);
            setTimeout(() => {
              setSuccess(true);
            }, 500);
            getPenaltyList(e.data);
          }}
          success={success}
          buttons={['View Summary']}
        />
        <div style={{display: 'flex', justifyContent: 'end'}}>
          <ArrowCircleDownIcon onClick={handleExport} className='cursor' />
        </div>
        <TableContainer component={Paper} sx={{mt: 4}}>
          <Table aria-label='simple table'>
            <TableHead style={{background: '#f1f1f1'}}>
              <TableRow key={'index'}>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Effective Date
                </TableCell>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Compliance Name
                </TableCell>
                {/* <TableCell align="left" style={{ fontWeight: "bold" }}>Sub Compliance Name</TableCell> */}
                <TableCell
                  align='left'
                  style={{fontWeight: 'bold', width: '100px'}}
                >
                  Status
                </TableCell>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Wave Off Amount
                </TableCell>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Default Penalty
                </TableCell>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Final Penalty
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mySummary?.map((el, _idn) => {
                return (
                  <TableRow key={'index' + _idn}>
                    <TableCell align='left'>
                      {moment(el.penaltyEffectiveDate).format('DD-MM-YYYY')}
                    </TableCell>
                    <TableCell align='left'>{el.topicNameKey}</TableCell>
                    {/* <TableCell align="left">{el.subTopicName}</TableCell> */}
                    <TableCell
                      align='center'
                      style={{display: 'flex', justifyContent: 'center'}}
                    >
                      <div
                        className={
                          el.status == 'MET'
                            ? 'penalty-status-met'
                            : 'penalty-status-not-met'
                        }
                      >
                        {el.status?.charAt(0) || 'N'}
                      </div>
                    </TableCell>
                    <TableCell align='left'>{el.waveOffAmount}</TableCell>
                    <TableCell align='left'>{el.defaultPenalty}</TableCell>
                    <TableCell align='left'>
                      {(el.defaultPenalty || 0) - (el.waveOffAmount || 0)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </div>
  );
};

export default ItemWiseSummary;
