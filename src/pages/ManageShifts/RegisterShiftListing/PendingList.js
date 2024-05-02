import React, {useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import SmartForm from '@smart-form';
import {Divider} from '@mui/material';
import {useAuthUser} from '@crema/utility/AuthHooks';

const PendingList = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();
  // const id = user?.userList?.tanentId;
  //

  const tanents = user?.userList?.tanentId;
  const vendorId = user?.userList?.profileId;

  let templateFilter = {
    layout: {column: 1, spacing: 2, size: 'medium', label: 'top', type: 'flex'},
    // title: 'Orders Filter',
    // description: 'Orders Filter',
    sections: [
      {
        layout: {
          column: 6,
          spacing: 2,
          size: 'small',
          label: 'top',
          type: 'flex',
        },
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'firstName',
            title: 'First Name',
            field: 'firstName',
          },
          {
            type: 'text',
            name: 'lastName',
            title: 'Last Name',
            field: 'lastName',
          },

          {
            type: 'text',
            name: 'dlNumber',
            title: 'Driving licence No.',
            field: 'dlNumber',
          },
          {
            type: 'text',
            name: 'EmailId',
            title: 'Email Id',
            field: 'emailId',
          },
          {
            type: 'text',
            name: 'MobileNo',
            title: 'Mobile No.',
            field: 'mobileNo',
          },
        ],
      },
    ],
  };

  const tableTemplate = {
    columns: [
      {
        title: 'First Name',
        field: 'firstName',
      },
      {
        title: 'Last Name',
        field: 'lastName',
      },
      {
        title: 'Address',
        field: 'address.addressName',
      },
      {
        title: 'Years of ex.',
        field: 'expYears',
      },
      {
        title: 'driving licence No.',
        field: 'dlNumber',
      },
      {
        title: 'Email Id',
        field: 'emailId',
      },
      {
        title: 'Mobile No.',
        field: 'mobileNo',
      },
    ],
  };

  function handleClickEdit(rowData) {
    navigate('/onboardadmin/pending-driver/editPage/' + rowData.id);
  }

  return (
    <>
      <SmartForm
        template={templateFilter}
        // onSubmit={onSearch}
        // success={enable}
        buttons={['search']}
        // defaultValues={userRoles.includes('inventory_manager') ? { 'action': 'open' } : userRoles.includes('dispatcher') ? { 'action': 'in-progress' } : { 'action': 'all' }}
      />
      <Divider light className='mb-4' />
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
          // new Promise((resolve, reject) => {
          //   let url = `${api.driver.changeRequest}/${id}/tanent/PENDING/status`,
          //     body = {
          //       pageSize: query.pageSize,
          //       pageNo: query.page
          //     }
          //   if (!_.isEmpty(filter)) {
          //     body = {
          //       ...body,
          //       ...filter
          //     }
          //   }
          //   axios.get(url, body).then(result => {
          //
          //     resolve({
          //       data: (result?.data && result?.data?.data) ? result?.data?.data : [],
          //       page: (result.data && result.data.currentPage) ? result.data.currentPage : 0,
          //       totalCount: (result.data && result.data.totalItems) ? result.data.totalItems : 0,
          //     })
          //   })
          // })}

          new Promise((resolve, reject) => {
            let url =
                user?.role == 'TANENTADMIN'
                  ? `${api.driver.changeRequest}/${tanents}/tanent/PENDING/profile`
                  : `${api.driver.changeRequest}/${vendorId}/vendor/PENDING/profile`,
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
            if (user?.role == 'TANENTADMIN') {
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
            }

            if (user?.role == 'VENDOR') {
              axios.get(url, body).then((result) => {
                resolve({
                  data: result.data?.data ?? [],
                  page: result?.data?.data?.body?.currentPage ?? 0,
                  totalCount: result?.data?.data?.body?.totalItems ?? 0,
                });
              });
            }
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

export default PendingList;
