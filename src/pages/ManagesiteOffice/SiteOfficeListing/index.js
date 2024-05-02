import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {Navigate, useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {values} from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import {setFilters} from 'redux/actions';
import CorporateForm from '../EditSiteOffceForm/EditForm';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import CorporateCreateForm from '../RegisterSiteoffice/index';
import Delete from '@mui/icons-material/Delete';
import DetailForm from '../DetailSiteOfficepage/DetailPage';
import {style} from '@mui/system';
import CustomLabel from 'pages/common/CustomLabel';
import ExcelContainer from '@excelupload';
import Confirm from '@confirmation-box';
import {DialogTitle, Grid, Box} from '@mui/material';
import AppTooltip from '@crema/core/AppTooltip';
import {useSelector} from 'react-redux';
import moment from 'moment';
const List = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({});
  const {user} = useAuthUser();
  const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(false);
  const [openform, setOpenForm] = useState(false);
  const [detailform, setDetailForm] = useState(false);
  const [dialID, setdialID] = useState();
  const [domain, setDomain] = useState();
  const [id, setId] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const corporateId = user?.userList?.profileId;
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const [pageSize, setPageSize] = useState(10);
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Site Office') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  function popBTNClick(val) {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
    if (!val) {
      setopenDialog(false);
    }
  }
  async function onSubmit(val) {
    setFilters(val.data);
    setTimeout(() => {
      tableRef.current && table.Ref.current();
    }, 0);
  }

  useEffect(() => {
    if (!user?.userList?.corporateId) return;
    axios
      .get(`${api.onBoardCorporate.list}/${user?.userList?.corporateId}`)
      .then((res) => {
        setDomain(res?.data?.data?.domains ?? []);
      })
      .catch((err) => {
        setDomain([]);
      });
  }, [user?.userList?.corporateId]);

  const styleform = {
    parentcontainer: {
      display: 'flex',
      justifyContent: 'space-between',
      background: '#f5f2f2',
      height: '4rem',
      paddingRight: '1.5rem',
      paddingLeft: '1.5rem',
    },
    h1: {
      marginTop: '1.5rem',
    },
    close: {
      marginTop: '1.4rem',
      color: '#4f4f4f',
      fontWeight: 'bold',
    },
    paddingform: {
      padding: '64px 20px 20px 20px',
    },
  };

  const styleView = {
    parentcontainer: {
      display: 'flex',
      justifyContent: 'space-between',
      background: '#f5f2f2',
      height: '4rem',
      paddingRight: '1.5rem',
      paddingLeft: '1.5rem',
      position: 'fixed',
      width: '50%',
      zIndex: '9',
      borderRadius: '5px 5px 0px 0px',
    },

    h1: {
      marginTop: '1.5rem',
    },

    paddingview: {
      padding: '2rem',
      marginTop: '1.5rem',
    },
  };

  const tableTemplate = {
    columns: [
      {
        title: 'Company Code',
        field: 'companyCode',
      },
      // {
      //   title: 'Company Id',
      //   field: "companyId"
      // },
      {
        title: 'Company Name',
        field: 'companyName',
      },

      {
        title: 'Office Address',
        field: 'location.locName',
      },
      // {
      //   title: 'Mobile No.',
      //   field: 'mobileNo',
      // },
      // {
      //   title: 'Email Id',
      //   field: 'emailId',
      // },
      {
        title: 'Created by',
        field: 'createdOn',
        render: (rd) => {
          return (
            rd.createdBy +
            '  ' +
            moment(rd.createdOn).format('DD/MM/YYYY HH:MM')
          );
        },
      },
      {
        title: 'Last Updated',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };

  function handleClickView(rowData) {
    navigate('/onbordCorporate/siteOffice/detailPage/' + rowData.id);
  }

  function handleClickEdit(rowData) {
    // navigate('/onbordCorporate/siteOffice/edit-form/' + rowData.id);
    setopenDialog(true);
    setdialID(rowData?.id);
  }

  function handleClickDelete(rowData) {
    setId(rowData?.id);
    handleConfirmBox();
  }
  const handleDialogForm = () => {
    setOpenForm(true);
  };
  const handleDialogDetailForm = (rowData) => {
    setdialID(rowData?.id);
    setDetailForm(true);
  };

  const handleCloseDetailForm = () => {
    setDetailForm(false);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };
  const handleClosedialog = () => {
    setDetailForm(false);
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      axios
        .post(`${api.siteOffice.list}/deactivatesiteoffice/${id}`)
        .then((response) => {
          if (response?.data?.status == '200') {
            setTimeout(() => {
              tableRef.current && tableRef.current.onQueryChange();
            }, 0);
            setOpenConfirmBox(false);
            navigate(`/onbordCorporate/siteOffice/siteoffice-listing`);
          }
        })
        .catch((err) => {});
    }

    if (dd == 'NO') {
      setOpenConfirmBox(false);
    }
  };
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Site Offices' variantVal='h3-underline' />
        </Grid>
        {/* <Grid item xs={4} >
          <Box display="flex" justifyContent="flex-end">
            <div className='left-seperator'>
              <AppTooltip placement={'top'}
                title={'Add New Site Office'}>
                <img src='/assets/images/title-icon/add-site-office.svg' className='title-icons-mui' onClick={handleDialogForm} />
              </AppTooltip>
            </div>
            <ExcelContainer
              downloadFile={"Site office"}
              downloadURL={"/user-reg/siteoffice-reg/download"}
              getHeadersUrl={'/user-reg/siteoffice-reg/headerdata'}
              downloadTempURL={'/user-reg/siteoffice-reg/download-template'}
              uploadURL={"/user-reg/siteoffice-reg/import-excel"} />
          </Box>
        </Grid> */}
      </Grid>

      {openDialog && dialID && (
        <CorporateForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
          domain={domain}
        />
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
        title='Onboard Tenants List'
        columns={tableTemplate.columns}
        tableRef={tableRef}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = `${api.siteOffice.list}/corporate?page=0&size=100&officeName=null`,
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
                  data: result?.data?.data?.body?.['SiteOffice List'] ?? [],
                  page: result?.data?.data?.body?.currentPage ?? 0,
                  totalCount: result?.data?.data?.body?.totalItems ?? 0,
                });
              })
              .catch((err) => {
                resolve({
                  data: [],
                  page: 0,
                  totalCount: 0,
                });
              });
          })
        }
        options={{
          search: false,
          showTitle: false,
          selection: false,

          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
          pageSize: pageSize,
          pageSizeOptions: [10, 25, 50],
        }}
        onChangeRowsPerPage={(pageSize) => {
          setPageSize(pageSize);
        }}
        actions={[
          myActions?.includes('Edit') && {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'Edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
          },

          {
            icon: () => <VisibilityIcon color='primary' />,
            tooltip: 'view',
            onClick: (event, rowData) => handleDialogDetailForm(rowData),
          },
          myActions?.includes('deactivate') && {
            icon: () => <Delete color='primary' style={{color: '#bc0805'}} />,
            tooltip: 'Deactivate',
            onClick: (event, rowData) => handleClickDelete(rowData),
          },
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
      <Dialog onClose={handleClose} open={openform}>
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Site office Form</h1>
          <CloseIcon
            onClick={handleClose}
            style={{
              position: 'absolute',
              right: '12px',
              top: '14px',
              cursor: 'pointer',
            }}
          />
        </DialogTitle>
        <DialogContent style={{paddingTop: '10px', position: 'relative'}}>
          <CorporateCreateForm close={handleCloseForm} domain={domain} />
        </DialogContent>
      </Dialog>
      <Dialog
        onClose={handleCloseDetailForm}
        open={detailform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '50%',
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
                position: 'fixed',
                width: '50%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={styleView.h1}> Site Details</h1>
              <CloseIcon
                onClick={handleCloseDetailForm}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={styleView.paddingview}>
              <DetailForm close={handleClosedialog} id={dialID} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Siteoffice?'}
        handleClose={closeConfirmBox}
      />
    </>
  );
};
export default List;
