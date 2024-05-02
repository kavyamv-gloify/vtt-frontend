import React, {useState} from 'react';
import SmartTable from '@smart-table';
import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import Api from '@api';
import {toast} from 'react-toastify';

const TripList = () => {
  const [filter, setFilter] = useState({});
  const Navigate = useNavigate();

  const tableTemplate = {
    columns: [
      {
        title: 'Corporate Name',
        field: 'companyName',
      },
      {
        title: 'Address',
        field: 'companyAddress.addressName',
      },
      // {
      //   title: 'Contact Person First Name',
      //   field: "contactPersonFirstName"
      // },
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
  function handleClickCreate(rowData) {
    Navigate('/Master/TripRate/' + rowData.id);
  }

  function handleClickEdit(rowData) {
    // axios.get(Api.trip?.getsaveRatecard+'/vendor/{vendorId}/status/{status}').then((res)=>{

    axios
      .get(
        Api.trip?.getsaveRatecard + '/' + rowData?.corporateid + '/corporate',
      )
      .then((res) => {
        if (res?.data?.data?.length)
          Navigate('/Master/TripRate/edit/' + res?.data?.data[length - 1]?.id);
        else {
          toast.error('No trip rate added');
        }
      })
      .catch((err) => {
        toast.error('No trip rate added');
      });
  }

  return (
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
        title='Trip Rate List'
        columns={tableTemplate.columns}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = Api.onBoardCorporate.changeRequest,
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
                  result?.data && result?.data?.data ? result?.data?.data : [],
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
          // selection: true,
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
                Add Rate
              </Button>
            ),
            tooltip: 'create',
            onClick: (event, rowData) => handleClickCreate(rowData),
          },
          {
            icon: () => (
              <Button
                id='btnMui123'
                variant='contained'
                color='primary'
                size='small'
                fontSize='small'
              >
                Edit Rate
              </Button>
            ),
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

export default TripList;
