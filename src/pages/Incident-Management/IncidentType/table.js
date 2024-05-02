import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import {Box, Button, Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import axios from 'axios';
import Api from '@api';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import CreateTypeForm from './create-for-etravelmate';
import EditIcon from '@mui/icons-material/Edit';
import EditForm from './editType';
import {useAuthUser} from '@crema/utility/AuthHooks';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SmartForm from '@smart-form';
import {toast} from 'react-toastify';
import AppLoader from '@crema/core/AppLoader';
const IncidentTypeTable = () => {
  const [data, setData] = useState();
  const [id, setId] = useState();
  const [openform, setOpenForm] = useState(false);
  const [openDialog, setopenDialog] = useState(false);
  const {user} = useAuthUser();
  const [accessBox, setAccessBox] = useState(false);
  const [employee, setEmployee] = useState();
  const [showbtn, setshowbtn] = useState(true);
  const [detail, setDetail] = useState();
  const [info, setInfo] = useState();
  const [tem_workflows, setTem_workflows] = useState();
  function popBTNClick(val) {
    getAll();
    if (!val) {
      setopenDialog(false);
    }
  }
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/employee-reg/corporate?page=0&size=2000&emailId=null&employeeCode=null&mobileNo=null',
      )
      .then((res) => {
        //
        let temp = [];
        res?.data?.data?.body?.EmployeeList?.map((el) => {
          temp.push({
            title: el?.employeeFullName,
            value: el?.id + '<=====>' + el?.employeeFullName,
          });
        });
        setEmployee(temp ?? []);
      })
      .catch((err) => {
        setEmployee([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/incident/get-incident-type-by-id/' +
          detail?.id,
      )
      .then((res) => {
        res.data.data.tempworkflow = res?.data?.data?.workflow;
        let tem_wf = [];
        res?.data?.data?.workflow?.map((_elem) => {
          tem_wf.push(_elem?.empId + '<=====>' + _elem?.name);
        });
        setTem_workflows(tem_wf || []);
        setInfo(res?.data?.data);
      })
      .catch((err) => {
        setTem_workflows([]);
      });
  }, [detail?.id]);

  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'multiSelect',
            name: 'tempworkflow',
            id: 'tempworkflow',
            title: 'Access To',
            options: employee ?? [],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
        ],
      },
    ],
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Name',
        field: 'name',
      },
      {
        title: 'Code',
        field: 'code',
      },
      // {
      //     title: 'Prirotiy',
      //     field: "priority"
      // },
      // {
      //     title: 'Created by',
      //     field: "createdBy",
      //     type: "date"
      // },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'datetime',
      },
      {
        title: 'Last Updated on',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };

  useEffect(() => {
    getAll();
  }, []);

  function getAll() {
    axios
      .get(Api.baseUri + '/user-reg/incident/get-all-incident-type')
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((e) => {
          e.priority == '1'
            ? (e.priority = 'Low')
            : e.priority == '2'
            ? (e.priority = 'Medium')
            : e.priority == '3'
            ? (e.priority = 'High')
            : (e.priority = null);
          e.tempworkflow = e?.workflow;
          temp.push(e);
        });
        // res.data.data.tempworkflow =res?.data?.data?.workflow;

        setData(temp ?? []);
      })
      .catch((err) => {
        setData([]);
      });
  }

  function handleClickEdit(rowData) {
    setId(rowData.id);
    setopenDialog(true);
  }

  function handleAccess(rowData) {
    setAccessBox(true);
    setDetail(rowData);
  }

  function handleSubmit(value) {
    setshowbtn(false);

    let postData = detail;
    let temparray = value.data.tempworkflow;
    let arr = [];
    for (let i = 0; i < temparray.length; i++) {
      arr.concat(
        arr.push({
          empId: temparray[i].split('<=====>')[0],
          level: Number(i + 1),
          name: temparray[i].split('<=====>')[1],
        }),
      );
    }

    postData.workflow = arr;
    postData.corporateId = user?.userList?.corporateId;

    axios
      .put(Api.baseUri + '/user-reg/incident/update-incident-type', postData)
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Access Granted');
          setAccessBox(false);
          setshowbtn(true);
        } else {
          setshowbtn(true);
          toast.error('Somethig went wrong');
        }
      })
      .catch((err) => {});
  }

  function getDatabyId() {}
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel
            labelVal='Incident Type List'
            variantVal='h3-underline'
          />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New Incident Type'}>
                <img
                  src='/assets/images/title-icon/add penalty.svg'
                  className='title-icons-mui'
                  onClick={() => {
                    setOpenForm(true);
                  }}
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>

      {openDialog && id && (
        <EditForm openDialog={openDialog} id={id} popBTNClick={popBTNClick} />
      )}

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
        title='Nodal Point List'
        columns={tableTemplate.columns}
        data={data}
        options={{
          search: false,
          showTitle: false,
          selection: false,

          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
          color: 'primary',
        }}
        actions={
          user?.role == 'SUPERADMIN'
            ? [
                {
                  icon: () => <EditIcon color='primary' />,
                  tooltip: 'access to',
                  onClick: (event, rowData) => handleClickEdit(rowData),
                },
              ]
            : [
                {
                  icon: () => <AssignmentTurnedInIcon color='primary' />,
                  tooltip: 'edit',
                  onClick: (event, rowData) => handleAccess(rowData),
                },
              ]
        }
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
        open={openform}
        style={{borderRadius: '4rem'}}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Incident Type Form</h1>
              <CloseIcon
                onClick={() => {
                  setOpenForm(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              <CreateTypeForm
                close={() => {
                  setOpenForm(false);
                  getAll();
                }}
              />
            </div>
          </DialogContent>
        </div>
      </Dialog>

      <Dialog
        open={accessBox}
        style={{borderRadius: '4rem'}}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                background: '#f5f2f2',
                height: '4rem',
                paddingRight: '1.5rem',
                paddingLeft: '1.5rem',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Incident Acess to</h1>
              <CloseIcon
                onClick={() => {
                  setAccessBox(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={{padding: '2rem', paddingTop: '0rem'}}>
              <>
                {!showbtn ? <AppLoader /> : null}
                {info &&
                  info?.id &&
                  info?.tempworkflow &&
                  tem_workflows &&
                  employee && (
                    <SmartForm
                      template={template}
                      defaultValues={{tempworkflow: tem_workflows}}
                      onSubmit={handleSubmit}
                      buttons={['assign']}
                    />
                  )}
              </>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default IncidentTypeTable;
