import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import AppTooltip from '@crema/core/AppTooltip';
import SmartForm from '@smart-form';
import _, {values} from 'lodash';
import CustomLabel from 'pages/common/CustomLabel';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Api from '@api';
import {Box, Dialog, DialogContent, DialogTitle, Grid} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import regex from '@regex';
import RestoreIcon from '@mui/icons-material/Restore';
import {toast} from 'react-toastify';
import Confirm from '@confirmation-box';
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
          type: 'text',
          name: 'taxTypeName',
          id: 'taxTypeName',
          title: 'Tax Category',
          pattern: {
            value: regex.maxSize50,
            message: 'Please enter valid category.',
          },
          validationProps: {
            required: 'This is a mandatory field',
          },
        },
      ],
    },
  ],
};
const Taxes = () => {
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [data, setData] = useState([]);
  const [selData, setSelData] = useState({});
  const [open, setOpen] = useState(false);
  const [showBtn, setShowBtn] = useState(true);
  const [dialType, setDialType] = useState();
  //   const tableRef = React.useRef();
  function closeDial() {
    setOpen(false);
    setDialType('');
    setSelData({});
  }
  useEffect(() => {
    getallData();
  }, []);
  function getallData() {
    axios
      .get(Api.baseUri + '/user-reg/TaxType-Service/getAll')
      .then((res) => {
        let sortedProducts = (res?.data?.data || []).sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        setData(sortedProducts || []);
      })
      .catch((err) => {
        setData([]);
      });
  }
  function closeConfirmBox(d) {
    if (d == 'YES') {
      axios
        .put(Api.baseUri + '/user-reg/TaxType-Service/update-taxtype', selData)
        .then((res) => {
          closeDial();
          getallData();
          if (res?.data?.status == '200') {
            toast.success(
              res.data?.message || 'Category deactivated successfully.',
            );
          } else {
            toast.error(res.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
        });
    } else {
      closeDial();
    }
  }
  const tableTemplate = {
    columns: [
      {
        title: 'Tax Category',
        field: 'taxTypeName',
      },
      {
        title: 'Status',
        field: 'status',
        render: (rowData) =>
        rowData.status == 'ACTIVE' ? (
          <span style={{color: 'green'}}>ACTIVE</span>
        ) : rowData.status == 'INACTIVE' ? (
          <span style={{color: 'red'}}>INACTIVE</span>
        ) : (
          rowData.status
        ),
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'datetime',
      },
      {
        title: 'Created By',
        field: 'createdBy',
      },
      {
        title: 'Updated On',
        field: 'updatedOn',
        type: 'date',
      },
    ],
  };
console.log("tableTemplate",tableTemplate)
  function handleClickDel(rd) {
    if (rd.status == 'INACTIVE') {
      setDialType('deleteIcon')
      setSelData({
        createdBy: rd?.createdBy,
        createdOn: rd?.createdOn,
        id: rd?.id,
        status: 'ACTIVE',
        taxTypeName: rd?.taxTypeName,
        updatedBy: rd?.updatedBy,
        updatedOn: rd?.updatedOn,
      })
    } else{
    setDialType('Delete')
    setSelData({
      createdBy: rd?.createdBy,
      createdOn: rd?.createdOn,
      id: rd?.id,
      status: 'INACTIVE',
      taxTypeName: rd?.taxTypeName,
      updatedBy: rd?.updatedBy,
      updatedOn: rd?.updatedOn,
    })
     }
  }
  function handleClickEdit(rd) {
    if (rd.status == 'INACTIVE') return;
    setDialType('Edit');
    setOpen(true);
    setSelData({
      createdBy: rd?.createdBy,
      createdOn: rd?.createdOn,
      id: rd?.id,
      status: rd?.status,
      taxTypeName: rd?.taxTypeName,
      updatedBy: rd?.updatedBy,
      updatedOn: rd?.updatedOn,
    });
  }

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} sm={3} md={3} sx={{mb: 2}}>
          <CustomLabel
            labelVal="Tax Categorys' List"
            variantVal='h3-underline'
          />
        </Grid>
        <Grid item xs={12} sm={9} md={9} sx={{paddingTop: '0px !important'}}>
          <Box display='flex' justifyContent='flex-end' alignItems='center'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New Tax Category'}>
                <img
                  src='/assets/images/title-icon/add-vendor.svg'
                  className='title-icons-mui'
                  onClick={() => {
                    setOpen(true);
                    setDialType('Create');
                  }}
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
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
        title='Bank Detail'
        columns={tableTemplate.columns}
        data={data || []}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (rd) => ({
            icon: () => (
              <EditIcon
                color='primary'
                sx={{opacity: rd.status == 'INACTIVE' ? '0.5' : ''}}
              />
            ),
            tooltip: 'Edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
          }),
          (rd) => ({
            icon: () => (
              <DeleteIcon
                sx={{
                  color: '#bc0805',
                  opacity: rd.status == 'INACTIVE' ? '0.5' : '',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) =>{ 
              if (rowData.status == "ACTIVE"){
                handleClickDel(rowData);
              }
            }
          }), 
          (rd) => ({
            icon: () => (
              <RestoreIcon
                color='primary'
                sx={{
                  opacity: rd.status == 'ACTIVE' ? '0.5' : '',
                }}
              />
            ),
            tooltip: 'Reactivate',
            onClick: (event, rowData) => {
              if (rowData.status == "INACTIVE"){
                handleClickDel(rowData);
              }
            },
          }),
        ]}
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

      {open && (
        <Dialog
          onClose={closeDial}
          open={true}
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
              background: '#f4f2f2',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h1>Tax Category</h1>
            <CloseIcon onClick={closeDial} />
          </DialogTitle>
          <DialogContent style={{padding: '20px', paddingTop: 0}}>
            <SmartForm
              template={template}
              defaultValues={selData}
              onSubmit={(val) => {
                setShowBtn(false);
                axios[dialType == 'Create' ? 'post' : 'put'](
                  Api.baseUri +
                    '/user-reg/TaxType-Service/' +
                    (dialType == 'Create' ? 'save-taxtype' : 'update-taxtype'),
                  val.data,
                )
                  .then((res) => {
                    closeDial();
                    getallData();
                    if (res?.data?.status == '200') {
                      toast.success(
                        res.data?.message ||
                          (dialType == 'Create'
                            ? 'Category added successfully.'
                            : 'Category updated successfully.'),
                      );
                    } else {
                      toast.error(res.data?.message || 'Something went wrong.');
                    }
                  })
                  .catch((err) => {
                    toast.error('Something went wrong.');
                  });
              }}
              success={showBtn}
              buttons={[dialType == 'Create' ? 'submit' : 'update']}
            />
          </DialogContent>
        </Dialog>
      )}

      {dialType == 'Delete' ? (
        <Confirm
          open={true}
          header={'Confirm to deactivate'}
          cnfMsg={'Are you sure, You want to deactivate?'}
          handleClose={closeConfirmBox}
        />
      ) : dialType == 'deleteIcon' ?
        <Confirm
          open={true}
          header={'Confirm to reactivate'}
          cnfMsg={'Are you sure, You want to activate?'}
          handleClose={closeConfirmBox}
        /> : ""
      
      }
    </>
  );
};

export default Taxes;
