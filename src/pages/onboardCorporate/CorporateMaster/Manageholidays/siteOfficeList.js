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
import {Button} from '@mui/material';

const List = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const tableTemplate = {
    columns: [
      {
        title: 'Company Code',
        field: 'companyCode',
      },
      {
        title: 'Company Name',
        field: 'companyName',
      },
      {
        title: 'Office Address',
        field: 'officeAddress.addressName',
      },
      {
        title: 'Mobile No.',
        field: 'mobileNo',
      },
      {
        title: 'Email Id',
        field: 'emailId',
      },
    ],
  };

  function handleClickView(rowData) {
    navigate(
      '/onboardCorporate/holiday/holiday-listing/' +
        window.btoa(rowData.id + '<SECRET>' + rowData?.officeName),
    );
  }
  return (
    <>
      {/* <div style={{backgroundColor:"white", padding:"10px"}}><h2>Site Office List</h2></div> */}
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
            let url =
                api.siteOffice.list +
                '/' +
                user?.userList?.profileId +
                '/corporate?page=0&size=100',
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
                data: result?.data?.data?.body['SiteOffice List'] ?? [],
                page: result?.data?.data?.body?.currentPage,
                totalCount: result?.data?.data?.body?.totalItems,
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
            icon: () => (
              <Button
                id='btnMui123'
                variant='contained'
                color='primary'
                size='small'
                fontSize='small'
              >
                Holiday List
              </Button>
            ),
            tooltip: 'Holidays',
            onClick: (event, rowData) => handleClickView(rowData),
          },
          //   {
          //     icon: () => (<VisibilityIcon color="primary" />),
          //     tooltip: 'view',
          //     onClick: (event, rowData) => handleClickView(rowData)
          //   }
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
