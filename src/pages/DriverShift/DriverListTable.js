import React, {useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import {Button} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';

const List = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();

  const tenants = user?.userList?.tanentId;
  const tableTemplate = {
    columns: [
      {
        field: 'tenantName',
        title: 'Super Admin Name',
      },
      {
        field: 'shiftName',
        title: 'Shift Name',
      },
      {
        field: 'fromTime',
        title: 'From Time',
      },
      {
        field: 'toTime',
        title: 'To Time',
      },
    ],
  };

  function handleClickView(rowData) {
    navigate('/Master/drivershift/detailForm/' + rowData.id);
  }
  function handleClickEdit(rowData) {
    navigate('/Master/drivershift/editForm/' + rowData.id);
  }

  return (
    <>
      <div
        style={{textAlign: 'right', paddingRight: '0px', backgroundColor: ''}}
      >
        <Button
          id='btnMui123'
          variant='contained'
          style={{margin: '8px'}}
          onClick={(e) => {
            navigate('/Master/drivershiftForm/create');
          }}
        >
          Add DriverShift
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
        title='Onboard Tenants List'
        columns={tableTemplate.columns}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = `${api.drivershift.list}/${tenants}/tenant?page=${query.page}&size=${query.pageSize}`,
              // let url = `${api.drivershift.list}`,
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
            axios.get(url, body).then((result) => {
              resolve({
                data:
                  result?.data && result?.data?.data?.body
                    ? result?.data?.data?.body?.['DriverShift List']
                    : [],
                page:
                  result?.data && result?.data?.data?.body
                    ? result?.data?.data?.body?.currentPage
                    : 0,
                totalCount:
                  result?.data && result?.data?.data?.body
                    ? result?.data?.data?.body?.totalItems
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
  );
};

export default List;
