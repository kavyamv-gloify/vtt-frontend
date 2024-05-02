import React, {useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import Button from '@mui/material/Button';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import MyDial from './allotPopup';

const List = () => {
  const [TempOpenedData, setTempOpenedData] = useState({});
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();
  const tableTemplate = {
    columns: [
      {
        title: 'Owner Name',
        field: 'ownerName',
      },
      {
        title: 'Vehicle Type',
        field: 'vehicleType',
      },
      {
        title: 'Vehicle Brand',
        field: 'vehicleBrand',
      },
      {
        title: 'Vehicle Number',
        field: 'regNumber',
      },
      {
        title: 'Status',
        field: 'driverAssignment',
      },
      // {
      //   title: 'Email Id',
      //   field: "ownerEmail"
      // },
      // {
      //   title: 'Mobile No.',
      //   field: "ownerMobile"
      // },
    ],
  };

  function handleClickView(rowData) {
    navigate('/onbordTenant/vehicle/detailPage/' + rowData.id);
  }

  function handleRegsiter(rowdata) {
    navigate('/allotpage');
  }
  // function handleClickEdit(rowData) {
  //   navigate('/onbordTenant/vehicle/editPage/' + rowData.id);
  //
  // };

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
        title='Onboard Tenants List'
        columns={tableTemplate.columns}
        data={(query) =>
          new Promise((resolve, reject) => {
            let url = api.vehicle.list,
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
                // totalCount: (result.data && result.data.totalItems) ? result.data.totalItems : 0,
                totalCount: result?.data?.data?.length ?? 0,
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
            icon: () => <MyDial val={TempOpenedData} />,
            // tooltip: 'edit',
            onClick: (event, rowData) => setTempOpenedData(rowData),
          },

          //     {
          //       icon: () =>
          //           <Button id='btnMui123' variant="contained" color="primary" size="small" fontSize="small">Allot</Button>
          //       ,
          //       tooltip: 'Order Detail',
          //       iconProps: {
          //           fontSize: 'small',
          //           color: 'primary',
          //           classes: 'filled'
          //       },
          //       onClick: (event, rowData) => {
          //         handleRegsiter(rowData)

          //       }
          //   },
          //   {
          //     icon: () =>
          //         <Button id='btnMui123' variant="contained" color="primary" size="small" fontSize="small">Allot</Button>
          //     ,
          //     tooltip: 'Order Detail',
          //     iconProps: {
          //         fontSize: 'small',
          //         color: 'primary',
          //         classes: 'filled'
          //     },
          //     onClick: (event, rowData) => {
          //         navigate('/allotPage')

          //     }
          // }
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: 'No records to display',
            filterRow: {
              filterTooltip: 'Filter',
              filterPlaceHolder: 'Filter',
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
