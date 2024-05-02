import {
  Button,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import Paper from '@mui/material/Paper';
import Api from '@api';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SaveIcon from '@mui/icons-material/Save';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
import _ from 'lodash';

const PenaltyMaster = () => {
  const {user} = useAuthUser();
  const [topicList, setTopicList] = useState([]);
  const [defPenalty, setDefPenalty] = useState({});
  useEffect(() => {
    getAllDriverCompTopics();
  }, []);
  function getAllDriverCompTopics() {
    axios
      .get(
        Api.baseUri + '/user-reg/compliance-topic/getAllByCorporateId/DRIVER',
      )
      .then((res) => {
        setTopicList(res?.data?.data);
        let ob = {};
        res?.data?.data?.map((re) => {
          ob[re.id] = re.defaultPenalty;
        });
        setDefPenalty({...ob});
      })
      .catch((err) => {});
  }
  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'end',
        }}
      >
        <Button
          id='btnMui123'
          variant='outlined'
          onClick={() => {
            let arr = [];
            for (const [key, value] of Object.entries(defPenalty)) {
              arr.push({
                id: key,
                applicableCorporate: user?.userList?.profileId,
                defaultPenalty: value,
              });
            }
            axios
              .post(
                Api?.baseUri +
                  '/user-reg/compliance-topic/update-compliance-topic-penalty',
                arr,
              )
              .then((res) => {
                if (res?.data?.status == '200') {
                  toast.success('Penalty master saved successfully.');
                  getAllDriverCompTopics();
                } else {
                  toast.error(res?.data?.message || 'Something went wrong.');
                }
              })
              .catch((err) => {
                toast.error('Something went wrong.');
              });
          }}
        >
          <SaveIcon style={{fontSize: '18px', marginRight: '2px'}} />
          Save
        </Button>
      </div>
      <TableContainer component={Paper} sx={{mt: 4}}>
        <Table aria-label='simple table'>
          <TableHead style={{background: '#f1f1f1'}}>
            <TableRow key={'index'}>
              <TableCell align='left' style={{fontWeight: 'bold'}}>
                Group Name
              </TableCell>
              <TableCell align='left' style={{fontWeight: 'bold'}}>
                For
              </TableCell>
              <TableCell align='left' style={{fontWeight: 'bold'}}>
                Compliance Name
              </TableCell>
              <TableCell align='right' style={{fontWeight: 'bold'}}>
                Default Penalty Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topicList?.map((el, _idn) => {
              return (
                <TableRow key={'index' + _idn}>
                  <TableCell align='left'>
                    {el.complianceGroupName || '-'}
                  </TableCell>
                  <TableCell align='left'>{el.complianceType}</TableCell>
                  <TableCell align='left'>{el.topicNameKey}</TableCell>
                  <TableCell align='right'>
                    <TextField
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <CurrencyRupeeIcon
                              style={{
                                fontSize: '15px',
                                padding: '0px',
                                margin: '-6px',
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      style={{maxWidth: '100px'}}
                      size='small'
                      id={_idn + 'penAmt'}
                      value={defPenalty[el?.id]}
                      onInput={(e) => {
                        if (
                          _.isNaN(Number(e.target.value)) ||
                          Number(e.target.value) > 100000
                        )
                          return;
                        setDefPenalty({
                          ...defPenalty,
                          [el?.id]: Number(e.target.value),
                        });
                      }}
                      InputLabelProps={{shrink: true}}
                      fullWidth
                      variant='outlined'
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PenaltyMaster;
