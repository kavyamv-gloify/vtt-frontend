import {
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useAuthUser} from '@crema/utility/AuthHooks';
import CloseIcon from '@mui/icons-material/Close';
import Checkbox from '@mui/material/Checkbox';
import _ from 'lodash';
import axios from 'axios';
import Api from '@api';
import {toast} from 'react-toastify';

const DialTax = ({id, setSelectedData}) => {
  const {user} = useAuthUser();
  const [stateVal, setStateVal] = useState();
  const [inputVal, setInputVal] = useState({});
  const [myData, setMyData] = useState({});
  const [stateList, setStateList] = useState([]);
  const [checkVal, setCheckVal] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    if (!stateList?.length) return;
    if (id == 'CREATE') {
      setStateVal(stateList[0]);
      return;
    }
    axios
      .get(Api.baseUri + '/user-reg/tax-Applicable/get-by-id/' + id)
      .then((res) => {
        setMyData(res?.data?.data);
        let in_tem = {};
        let check_tem = [];
        res?.data?.data?.tax?.map((el, ind) => {
          if (el.isApplicable == 'Yes') {
            in_tem[el.id] = el.taxAbleAmount;
            check_tem.push(el.id);
          }
        });
        setCheckVal([...check_tem]);
        setInputVal({...in_tem});
        stateList?.map((el, i) => {
          if (res?.data?.data?.state == el.value) {
            setStateVal(el);
            return;
          }
        });
      })
      .catch((er) => {});
  }, [id, stateList]);

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/associatevendor/getallassociateCorporateByVendorId/' +
          user?.userList?.profileId,
      )
      .then((re) => {
        console.log('re', re?.data?.data);
        let st = [];
        re?.data?.data?.map((el) => {
          if (!st.includes(el?.corporate?.companyAddress?.state)) {
            st.push({
              title: el?.corporate?.companyAddress?.state,
              value: el?.corporate?.companyAddress?.state,
            });
          }
        });
        console.log('st', st);
        setStateList(st);
      })
      .catch((er) => {});
    axios
      .get(Api.baseUri + '/user-reg/TaxType-Service/getAll')
      .then((res) => {
        let ar = [];
        res?.data?.data?.map((el) => {
          if (el.status == 'ACTIVE') ar.push(el);
        });
        setCategoryList(ar);
      })
      .catch((er) => {
        setCategoryList([]);
      });
  }, []);

  return (
    <div>
      <Dialog
        open={true}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
        onClose={() => {
          setSelectedData(null);
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            background: '#f1f1f1',
          }}
        >
          <h2>{id == 'CREATE' ? 'Add' : 'Update'} Taxes</h2>
          <CloseIcon
            onClick={() => {
              setSelectedData(null);
            }}
          />
        </DialogTitle>
        <DialogContent>
          <div style={{padding: '20px'}}>
            {stateVal?.value && (
              <Autocomplete
                id='checkboxes-tags-demo'
                value={stateVal} //  || stateList[0]
                options={stateList}
                disableClearable
                onChange={(e, v) => {
                  setStateVal(v);
                }}
                getOptionLabel={(option) => option.title}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label='Select State' />
                )}
              />
            )}
            <TableContainer component={Paper} sx={{mt: 4}}>
              <Table aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' style={{width: '50px'}}>
                      <Checkbox
                        checked={
                          checkVal?.length == categoryList?.length
                            ? true
                            : false
                        }
                        id={'parent-check'}
                        key={'parent-check'}
                        onChange={() => {
                          if (checkVal?.length == categoryList?.length) {
                            setCheckVal([]);
                          }
                          let arr = [];
                          categoryList?.map((e, ind) => {
                            arr.push(e.id);
                          });
                          setCheckVal([...arr]);
                        }}
                        color='primary'
                        sx={{mt: 1}}
                      />
                    </TableCell>
                    <TableCell align='left'>Category</TableCell>
                    <TableCell align='center' style={{width: '100px'}}>
                      Taxes (%)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categoryList?.map((row, i) => (
                    <TableRow
                      key={i + 'row'}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell align='center'>
                        <Checkbox
                          checked={checkVal?.includes(row.id)}
                          id={'child-check' + i}
                          key={'child-check' + i}
                          onChange={(e) => {
                            if (checkVal?.includes(row.id)) {
                              let arr = checkVal;
                              checkVal.splice(checkVal.indexOf(row.id), 1);
                              setCheckVal([...arr]);
                            } else {
                              setCheckVal([...checkVal, row.id]);
                            }
                          }}
                          color='primary'
                        />
                      </TableCell>
                      <TableCell align='left'>{row.taxTypeName}</TableCell>
                      <TableCell align='center'>
                        <TextField
                          size='small'
                          value={inputVal[row.id]}
                          disabled={!checkVal?.includes(row.id)}
                          onInput={(e) => {
                            if (
                              _.isNaN(Number(e.target.value)) ||
                              Number(e.target.value) > 999
                            ) {
                              setInputVal({
                                ...inputVal,
                                [row.id]: inputVal[row.id] || '',
                              });
                            } else {
                              setInputVal({
                                ...inputVal,
                                [row.id]: e.target.value,
                              });
                            }
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div
              style={{width: '100%', textAlign: 'center', marginTop: '15px'}}
            >
              <Button
                variant='contained'
                disabled={!stateVal}
                onClick={() => {
                  let temTaxes = [];
                  categoryList?.map((el, ind) => {
                    if (checkVal?.includes(el.id)) {
                      temTaxes.push({
                        id: el.id,
                        taxAbleAmount: inputVal[el.id] || 0,
                        isApplicable: 'Yes',
                      });
                    } else {
                      temTaxes.push({
                        id: el.id,
                        taxAbleAmount: 0,
                        isApplicable: 'No',
                      });
                    }
                  });
                  let postData = {
                    vendorId: user?.userList?.profileId,
                    state: stateVal?.value,
                    tax: temTaxes,
                  };
                  if (id == 'CREATE') {
                    axios
                      .post(
                        Api.baseUri + '/user-reg/tax-Applicable/save-Apptax',
                        postData,
                      )
                      .then((res) => {
                        if (res?.data?.status == 200) {
                          toast.success(
                            res?.data?.message || 'Tax added successfully.',
                          );
                          setSelectedData(null);
                        } else {
                          toast.error(
                            res?.data?.message || 'Something went wrong.',
                          );
                        }
                      })
                      .catch((er) => {
                        toast.error('Something went wrong.');
                      });
                  } else {
                    axios
                      .put(
                        Api.baseUri + '/user-reg/tax-Applicable/update-Apptax',
                        {...postData, id: id},
                      )
                      .then((res) => {
                        if (res?.data?.status == 200) {
                          toast.success(
                            res?.data?.message || 'Tax updated successfully.',
                          );
                          setSelectedData(null);
                        } else {
                          toast.error(
                            res?.data?.message || 'Something went wrong.',
                          );
                        }
                      })
                      .catch((er) => {
                        toast.error('Something went wrong.');
                      });
                  }
                }}
              >
                {id == 'CREATE' ? 'Submit' : 'Update'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialTax;
