import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import _ from '@lodash';
import api from '@api';
import axios from 'axios';
import getDocUrl from '@common/makeurl';
import {Box, Button, Grid} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartForm from '@smart-form';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterPop from '@filter-pop';
import CustomLabel from 'pages/common/CustomLabel';
import ExcelContainer from '@excelupload';
import CreateForm from '../CreateForm/index';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import {tr} from 'date-fns/locale';
import EditForm from '../EditPage/index';
import DetailPage from '../DetailPage/index';
import Confirm from '@confirmation-box';
import AppTooltip from '@crema/core/AppTooltip';
import {toast} from 'react-toastify';
import handleCatchError from '@catch';
import CustomTheme from './theme';
import SettingsIcon from '@mui/icons-material/Settings';

const List = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [openform, setOpenForm] = useState(false);
  const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [id, setId] = useState();
  const [openDetail, setOpenDetail] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [pendingCount, setPendingCount] = useState();
  const [openDial, setOpenDial] = useState(false);
  useEffect(() => {
    if (openDial === null) {
      setTimeout(() => {
        tableRef.current && tableRef.current.onQueryChange();
      }, 0);
    }
  }, [openDial]);
  function popBTNClick(val) {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
    if (!val) {
      setopenDialog(false);
    }
  }

  let templateFilter = {
    layout: {
      column: 1,
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
            type: 'text',
            name: 'gstNumber',
            title: 'Company GST Number',
            inputiconurl: '/assets/images/login_icon.png',
            field: 'gstNumber',
          },

          {
            type: 'text',
            name: 'pannumber',
            title: 'Company PAN Number',
            inputiconurl: '/assets/images/login_icon.png',
            field: 'pannumber',
          },
          {
            type: 'text',
            name: 'emailId',
            title: 'Email Id',
            inputiconurl: '/assets/images/login_icon.png',
            field: 'emailId',
          },
          {
            type: 'text',
            name: 'mobileNo',
            title: 'Mobile No.',
            field: 'mobileNo',
            inputiconurl: '/assets/images/login_icon.png',
          },
        ],
      },
    ],
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Name',
        field: 'companyName',
      },

      {
        title: 'Email Id',
        field: 'emailId',
      },
      {
        title: 'Mobile No.',
        field: 'mobileNo',
      },
      {
        title: 'Created by',
        field: 'createdBy',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
        // render: rowData => (

        //   (rowData.status == 'ACTIVE') ? (<span style={{color:"green"}}>ACTIVE</span>) : (rowData.status == 'INACTIVE') ? <span style={{color:"red"}}>INACTIVE</span> : rowData.status
        // )
      },
      {
        title: 'Last Updated On',
        field: 'updatedOn',
        type: 'datetime',
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
    ],
  };

  function handleClickView(rowData) {
    // navigate('/onboardadmin/driver/detailPage/' + rowData.id);
    setId(rowData?.id);
    setOpenDetail(true);
  }

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?.id);
  }

  function handleClickDelete(rowData) {
    setId(rowData?.id);
    handleConfirmBox();
  }

  const handleCloseform = () => {
    setOpenForm(false);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };

  const handleClose = () => {
    setOpenForm(false);
  };

  const handleClosefilter = (d) => {
    setFilter(d.data);
    // if (d == "NO") {
    //   setOpenFilter(false);
    // }
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
    setOpenFilter(false);
  };

  const closeInternalDialog = () => {
    setOpenDetail(false);
  };

  const CloseDetailPage = () => {
    setOpenDetail(false);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .post(`${api.onBoardTenant.list}/deactivatetanent/${id}`)
        .then((response) => {
          if (response?.data?.status == '200') {
            setTimeout(() => {
              tableRef.current && tableRef.current.onQueryChange();
            }, 0);
            setOpenConfirmBox(false);
            navigate(`/superadmin/table`);
          }
        })
        .catch((err) => {});
    }

    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };

  useEffect(() => {
    let temp_url = `${api.onBoardTenant.changeRequest}/PENDING/status`;
    axios
      .get(temp_url)
      .then((res) => {
        if (res?.data?.status == '200') {
          setPendingCount(res?.data?.data?.length);
        }
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={9}>
          <CustomLabel
            labelVal="Super Admins' List"
            variantVal='h3-underline'
          />
        </Grid>
        <Grid item xs={3}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Add New Super Admin'}>
                <img
                  src='/assets/images/title-icon/add-driver.svg'
                  className='title-icons-mui'
                  onClick={(e) => setOpenForm(true)}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Profile Update Request'}>
                <div style={{display: 'flex'}}>
                  <img
                    src='/assets/images/title-icon/profile-change.svg'
                    className='title-icons-mui'
                    onClick={(e) => {
                      navigate('/onbordTenent/pending-list');
                    }}
                  />
                  <p className='pending-count'>{pendingCount}</p>
                </div>
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
      {openDialog && dialID && (
        <EditForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}
      <SmartTable
        components={{
          Toolbar: (props) => (
            <>
              <div
                style={{
                  height: '0px',
                  // marginTop:"30px"
                }}
              ></div>
            </>
          ),
        }}
        title='Onboard Tenants List'
        tableRef={tableRef}
        columns={tableTemplate.columns}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = `${api.onBoardTenant.list}?page=${query.page}&size=${
                query.pageSize
              }&mobileNo=${
                filter?.mobileNo ? filter?.mobileNo : null
              }&emailId=${
                filter?.emailId ? filter?.emailId : null
              }&companyPAN=${
                filter?.pannumber ? filter?.pannumber : null
              }&companyGSTN=${filter?.gstNumber ? filter?.gstNumber : null}`,
              body = {
                pageSize: query.pageSize,
                pageNo: query.page,
              };
            if (!_.isEmpty(filter)) {
              body = {
                ...body,
                ...filter,
              };
            }
            axios
              .get(url, body)
              .then((result) => {
                resolve({
                  data: result?.data?.data?.body['Tanent List'] ?? [],
                  page: result?.data?.data?.body?.currentPage
                    ? result?.data?.data?.body?.currentPage
                    : 0,
                  totalCount: result?.data?.data?.body?.totalItems
                    ? result?.data?.data?.body?.totalItems
                    : 0,
                });
              })
              .catch((err) => {
                handleCatchError.errorAction(err);
                resolve({
                  data: [],
                  page: 0,
                  totalCount: 0,
                });
              });
          })
        }
        options={{
          // search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          sorting: true,
          // grouping: true,
          // search: true,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (data) => ({
            icon: () => (
              <EditIcon
                color='primary'
                style={{opacity: data?.status == 'INACTIVE' ? '0.3' : ''}}
              />
            ),
            tooltip: 'edit',
            onClick: (event, rowData) => {
              if (rowData?.status == 'INACTIVE') {
                return;
              }
              handleClickEdit(rowData);
            },
          }),
          {
            icon: () => <VisibilityIcon color='primary' />,
            tooltip: 'View',
            onClick: (event, rowData) => handleClickView(rowData),
          },
          {
            icon: () => <SettingsIcon color='primary' />,
            tooltip: 'Theme Setting',
            onClick: (event, rowData) => {
              setOpenDial(rowData);
            },
          },
          (rd) => ({
            icon: () => (
              <DeleteIcon
                color='primary'
                style={{
                  color: '#bc0805',
                  opacity: rd?.status == 'INACTIVE' ? '0.3' : '',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              if (rowData?.status == 'INACTIVE') {
                return;
              }
              handleClickDelete(rowData);
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
        // style={{ borderRadius: 16, boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)' }}
      />

      <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '90%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>Register SuperAdmin</h1>
          <CloseIcon
            onClick={handleClose}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '14px',
              right: '14px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent>
          <div style={{padding: '1rem', marginTop: '20px'}}>
            <CreateForm close={handleCloseform} />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        // onClose={CloseDetailPage}
        open={openDetail}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
      >
        <DialogTitle style={{background: '#f5f2f2'}}>
          <h1>SuperAdmin Details</h1>
          <CloseIcon
            onClick={CloseDetailPage}
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '14px',
              right: '14px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>
        <DialogContent>
          <DetailPage id={id} close={closeInternalDialog} />
        </DialogContent>
      </Dialog>
      <FilterPop
        open={openFilter}
        handleClose={handleClosefilter}
        title={'SuperAdmin Filter'}
        template={templateFilter}
        cnfMsg={'cnfMsg'}
        header={'My Header'}
      />
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Super Admin?'}
        handleClose={closeConfirmBox}
      />
      {openDial && (
        <CustomTheme
          setOpenDial={setOpenDial}
          id={openDial?.id}
          themeData={openDial?.theme}
        />
      )}
    </>
  );
};

export default List;
