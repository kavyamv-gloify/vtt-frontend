import React, {useState} from 'react';
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
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import moment from 'moment';
import downDoc from '@common/fileDownload';
import _ from 'lodash';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
const PenaltySummary = ({driverListOptions}) => {
  const [success, setSuccess] = useState(true);
  const [mySummary, setMySummary] = useState([]);
  const {user} = useAuthUser();
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
          entityId: null, //val?.did
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
        Vendor: `${n?.vendorName || '-'}`,
        Driver: `${n?.driverName || '-'}`,
        Vehicle: n?.vehicleName || '-',
        Supervisor: n?.supervisorName || '-',
        'Wave Off Amount': n?.waveOffAmount || '-',
        'Final Penalty': n?.finalPenalty || '-',
      });
    });
    if (_.isEmpty(csvData)) {
      toast.error('No Data found!');
    } else {
      downDoc.downloadReport(
        {
          PanaltySummary: csvData,
        },
        'Panalty_Summary_Driver',
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
                  S.No.
                </TableCell>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Effective Date
                </TableCell>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Compliance
                </TableCell>
                {user?.userList?.userRole !== 'VENDOR' && (
                  <TableCell align='left' style={{fontWeight: 'bold'}}>
                    Vendor
                  </TableCell>
                )}
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Driver
                </TableCell>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Vehicle
                </TableCell>
                {/* <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Supervisor
                </TableCell> */}
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Default Penalty
                </TableCell>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Wave Off Amount
                </TableCell>
                <TableCell align='left' style={{fontWeight: 'bold'}}>
                  Final Penalty
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mySummary?.map((el, _idn) => {
                if (
                  user?.userList?.userRole == 'VENDOR' &&
                  el?.vendorId !== user?.userList?.profileId
                ) {
                  return;
                }
                return (
                  <TableRow key={'index' + _idn}>
                    <TableCell align='left'>{_idn + 1}</TableCell>
                    <TableCell align='left'>
                      {moment(el.penaltyEffectiveDate).format('DD-MM-YYYY')}
                    </TableCell>
                    <TableCell align='left'>{el?.topicName}</TableCell>
                    {user?.userList?.userRole !== 'VENDOR' && (
                      <TableCell align='left'>{el.vendorName || '-'}</TableCell>
                    )}

                    <TableCell align='left'>{el.driverName || '-'}</TableCell>
                    <TableCell align='left'>{el.vehicleName || '-'}</TableCell>
                    {/* <TableCell align='left'>
                      {el.supervisorName || '-'}
                    </TableCell> */}
                    <TableCell align='left'>{el.defaultPenalty || 0}</TableCell>
                    <TableCell align='left'>{el.waveOffAmount || 0}</TableCell>
                    <TableCell align='left'>{el.finalPenalty || 0}</TableCell>
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

export default PenaltySummary;
