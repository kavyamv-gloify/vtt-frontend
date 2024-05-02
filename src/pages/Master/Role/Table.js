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

const List = () => {
  const [userStatus, setuserStatus] = useState('Active');
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const tableRef = React.useRef();
  //
  async function onSubmit(val) {
    setFilter(val.data);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  }

  const tableTemplate = {
    columns: [
      {
        title: 'Vehicle Type',
        field: 'vehicleType',
      },
      {
        title: 'Vehicle Occupancy',
        field: 'vehicleOccupancy',
      },
      {
        title: 'Status',
        field: 'status',
      },
    ],
  };

  function handleClickView(rowData) {
    navigate('/Master/vehicleType/detailpage/' + rowData.id);
  }
  function handleClickEdit(rowData) {
    navigate('/Master/vehicleType/editpage/' + rowData.id);
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
          style={{marginRight: '10px'}}
          onClick={() => setuserStatus('Active')}
          className=''
        >
          Active
        </Button>

        <Button
          id='btnMui123'
          variant='contained'
          onClick={() => setuserStatus('Inactive')}
          className=''
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
                let url = api.masterVehicletype.list,
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
              let url = api.masterVehicletype.list + `/Inactive`,
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
    </>
  );
};

export default List;
