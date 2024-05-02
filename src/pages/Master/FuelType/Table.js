import React, {useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import SmartForm from '@smart-form';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CreateForm from './CreateForm';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';

const List = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const [userStatus, setuserStatus] = useState('Active');
  const [openform, setOpenForm] = useState(false);

  const tableTemplate = {
    columns: [
      {
        title: 'Name',
        field: 'name',
      },
      {
        title: 'description',
        field: 'description',
      },
      {
        title: 'Status',
        field: 'status',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
      },
    ],
  };

  function handleClickView(rowData) {
    navigate('/Master/fuelType/detailpage/' + rowData.id);
  }
  function handleClickEdit(rowData) {
    navigate('/Master/fuelType/editpage/' + rowData.id);
  }

  function handleForm() {
    setOpenForm(true);
  }

  function handleClose() {
    setOpenForm(false);
  }

  function handleCloseform() {
    setOpenForm(false);
  }

  return (
    <>
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
          style={{margin: '8px'}}
          onClick={handleForm}
        >
          Add FuelType
        </Button>
        <Button
          id='btnMui123'
          variant='contained'
          style={{
            marginRight: '8px',
            height: '2.5rem',
            width: '8rem',
            marginTop: '6px',
          }}
          onClick={() => setuserStatus('Active')}
        >
          Active
        </Button>

        <Button
          id='btnMui123'
          variant='contained'
          style={{
            marginRight: '8px',
            height: '2.5rem',
            width: '8rem',
            marginTop: '6px',
          }}
          onClick={() => setuserStatus('Inactive')}
        >
          Inactive
        </Button>
      </div>

      {userStatus == 'Active' ? (
        <>
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
            data={(query) =>
              new Promise((resolve, reject, values) => {
                let url = api.masterFueltype.list + `/Active`,
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
                axios.get(url, body).then((result) => {
                  resolve({
                    data:
                      result?.data && result?.data?.data
                        ? result?.data?.data
                        : [],
                    page:
                      result.data && result.data.currentPage
                        ? result.data.currentPage
                        : 0,
                    totalCount:
                      result.data && result.data.totalItems
                        ? result.data.totalItems
                        : 0,
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
                tooltip: 'edit',
                onClick: (event, rowData) => handleClickEdit(rowData),
              },
              {
                icon: () => <VisibilityIcon color='primary' />,
                tooltip: 'view',
                onClick: (event, rowData) => handleClickView(rowData),
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
      ) : userStatus == 'Inactive' ? (
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
          data={(query) =>
            new Promise((resolve, reject, values) => {
              let url = api.masterFueltype.list + `/Inactive`,
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
              axios.get(url, body).then((result) => {
                resolve({
                  data:
                    result?.data && result?.data?.data
                      ? result?.data?.data
                      : [],
                  page:
                    result.data && result.data.currentPage
                      ? result.data.currentPage
                      : 0,
                  totalCount:
                    result.data && result.data.totalItems
                      ? result.data.totalItems
                      : 0,
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
              tooltip: 'edit',
              onClick: (event, rowData) => handleClickEdit(rowData),
            },
            {
              icon: () => <VisibilityIcon color='primary' />,
              tooltip: 'view',
              onClick: (event, rowData) => handleClickView(rowData),
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
        <div> No Records Found </div>
      )}

      <Dialog
        onClose={handleClose}
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '80%',
          },
        }}
        style={{borderRadius: '4rem'}}
        // aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
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
                width: '80%',
                zIndex: '9',
                borderRadius: '5px 5px 0px 0px',
              }}
            >
              <h1 style={{marginTop: '1.5rem'}}>Add FuelType</h1>
              <CloseIcon
                onClick={handleClose}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>

            <div style={{padding: '1rem', marginTop: '60px'}}>
              <CreateForm close={handleCloseform} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default List;
