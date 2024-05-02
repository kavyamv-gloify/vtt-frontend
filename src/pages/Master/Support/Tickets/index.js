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
        title: 'Subject',
        field: 'subject',
      },
      {
        title: 'Contact Number',
        field: 'personContactno',
      },
      {
        title: 'Email Id',
        field: 'personEmailId',
      },
      {
        title: 'Created by',
        field: 'createdBy',
        type: 'date',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'date',
      },
      {
        title: 'Last Updated on',
        field: 'updatedOn',
        type: 'date',
      },
      {
        title: 'Status',
        field: 'status',
      },
    ],
  };

  function handleClickEdit(rowData) {
    if (rowData?.status != 'OPEN') {
      return;
    }
    navigate('/user/complaints-tickets-action/' + rowData.id);
  }

  return (
    <>
      <h2 style={{padding: '20px'}}>My Complaints</h2>
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
            let url = api.support.getAllTicket,
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
          (rowData) => ({
            icon: () => (
              <EditIcon
                color='primary'
                style={{
                  opacity: rowData?.status != 'OPEN' && '0.3',
                  color: rowData?.status != 'OPEN' && 'grey',
                }}
              />
            ),
            tooltip: 'edit',
            onClick: (event, row) => handleClickEdit(row),
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
    </>
  );
};

export default List;
