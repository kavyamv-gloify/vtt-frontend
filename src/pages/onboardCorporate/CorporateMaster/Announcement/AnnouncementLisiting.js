import React, {useEffect, useRef, useState} from 'react';
import SmartTable from '@smart-table';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import _ from 'lodash';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import {Delete} from '@mui/icons-material';
import {getFormData} from '@hoc';
import EditAnnouncement from './EditAnnouncement';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
import AppTooltip from '@crema/core/AppTooltip';
import {Box, Grid, useRadioGroup} from '@mui/material';
import NewAnnouncement from './NewAnnouncement';
import AttachmentIcon from '@mui/icons-material/Attachment';
import downDoc from '@common/fileDownload';
import parse from 'html-react-parser';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Details from './AnnouncementDetail';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';
import QuickSearchPage from '@quick-search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SmartFilter from '@smart-filter';

const fieldList = [
  {title: 'Title', value: 'title'},
  {title: 'Category', value: 'announcemnetType'},
  {title: 'Status', value: 'status'},
];
const AnnouncementLisiting = () => {
  const {user} = useAuthUser();
  const navigate = useNavigate();
  const [announcementList, setAnnouncementList] = useState([]);
  const [openDialog, setopenDialog] = useState(false);
  const [openform, setOpenForm] = useState(false);
  const [copyDialog, setCopyDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [selectedData, setSelectedData] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState();
  const [status, setStatus] = useState();
  const [handleView, sethandleView] = useState(false);
  const [viewInfo, setViewInfo] = useState();
  const [parseData, setParseData] = useState();
  const [myActions, setMyActions] = useState([]);
  const permissionCheck = useSelector(({settings}) => settings.permissions);
  const tableRef = useRef();
  const [filter, setFilter] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [filterRes, setFilterRes] = useState(null);
  const [filterShow, setfilterShow] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  console.log('filterRes', filterRes);
  useEffect(() => {
    getFilterData();
  }, [filter]);
  const getFilterData = () => {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  };
  const handleClosefilter = (d) => {
    setOpenFilter(false);
  };
  useEffect(() => {
    if (!permissionCheck) return;
    let sub_mod = {};
    permissionCheck?.map((el) => {
      if (el.subModuleName == 'Announcement') sub_mod = el;
    });
    setMyActions(sub_mod?.actions);
    if (
      (!sub_mod || !sub_mod?.actions?.includes('View')) &&
      user?.userList?.userRole !== 'SUPERADMIN'
    )
      navigate('/error-pages/error-404');
  }, [permissionCheck, user]);
  function popBTNClick(val) {
    getAllAnnouncement();
    if (!val) {
      setopenDialog(false);
    }
  }
  function getAllAnnouncement() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/announcement/getbycorpoarteid/' +
          user?.userList?.corporateId,
      )
      .then((res) => {
        let sortedProducts = res?.data?.data?.sort((p1, p2) =>
          new Date(p1.createdOn) < new Date(p2.createdOn)
            ? 1
            : new Date(p1.createdOn) > new Date(p2.createdOn)
            ? -1
            : 0,
        );
        let tem = [];
        sortedProducts?.map((el) => {
          let t = el;
          t.startTime = Date.parse(t.startDate + ' ' + t.startTime);
          t.endTime = Date.parse(t.endDate + ' ' + t.endTime);
          tem.push(t);
        });
        setAnnouncementList(tem);
      })
      .catch((err) => {
        setAnnouncementList([]);
      });
  }
  useEffect(() => {
    getAllAnnouncement();
  }, []);

  const closeConfirmBox = (dd) => {
    if (dd == 'YES') {
      let tem = {
        id: selectedData?._id,
        date: selectedData?.date,
        title: selectedData?.title,
        summary: selectedData?.summary,
        image: selectedData?.image,
      };
      let dataSet = {};
      let allElem = {};
      // debugger
      Object.keys(tem).map((key) => {
        if (typeof tem[key]?.[0]?.name == 'string') {
          dataSet = {
            ...dataSet,
            [key]: tem[key][0],
          };
        } else {
          allElem = {
            ...allElem,
            [key]: tem[key],
          };
        }
      });
      dataSet = {
        ...dataSet,
        data: JSON.stringify(allElem),
      };
      console.log('dataSet', dataSet);
      axios({
        method: 'put',
        url: Api.announcement.update,
        data: getFormData(dataSet),
        headers: {'Content-Type': 'multipart/form-data'},
      })
        .then(function (response) {
          setOpenConfirmBox(false);
          if (response?.data?.status == '200') {
            toast.success('Announcement deactivated');
            getAllAnnouncement();
          }
        })
        .catch((err) => {
          setOpenConfirmBox(false);
          getAllAnnouncement();
        });
    } else {
      setOpenConfirmBox(false);
    }
  };
  const tableTemplate = {
    columns: [
      {
        title: 'Title',
        field: 'title',
      },
      {
        title: 'Category',
        field: 'announcemnetType',
      },
      {
        title: 'Start Time',
        field: 'startTime',
        type: 'datetime',
      },
      {
        title: 'End Time',
        field: 'endTime',
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
      {
        title: 'Created by',
        field: 'createdBy',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'datetime',
      },
      {
        title: 'Updated on',
        field: 'updatedOn',
        type: 'datetime',
      },
    ],
  };

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?._id);
  }

  const handleClickdelete = (rowData) => {
    setSelectedData(rowData);
    handleConfirmBox();
    setStatus(rowData);
  };
  const handleDialogForm = () => {
    setOpenForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    getAllAnnouncement();
  };
  const handleEditForm = () => {
    setopenDialog(false);
    getAllAnnouncement();
  };

  const handleConfirmBox = () => {
    setOpenConfirmBox(true);
  };

  const handleClickView = (rowData) => {
    setViewInfo(rowData);
    setParseData(rowData?.pushNotificationMessage);
    sethandleView(true);
  };

  const handleClickCopy = (rowData) => {
    setCopyDialog(true);
    setdialID(rowData?._id);
  };

  const handleCopy = () => {
    setCopyDialog(false);
    getAllAnnouncement();
  };
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={3} md={4}>
          <CustomLabel labelVal='Announcements' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} sm={3} md={4}>
          <QuickSearchPage
            masterKey='title'
            module={'Announcement'}
            searchClicked={true}
            searchUrl={'/employee-reg/filter'}
            // masterFields={['empCode', 'emailId', 'firstName']}
            displayFields={['title', 'status']}
            filterRes={filterRes}
            getFilterData={getFilterData}
            setFilterRes={setFilterRes}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className=''>
              <AppTooltip placement={'top'} title={'Add Filter'}>
                <FilterAltOutlinedIcon
                  className='title-icons-mui'
                  style={{color: _.isEmpty(filter) ? '' : '#ff9800'}}
                  onClick={() => {
                    setfilterShow(true);
                    setOpenFilter(true);
                  }}
                />
              </AppTooltip>
              <AppTooltip placement={'top'} title={'Clear Filter'}>
                <img
                  src='/assets/images/clear-filter.png'
                  onClick={() => {
                    setfilterShow(false);
                    setFilter({});
                    handleClosefilter({button: 'clear'});
                  }}
                  className='title-icons-mui'
                />
              </AppTooltip>
              {myActions?.includes('Create') && (
                <AppTooltip placement={'top'} title={'Add New Announcement'}>
                  <img
                    src='/assets/images/title-icon/add announcement.svg'
                    className='title-icons-mui'
                    onClick={handleDialogForm}
                  />
                </AppTooltip>
              )}
            </div>
          </Box>
        </Grid>
      </Grid>
      {!filterRes ? (
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
          tableRef={tableRef}
          // data={announcementList ?? []}
          data={(query) =>
            new Promise((resolve, reject) => {
              let url_ = Api.baseUri + '/api/dashboard/employee/filter',
                body =
                  !filter || _.isEmpty(filter)
                    ? {
                        collection: 'Announcement',
                        pageSize: query.pageSize,
                        pageNo: query.page + 1,
                      }
                    : {
                        collection: 'Announcement',
                        filterType: 'filter',
                        filters: filter,
                        pageSize: query.pageSize,
                        pageNo: query.page + 1,
                      };
              if (!_.isEmpty(filter)) {
                body = {
                  ...body,
                  ...filter,
                };
              }
              axios
                .post(url_, body)
                .then((result) => {
                  resolve({
                    data: result?.data?.data ?? [],
                    page: (result?.data?.currentPage || 0) - 1,
                    totalCount: result?.data?.totalItems ?? 0,
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
            color: 'primary',
            pageSize: pageSize,
            pageSizeOptions: [10, 25, 50],
          }}
          onChangeRowsPerPage={(pageSize) => {
            setPageSize(pageSize);
          }}
          actions={[
            {
              icon: () => <VisibilityIcon color='primary' />,
              tooltip: 'view',
              onClick: (event, rowData) => handleClickView(rowData),
            },

            myActions.includes('Copy') && {
              icon: () => <ContentCopyIcon color='primary' />,
              tooltip: 'copy',
              onClick: (event, rowData) => handleClickCopy(rowData),
            },
            (rd) =>
              myActions?.includes('Edit') && {
                icon: () => (
                  <EditIcon
                    color='primary'
                    style={{opacity: rd?.status == 'EXPIRED' ? '0.4' : ''}}
                  />
                ),
                tooltip: 'Edit',
                onClick: (event, rowData) => {
                  if (rowData?.status == 'EXPIRED') {
                    return;
                  }
                  handleClickEdit(rowData);
                },
              },

            myActions?.includes('Deactivate') && {
              icon: () => <Delete color='primary' style={{color: '#bc0805'}} />,
              tooltip: 'Deactivate',
              onClick: (event, rowData) => handleClickdelete(rowData),
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
      ) : (
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
          tableRef={tableRef}
          data={filterRes ?? []}
          options={{
            search: false,
            showTitle: false,
            selection: false,
            sorting: true,
            actionsColumnIndex: -1,
            headerStyle: {position: 'sticky', top: 0},
            color: 'primary',
          }}
          actions={[
            {
              icon: () => <VisibilityIcon color='primary' />,
              tooltip: 'view',
              onClick: (event, rowData) => handleClickView(rowData),
            },

            myActions.includes('Copy') && {
              icon: () => <ContentCopyIcon color='primary' />,
              tooltip: 'copy',
              onClick: (event, rowData) => handleClickCopy(rowData),
            },
            (rd) =>
              myActions?.includes('Edit') && {
                icon: () => (
                  <EditIcon
                    color='primary'
                    style={{opacity: rd?.status == 'EXPIRED' ? '0.4' : ''}}
                  />
                ),
                tooltip: 'Edit',
                onClick: (event, rowData) => {
                  if (rowData?.status == 'EXPIRED') {
                    return;
                  }
                  handleClickEdit(rowData);
                },
              },

            myActions?.includes('Deactivate') && {
              icon: () => <Delete color='primary' style={{color: '#bc0805'}} />,
              tooltip: 'Deactivate',
              onClick: (event, rowData) => handleClickdelete(rowData),
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
      )}
      <Dialog
        onClose={handleClose}
        open={openform}
        PaperProps={{
          sx: {
            width: '700px',
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
          <h1>Announcement</h1>
          <CloseIcon
            onClick={handleClose}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '30px', paddingTop: '20px'}}>
          <NewAnnouncement close={handleCloseForm} />
        </DialogContent>
      </Dialog>

      <Dialog
        onClose={handleClose}
        open={openDialog}
        PaperProps={{
          sx: {
            width: '800px',
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
          <h1>Update Announcement</h1>
          <CloseIcon
            onClick={() => {
              setopenDialog(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '30px', paddingTop: '20px'}}>
          <EditAnnouncement id={dialID} close={handleEditForm} copy={'edit'} />
        </DialogContent>
      </Dialog>

      <Dialog
        onClose={() => {
          setCopyDialog(false);
        }}
        open={copyDialog}
        PaperProps={{
          sx: {
            width: '800px',
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
          <h1>Copy Announcement</h1>
          <CloseIcon
            onClick={() => {
              setCopyDialog(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '30px', paddingTop: '20px'}}>
          <EditAnnouncement
            id={dialID}
            copy={'copy'}
            closeDetail={handleCopy}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        onClose={() => {
          sethandleView(false);
        }}
        open={handleView}
        PaperProps={{
          sx: {
            width: '1200px',
          },
        }}
        maxWidth='false'
      >
        <DialogTitle style={{background: '#f4f2f2'}}>
          <h1>{viewInfo?.title}</h1>
          <CloseIcon
            onClick={() => {
              sethandleView(false);
            }}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              color: '#4f4f4f',
              fontWeight: 'bold',
            }}
          />
        </DialogTitle>

        <DialogContent style={{padding: '15px'}}>
          <Details info={viewInfo} doc={parseData} />
        </DialogContent>
      </Dialog>

      {openConfirmbox ? (
        <Confirm
          open={openConfirmbox}
          header={'Confirm to Deactivate'}
          cnfMsg={'Are you sure, You want to deactivate the announcement?'}
          handleClose={closeConfirmBox}
        />
      ) : null}
      {filterShow && (
        <SmartFilter
          open={openFilter}
          title={'Announcements Filter'}
          handleClose={handleClosefilter}
          filter={filter}
          fieldList={fieldList}
          setFilter={setFilter}
        />
      )}
    </>
  );
};
export default AnnouncementLisiting;
