import React, {useState, useEffect} from 'react';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import {Grid} from '@mui/material';
import Api from '@api';
import axios from 'axios';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import {toast} from 'react-toastify';
import {
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
const AssignmentRules = () => {
  const [open, setOpen] = useState(false);
  const [showbtn, setshowbtn] = useState(true);
  const [getAllList, setGetAllList] = useState();
  const [selectedRule, setSelectedRule] = useState();
  const header = ['Team Name', 'Team Description', 'Rules', ' '];

  const {user} = useAuthUser();
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
        }
      })
      .catch((err) => {});
  }
  useEffect(() => {
    getAll();
  }, []);

  function handleSubmit(el) {
    let postData = el;
    postData.assignmentRule = selectedRule;
    axios
      .put(Api.baseUri + '/user-reg/incidentTeam/update', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Rules assigned Successfully');
          getAll();
        }
      });
  }
  return (
    <>
            <Grid container spacing={2} sx={{padding: '30px'}}>
        <Grid item xs={9}>
          <CustomLabel labelVal='Assignment Rules' variantVal='h3-underline' />
        </Grid>
      </Grid>
      <Grid container sx={{padding: '0px 20px 0px 20px'}}>
        <Grid
          item
          xs={12}
          md={10}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItem: 'center',
            marginTop: '10px',
          }}
        >
          <TableContainer
            style={{
              boxShadow:
                'rgba(0, 0, 0, 0) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgb(0,102,133) 0px -3px 0px inset',
            }}
          >
            <Table sx={{minWidth: 650}} aria-label='simple table'>
              <TableHead style={{background: '#f1f1f1'}}>
                <TableRow>
                  {header?.map((el) => {
                    return <TableCell align='center'> {el} </TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {getAllList?.length ? (
                  getAllList?.map((el, i) => {
                    return (
                      <TableRow
                        style={{background: i % 2 == 0 ? '' : '#f5f7ff'}}
                      >
                        <TableCell> {el?.teamName} </TableCell>
                        <TableCell> {el?.teamDescription} </TableCell>
                        <TableCell>
                          <FormControl
                            sx={{display: 'flex', flexDirection: 'column'}}
                          >
                            <RadioGroup
                              onClick={(e) => {
                                setSelectedRule(e.target.value);
                              }}
                              defaultValue={el?.assignmentRule === null ? "RoundRobin":  el?.assignmentRule}
                              row
                              aria-labelledby='demo-row-radio-buttons-group-label'
                              name='row-radio-buttons-group'
                            >{console.log("Prince rule", el?.assignmentRule === null ? "RoundRobin":  el?.assignmentRule)}
                              <FormControlLabel
                                value='LoadBalance'
                                control={<Radio />}
                                label='Load Balance'
                              />
                              <FormControlLabel
                                value='Direct'
                                control={<Radio />}
                                label='Direct'
                              />
                              <FormControlLabel
                                value='RoundRobin'
                                control={<Radio />}
                                label='Round-Robin'
                              />
                            </RadioGroup>
                          </FormControl>{' '}
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              handleSubmit(el);
                            }}
                          >
                            Save
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={10}>
                      No Records Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default AssignmentRules;
