import React, {useEffect, useState} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import axios from 'axios';
import Api from '@api';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Paper from '@mui/material/Paper';
import {Grid} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import {toast} from 'react-toastify';
const Permission = () => {
  const [getAllList, setGetAllList] = useState();
  const {user} = useAuthUser();
  const label = {inputProps: {'aria-label': 'Checkbox demo'}};
  const [checked, setChecked] = useState({});
  function getAll() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incidentTeam/getAllByCorporateId/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setGetAllList(res?.data?.data);
          let result = res?.data?.data.reduce(
            (a, v) => ({...a, [v?.id]: v?.permissions}),
            {},
          );
          console.log('result', result);
          setChecked(result);
        }
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAll();
  }, []);
  useEffect(() => {
    console.log('check', checked);
  }, [checked]);

  function handleSubmit() {
    let postData = [];
    Object.keys(checked)?.map((el) => {
      postData.push({
        id: el,
        permissions: checked[el],
      });
    });
    let temObj = {};
    postData?.map((el) => {
      temObj[el.id] = el.permissions;
    });
    console.log(temObj, ':::::REQUES');
    axios
      .put(Api.baseUri + '/user-reg/incidentTeam/update', temObj)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Saved successfully');
          getAll();
        }
      });
  }
  const modules = [
    'TICKETS',
    'HQ',
    'Agent Queue',
    'Team Queue',
    'View',
    'REPORTS',
    'CREATE TICKET',
    'SETTINGS',
    'Ticket Status',
    'Agents',
    'Teams',
    'Permissions',
    'Channel Defination',
    'SLA',
    'Assignment rules',
  ];
  function handleSave(e) {
    console.log('e', e);
    let postData = [];
    Object.keys(checked)?.map((el) => {
      postData.push({
        id: el,
        permissions: checked[el],
      });
    });
    let temObj = {};
    postData?.map((el) => {
      if (e?.id == el?.id) {
        console.log('yes');
        // temObj[el.id] = el.permissions;
        let tempObj = e;
        tempObj.id = el?.id;
        tempObj.permissions = el?.permissions;
        axios
          .put(Api.baseUri + '/user-reg/incidentTeam/update', tempObj)
          .then((res) => {
            if (res?.data?.status == '200') {
              toast.success('Saved successfully');
              getAll();
            }
          });
      }
    });
    console.log(temObj, ':::::REQUES');
  }
  return (
    <div>
      <Grid container>
        <Grid item md={12}>
          <Paper sx={{width: '100%', overflow: 'hidden'}}>
            <TableContainer sx={{maxHeight: 300}}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    <TableCell> Teams </TableCell>
                    {modules?.map((el) => {
                      return <TableCell>{el}</TableCell>;
                    })}
                    <TableCell> </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getAllList?.map((e, index) => {
                    return (
                      <TableRow>
                        <TableCell>
                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={
                                    checked[e.id]
                                      ? true
                                      : false || e?.permissions?.length
                                      ? true
                                      : false
                                  }
                                  onClick={() => {
                                    let temobj = checked;
                                    if (checked[e.id]) {
                                      temobj[e.id] = null;
                                    } else {
                                      temobj[e.id] = [];
                                    }
                                    setChecked({...temobj});
                                  }}
                                />
                              }
                              label={e?.teamName}
                            />
                          </FormGroup>
                        </TableCell>
                        {modules?.map((el, ind) => {
                          return (
                            <TableCell>
                              <Checkbox
                                {...label}
                                checked={
                                  checked[e.id] && checked[e.id]?.includes(el)
                                    ? true
                                    : false
                                }
                                onChange={(event) => {
                                  let myactions = checked[e.id] || [];
                                  if (!myactions.includes(el)) {
                                    myactions.push(el);
                                  } else {
                                    myactions.splice(myactions.indexOf(el), 1);
                                  }
                                  setChecked({...checked, [e.id]: myactions});
                                }}
                              />
                            </TableCell>
                          );
                        })}
                        <TableRow>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginTop: '20px',
                            }}
                          >
                            {' '}
                            <SaveIcon
                              variant='contained'
                              onClick={() => {
                                handleSave(e);
                              }}
                            >
                              save
                            </SaveIcon>
                          </div>
                        </TableRow>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Permission;
