import React, {useState} from 'react';
import SmartTable from '@smart-table';
import SmartForm from '@smart-form';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _, {values} from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Button from '@mui/material/Button';
import CreateForm from './index';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomLabel from 'pages/common/CustomLabel';
import Confirm from '@confirmation-box';
import {toast} from 'react-toastify';
import RestoreIcon from '@mui/icons-material/Restore';
import AddToPhotosOutlinedIcon from '@mui/icons-material/AddToPhotosOutlined';

const List = () => {
  const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [delId, setDelId] = useState(false);
  const [id, setId] = useState();
  const [openRestore, setOpenRestore] = useState(false);
  function popBTNClick(val) {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
    if (!val) {
      setopenDialog(false);
    }
  }
  function closeRestoreConfirmBox(d) {
    if (d == 'YES') {
      axios
        .post(api.baseUri + `/user-reg/faqcontroller/reactivatefaq/${id}`)
        .then((res) => {
          if (res?.data?.status == 200) {
            toast.success('faq reactivated successfully.');
            setTimeout(() => {
              tableRef.current && tableRef.current.onQueryChange();
            }, 0);
            setOpenRestore(false);
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error(res?.data?.message ?? 'Something went wrong.');
        });
    } else {
      setOpenRestore(false);
    }
  }
  const tableTemplate = {
    columns: [
      {
        title: 'Sub Topic Name',
        field: 'subTopicName',
      },
      {
        title: 'FAQs',
        field: 'question',
      },
      // {
      //     title: "FAQ's Answers",
      //     field: "answer"
      // },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
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

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?.id);
  }

  function closeConfirmBox(d) {
    if (d == 'YES') {
      axios
        .post(api.baseUri + '/user-reg/faqcontroller/deactivatefaq/' + id)
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('FAQ deactivated successfully');
            setDelId(false);
            setTimeout(() => {
              tableRef.current && tableRef.current.onQueryChange();
            }, 0);
          } else {
            toast.error('Something Went Wrong');
          }
        })
        .catch((err) => {});
    } else {
      setDelId(false);
    }
  }

  return (
    <>
      {openDialog && dialID == 'create' ? (
        <Dialog
          open={openDialog}
          // onClose={() => { setopenDialog(false); setdialID(''); }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '700px',
            },
          }}
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{
              background: '#f5f2f2',
              display: 'flex',
              justifyContent: 'space-between',
              position: 'fixed',
              zIndex: '9',
              width: '700px',
            }}
          >
            <h2>FAQs</h2>
            <div style={{position: 'absolute', top: '12px', right: '15px'}}>
              <span>
                <CloseIcon
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                    setopenDialog(false);
                    setdialID('');
                  }}
                />
              </span>
            </div>
          </DialogTitle>
          <DialogContent sx={{marginTop: '50px'}}>
            <CreateForm id='create' popBTNClick={popBTNClick} type={'DRIVER'} />
          </DialogContent>
        </Dialog>
      ) : null}
      {openDialog && dialID != 'create' && (
        <CreateForm
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
          type={'DRIVER'}
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingBottom: '10px',
        }}
      >
        <Button
          id='btnMui123'
          variant='contained'
        >
          {/* Add New FAQ */}
          <div 
          onClick={() => {
          setopenDialog(true);
          setdialID('create');
          }}>
            {/* <AddToPhotosOutlinedIcon
             className='icon'
            /> */}
            <span className="icon-text">Add FAQs</span>
           </div>
        </Button>
      </div>
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
        tableRef={tableRef}
        data={(query) =>
          new Promise((resolve, reject, values) => {
            let url = `${api.support.getAllFAQs}?page=${query.page}&size=${query.pageSize}&subTopicName=null&question=null&answer=null&type=DRIVER`,
              body = {
                pageSize: query.pageSize,
                pageNo: query.page,
              };

            // if (!_.isEmpty(filter)) {
            //   body = {
            //     ...body,
            //     ...filter
            //   }
            // }
            axios
              .get(url, body)
              .then((result) => {
                resolve({
                  data: result?.data?.data?.body?.FaqList
                    ? result?.data?.data?.body?.FaqList
                    : [],
                  page: result?.data?.data?.body?.currentPage
                    ? result?.data?.data?.body?.currentPage
                    : 0,
                  totalCount: result?.data?.data?.body?.totalItems
                    ? result?.data?.data?.body?.totalItems
                    : 0,
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
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (rd) => ({
            icon: () => (
              <RestoreIcon
                color='primary'
                style={{opacity: rd?.status == 'INACTIVE' ? '' : '0.2'}}
              />
            ),
            tooltip: 'Reactive',
            onClick: (event, rowData) => {
              if (rowData?.status == 'ACTIVE') {
                return;
              }
              setOpenRestore(true);
              setId(rowData?.id);
            },
          }),
          (rd) => ({
            icon: () => (
              <EditIcon
                color='primary'
                style={{opacity: rd?.status == 'INACTIVE' ? '0.2' : ''}}
              />
            ),
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              if (rowData?.status == 'INACTIVE') {
                return;
              }
              handleClickEdit(rowData);
            },
          }),
          (rd) => ({
            icon: () => (
              <DeleteIcon
                color='primary'
                style={{
                  opacity: rd?.status == 'INACTIVE' ? '0.2' : '',
                  color: '#bc0805',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              if (rowData?.status == 'INACTIVE') {
                return;
              }
              setId(rowData?.id);
              setDelId(true);
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
      {delId ? (
        <Confirm
          open={delId}
          header={'Confirm to Deactivate'}
          cnfMsg={'Are you sure, You want to deactivate the FAQ?'}
          handleClose={closeConfirmBox}
        />
      ) : null}
      <Confirm
        open={openRestore}
        header={'Confirm to Reactivate'}
        cnfMsg={'Are you sure, You want to reactivate the Sub-topic?'}
        handleClose={closeRestoreConfirmBox}
      />
    </>
  );
};

export default List;
