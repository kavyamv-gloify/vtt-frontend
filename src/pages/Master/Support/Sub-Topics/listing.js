import React, {useEffect, useState} from 'react';
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
import EditForm from './EditPage';
import CreateForm from './index';
import {Dialog, DialogContent, DialogTitle} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from 'react-toastify';
import Api from '@api';
import Confirm from '@confirmation-box';
import RestoreIcon from '@mui/icons-material/Restore';
const List = ({topicId, status}) => {
  const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();
  const [myData, setMyData] = useState();
  const [openConfirmbox, setOpenConfirmBox] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  useEffect(() => {
    getAllSubTopics();
  }, []);
  function popBTNClick(val) {
    getAllSubTopics();
    if (!val) {
      setopenDialog(false);
    }
  }
  function getAllSubTopics() {
    let url = api.support.getSubtopicbyTopicid + topicId + '/helpid';
    axios
      .get(url)
      .then((res) => {
        setMyData(res?.data?.data ?? []);
      })
      .catch((err) => {
        setMyData([]);
      });
  }

  const tableTemplate = {
    columns: [
      // {
      //     title: 'Topic Name',
      //     field: "helpTopicName"
      // },
      {
        title: 'Sub Topic Name',
        field: 'subTopicName',
      },
      {
        title: 'Sub Topic Details',
        field: 'subTopicDeatails',
      },
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
  function handleClickDelete(rowData) {
    setdialID(rowData?.id);
    setOpenConfirmBox(true);
  }

  function closeRestoreConfirmBox(d) {
    if (d == 'YES') {
      axios
        .post(
          Api.baseUri +
            `/user-reg/subtopiccontroller/Activatesubtopic/${dialID}`,
        )
        .then((res) => {
          if (res?.data?.status == 200) {
            toast.success('Sub-Topic reactivated successfully.');
            getAllSubTopics();
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

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?.id);
  }

  function closeConfirmBox(d) {
    if (d == 'YES') {
      axios
        .post(Api.support?.deleteSubTopic + dialID, {})
        .then((res) => {
          if (res?.data?.status == 200) {
            toast.success('Sub-Topic deactivated successfully.');
            getAllSubTopics();
            setOpenConfirmBox(false);
          } else {
            toast.error(res?.data?.message ?? 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error(res?.data?.message ?? 'Something went wrong.');
        });
    } else {
      setOpenConfirmBox(false);
    }
  }
  return (
    <>
      {openDialog && dialID == 'create' ? (
        <Dialog
          open={openDialog}
          onClose={() => {
            setopenDialog(false);
            setdialID('');
          }}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle
            id='alert-dialog-title'
            style={{fontSize: '2.5vh', background: '#f1f1f1'}}
          >
            {/* {header} */}
            <h2>Sub-Topic</h2>
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
          <DialogContent>
            <CreateForm
              id='create'
              topicId={topicId}
              popBTNClick={popBTNClick}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      {openDialog && dialID != 'create' && (
        <EditForm
          openDialog={openDialog}
          topicId={topicId}
          id={dialID}
          popBTNClick={popBTNClick}
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
          variant='outlined'
          style={{
            marginTop: '10px',
            marginRight: '10px',
            display: status == 'INACTIVE' ? 'none' : '',
          }}
          onClick={() => {
            setopenDialog(true);
            setdialID('create');
          }}
          className=''
        >
          Create New Sub-Topic
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
        // tableRef={tableRef}
        data={myData}
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
              setdialID(rowData?.id);
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
              if (status == 'INACTIVE' || rowData?.status == 'INACTIVE') {
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
        style={{
          borderRadius: 16,
          boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)',
        }}
      />
      <Confirm
        open={openConfirmbox}
        header={'Confirm to Deactivate'}
        cnfMsg={'Are you sure, You want to deactivate the Sub-topic?'}
        handleClose={closeConfirmBox}
      />
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
