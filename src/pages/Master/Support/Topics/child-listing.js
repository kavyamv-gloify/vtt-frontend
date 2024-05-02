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
const List = () => {
  const [userStatus, setuserStatus] = useState('Active');
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(false);
  const [dialID, setdialID] = useState();

  function popBTNClick(val) {
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 100);
    if (!val) {
      setopenDialog(false);
    }
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Topic Name',
        field: 'topicName',
      },
      {
        title: 'Topic Details',
        field: 'topicDetails',
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

  function handleClickEdit(rowData) {
    setopenDialog(true);
    setdialID(rowData?.id);
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
          <DialogTitle id='alert-dialog-title' style={{fontSize: '2.5vh'}}>
            {/* {header} */}
            <h2>Support Topics</h2>
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
            <CreateForm id='create' popBTNClick={popBTNClick} />
          </DialogContent>
        </Dialog>
      ) : null}
      {openDialog && dialID != 'create' && (
        <CreateForm
          openDialog={openDialog}
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
          variant='contained'
          style={{marginRight: '10px'}}
          onClick={() => {
            setopenDialog(true);
            setdialID('create');
            // navigate("/Master/support/topics/create")
          }}
          className=''
        >
          Create New Topic
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
            let url = api.support.topicList,
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
                  data: result?.data?.data ? result?.data?.data : [],
                  page: result?.data?.currentPage ? result.data.currentPage : 0,
                  totalCount: result?.data?.totalItems
                    ? result.data.totalItems
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
          {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'Edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
          },
          {
            icon: () => (
              <DeleteIcon color='primary' style={{color: '#bc0805'}} />
            ),
            tooltip: 'Deactivate',
            // onClick: (event, rowData) => handleClickView(rowData)
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
    </>
  );
};

export default List;
