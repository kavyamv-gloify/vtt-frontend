import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import Paper from '@mui/material/Paper';
import CancelIcon from '@mui/icons-material/Cancel';
import Confirm from '@confirmation-box';
import {
  Autocomplete,
  Tooltip,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Api from '@api';
import Create from './Add Compliance';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from 'react-toastify';
import {useAuthUser} from '@crema/utility/AuthHooks';
import RestoreIcon from '@mui/icons-material/Restore';
const SubTopicList = ({getChildFunc, childData, complianceList, currComp}) => {
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const [corporate, setCorporate] = useState();
  const [corporateId, setCorporateId] = useState();
  const [openDial, setOpenDial] = useState(false);
  const [openDialAddMore, setOpenDialAddMore] = useState(false);
  const [selData, setselData] = useState({});
  const [showAssignBtn, setShowAssignBtn] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [editId, setEditId] = useState();
  const [msg, setMsg] = useState();
  const [deleteCnf, setDeleteCnf] = useState(false);
  const [restoreCnf, setRestoreCnf] = useState(false);
  const [curData, setCurData] = useState();
  useEffect(() => {
    let temBool = false;
    for (const [key, value] of Object.entries(selData)) {
      if (value === true) temBool = true;
    }
    setShowAssignBtn(temBool);
  }, [selData]);

  function AssignFunc() {
    let tem_obj = {
      complianceGroupName: currComp?.complianceGroupName,
      complianceTopic: [...currComp?.complianceTopic],
      createdBy: currComp?.createdBy,
      createdOn: currComp?.createdOn,
      id: currComp?.id,
      status: currComp?.status,
      updatedBy: currComp?.updatedBy,
      updatedOn: currComp?.updatedOn,
    };
    tem_obj?.complianceTopic?.map((el, ind) => {
      if (selData[ind] == true) {
        if (!el?.applicableCorporate?.includes(corporateId?.value)) {
          if (!el?.applicableCorporate) {
            el.applicableCorporate = [corporateId?.value];
          } else {
            el.applicableCorporate = [
              ...el.applicableCorporate,
              corporateId?.value,
            ];
          }
        }
      }
    });

    axios
      .put(Api.baseUri + '/user-reg/compliance/update-compliance', tem_obj)
      .then((res) => {
        if (res?.data?.status == 200) {
          setOpenDial(false);
          toast.success('Compliance Assigned Successfully.');
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
  }

  function selectClick(cid, mydata) {
    let temp = {};
    mydata?.map((ele, index) => {
      if (mydata?.applicableCorporate?.includes(cid)) {
        if (ele?.applicableCorporate?.includes(cid)) {
          temp[index] = true;
        } else {
          temp[index] = false;
        }
      } else {
        temp[index] = false;
        data?.map((sel_el) => {
          if (sel_el?.id == ele?.id) {
            temp[index] = true;
          }
        });
      }
    });
    setselData({...temp});
  }
  function deleteFun(v) {
    setConfirmDel(false);
    if (v == 'NO') return;
    let putData = currComp;
    putData.status = 'INACTIVE';
    putData.updatedOn = Date.now();
    putData.updatedBy = user?.userList?.userName;
    axios
      .put(Api.baseUri + '/user-reg/compliance/update-compliance', putData)
      .then((res) => {
        if (res?.data?.status == 200) {
          toast.success('Compliance Deactivated Successfully.');
          complianceList();
        } else {
          toast.error(res?.data?.message || 'Something went wrong.');
        }
      })
      .catch((err) => {
        toast.error('Something went wrong.');
      });
  }
  useEffect(() => {
    if (corporateId?.value && data?.applicableCorporate)
      selectClick(corporateId?.value, data);
  }, [data, corporateId]);
  useEffect(() => {
    if (data && corporate?.length && corporate[0]?.value)
      selectClick(corporate[0]?.value, data);
  }, [data, corporate]);
  async function fetchDataParent() {
    const baseURL = Api.baseUri + '/user-reg/corporate-reg?page=0&size=1000';
    let response = await axios.get(`${baseURL}`);
    let temp = [];
    response?.data?.data?.body?.['CorporateList']?.map((el) => {
      temp.push({
        title: el?.companyName + '  ' + '(Email:-' + el?.emailId + ')',
        value: el?.id,
      });
    });
    setCorporate(temp);
    setCorporateId(temp[0]);
  }

  useEffect(() => {
    fetchDataParent();
  }, []);

  useEffect(() => {
    let arr = [];
    childData?.map((el) => {
      el.accessToStr = el.accessTo?.join(', ');
      let temSubtopics = [];
      el?.complianceSubTopicList?.map((elm) => {
        temSubtopics.push(elm?.subTopicName);
      });
      el.complianceType =
        el?.complianceType[0].toUpperCase() +
        el?.complianceType?.slice(1)?.toLowerCase();
      el.subTopicsNameStr = temSubtopics?.join(', ');
      arr.push(el);
    });
    setData(childData);
  }, [childData]);

  const tableTemplate = {
    columns: [
      {
        title: 'Compliance Name',
        field: 'topicNameKey',
      },
      {
        title: 'Compliance Type',
        field: 'complianceType',
      },
      {
        title: 'Access To',
        field: 'accessToStr',
      },
      {
        title: 'Sub Compliances',
        field: 'subTopicsNameStr',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
      },
      {
        title: 'Updated On',
        field: 'updatedOn',
        type: 'date',
      },
    ],
  };

  function handleDelete(rowData) {
    setCurData(rowData);
    let postData = rowData;
    axios
      .post(
        Api.baseUri +
          '/user-reg/compliance-topic/delete-compliance-topic/false',
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setMsg(res?.data?.data);
          setDeleteCnf(true);
        }
      })
      .catch((err) => {});
  }

  // function handleClick ()

  function deleteTopic(d) {
    axios
      .post(
        Api.baseUri +
          '/user-reg/compliance-topic/delete-compliance-topic/' +
          (d == 'YES' ? 'true' : 'false'),
        curData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          setDeleteCnf(false);
          d ==="NO" ? "" : toast.success("Sub-Compliance is successfully Deactivate");
          complianceList();
          getChildFunc();
        } else {
          setDeleteCnf(false);
          toast.error('Something went wrong');
        }
      })
      .catch((err) => {});
  }

  function restoreTopic(d) {
    if (d == 'NO') {
      setRestoreCnf(false);
    } else {
      axios
        .post(
          Api.baseUri +
            '/user-reg/compliance-topic/reActivate-compliance-topic',
          curData,
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            setRestoreCnf(false);
            toast.success("Sub-Compliance is successfully Reactivate.");
            complianceList();
            getChildFunc();
          } else {
            toast.error('Something went wrong');
            setRestoreCnf(false);
          }
        })
        .catch((err) => {});
    }
  }

  return (
    <div style={{border: '1px solid #efefef'}}>
      <SmartTable
        components={{
          Toolbar: (props) => (
            <>
              <div
                style={{
                  height: '0px',
                }}
              ></div>
            </>
          ),
        }}
        title='Onboard Tenants List'
        columns={tableTemplate.columns}
        // tableRef={tableRef}
        data={data ?? []}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
         (rd)=> (
          {
            icon: () =>
            <EditIcon
            sx={{
              color:'#0A8FDC',
              opacity: rd?.isActive == 'false' || currComp?.status === "INACTIVE" ? '0.3' : '',
            }} />,
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              if (rowData?.isActive == 'false' || currComp?.status === "INACTIVE") {
                return;
              }
              setOpenDialAddMore(true);
              setEditId(rowData?.id);
            },
          }
         )
      ,

          (rd) => ({
            icon: () => (
              <DeleteIcon
                sx={{
                  color: '#bc0906',
                  opacity: rd?.isActive == 'false' || currComp?.status === "INACTIVE" ? '0.3' : '',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              if (rowData?.isActive == 'false' || currComp?.status === "INACTIVE") {
                return;
              }
              handleDelete(rowData);
            },
          }),
          (rd) => ({
            icon: () => (
              <RestoreIcon
                color='primary'
                style={{
                  opacity: (rd?.isActive == 'false' || rd?.isActive === "null") && currComp?.status === "ACTIVE" ? '' : '0.3',
                }}
              />
            ),
            tooltip: 'Restore',
            onClick: (event, rowData) => {
              if ((rowData?.isActive == 'false' || rowData?.isActive === "null") && currComp?.status === "ACTIVE") {
                setCurData(rowData);
                setRestoreCnf(true);
              } 
              
            },
          }),
        ]}
        // onSelectionChange={(rows) => {   setSelectedItems(rows); }}
        localization={{
          body: {
            emptyDataSourceMessage: 'No records to display',
            filterRow: {
              filterTooltip: 'Filter',
              filterPlaceHolder: 'Filtaaer',
            },
          },
        }}
        style={{
          borderRadius: 16,
          boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)',
        }}
      />
      <Dialog
        // onClose={handleClose}
        open={openDial}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Assign to Corporate Admin</h1>
          <CloseIcon
            onClick={() => {
              setOpenDial(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', marginTop: '0px'}}>
            <label style={{fontSize: '13px', marginLeft: '4px'}}>
              Corporate name
            </label>
            <div style={{marginTop: '6px'}}>
              {corporate ? (
                <Autocomplete
                  defaultValue={corporate[0]}
                  value={corporateId}
                  onChange={(e, v) => {
                    setCorporateId(v);
                  }} // setDeselect(false); setSelect(false); }}
                  options={corporate || []}
                  getOptionLabel={(option) => option.title}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option.title} {...getTagProps({index})} />
                    ))
                  }
                  style={{width: '450px'}}
                  renderInput={(params) => <TextField {...params} />}
                />
              ) : null}
            </div>
            <TableContainer component={Paper} sx={{marginTop: '20px'}}>
              <Table sx={{minWidth: 50}} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>S.No.</TableCell>
                    <TableCell align='right' sx={{width: '10px'}}>
                      Compliance
                    </TableCell>
                    <TableCell align='right'>Select</TableCell>
                    <TableCell align='right'>Deselect</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((el, index) => (
                    <TableRow
                      key={index}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell component='th' scope='row' sx={{width: '9px'}}>
                        {Number(index) + 1}
                      </TableCell>
                      <TableCell align='left'>{el?.topicName}</TableCell>
                      <TableCell align='right'>
                        <Tooltip title='select'>
                          <IconButton>
                            <CheckCircleIcon
                              sx={{
                                color: 'green',
                                opacity: selData[index] ? '0.3' : '',
                              }}
                              onClick={() => {
                                setselData({...selData, [index]: true});
                                // handleAdd(index)
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell align='right'>
                        <Tooltip title='Deselect'>
                          <IconButton>
                            <CancelIcon
                              sx={{
                                color: '#900d09',
                                opacity: selData[index] ? '' : '0.3',
                              }}
                              onClick={() => {
                                setselData({...selData, [index]: false});
                                // handleRemove(index)
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{margin: 'auto', width: '16%'}}>
              <Button
                id='btnMui123'
                disabled={!corporate?.length || !showAssignBtn}
                onClick={AssignFunc}
                variant='contained'
                sx={{marginTop: '30px'}}
              >
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDialAddMore} style={{borderRadius: '4rem'}}>
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Update Compliance</h1>
          <CloseIcon
            onClick={() => {
              setOpenDialAddMore(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '0px'}}>
          <div style={{padding: '20px', paddingTop: '0', marginTop: '0px'}}>
            <Create
              editId={editId}
              currComp={currComp}
              close={() => {
                setOpenDialAddMore(false);
                complianceList();
                getChildFunc();
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Confirm
        open={confirmDel}
        handleClose={deleteFun}
        cnfMsg={'Are you sure, You want to deactivate the Super Admin?'}
        header={'Confirm to Deactivate'}
      />

      <Confirm
        open={deleteCnf}
        handleClose={deleteTopic}
        cnfMsg={msg}
        header={'Confirm to Deactivate'}
      />
      <Confirm
        open={restoreCnf}
        handleClose={restoreTopic}
        cnfMsg={'Are you sure, Yow want to restore the Topic?'}
        header={'Confirm to Restore'}
      />
    </div>
  );
};

export default SubTopicList;
