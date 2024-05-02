import axios from 'axios';
import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
// import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Api from '@api';
import {Box, Grid} from '@mui/material';
import CustomLabel from 'pages/common/CustomLabel';
import AppTooltip from '@crema/core/AppTooltip';
import DialTax from './dial';
import {useAuthUser} from '@crema/utility/AuthHooks';
const tableTemplate = {
  columns: [
    {
      title: 'State',
      field: 'state',
    },
    {
      title: 'Tax Categories',
      field: 'tax',
      render: (rd) => {
        let arr = [];
        rd?.tax?.map((el) => {
          arr.push(
            el.taxTypeName +
              ' - ' +
              (el.taxAbleAmount ? Number(el.taxAbleAmount)?.toFixed(2) : 0) +
              ' %',
          );
        });
        return arr?.join(', ');
      },
    },
    {
      title: 'Status',
      field: 'status',
      render: (rd) => {
        return (
          <div style={{color: rd.status == 'ACTIVE' ? '#00a67e' : '#00a67e'}}>
            {rd.status || 'Active'}
          </div>
        );
      },
    },
    {
      title: 'Created On',
      field: 'createdOn',
      type: 'datetime',
    },
    {
      title: 'Last Updated on',
      field: 'updatedOn',
      type: 'datetime',
    },
  ],
};
const Taxes = () => {
  const {user} = useAuthUser();
  const [stateList, setStateList] = useState([]);
  const [data, setData] = useState();
  const [selectedData, setSelectedData] = useState(null);
  console.log('data', data);
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/associatevendor/getallassociateCorporateByVendorId/' +
          user?.userList?.profileId,
      )
      .then((re) => {
        let st = [];
        re?.data?.data?.map((el) => {
          if (!st.includes(el?.corporate?.companyAddress?.state)) {
            st.push({
              title: el?.corporate?.companyAddress?.state,
              value: el?.corporate?.companyAddress?.state,
            });
          }
        });
        console.log('st', st);
        setStateList(st);
      })
      .catch((er) => {});
  }, []);
  useEffect(() => {
    if (selectedData == null) {
      axios
        .get(Api.baseUri + '/user-reg/tax-Applicable/getAll')
        .then((res) => {
          setData(res?.data?.data || []);
        })
        .catch((er) => {
          setData([]);
        });
    }
  }, [selectedData]);

  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal='Taxes' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className=''>
              <AppTooltip placement={'top'} title={'Add Taxes'}>
                <img
                  src='/assets/images/title-icon/add leave.svg'
                  className='title-icons-mui'
                  onClick={() => {
                    setSelectedData('CREATE');
                  }}
                />
              </AppTooltip>
            </div>
          </Box>
        </Grid>
      </Grid>
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
        columns={tableTemplate.columns}
        data={
          stateList?.length
            ? data?.filter((item) =>
                stateList?.some((state) => state?.value == item?.state),
              )
            : []
        }
        actions={[
          {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              setSelectedData(rowData.id);
            },
          },
          //   (rd) => ({
          //     icon: () => (
          //       <DeleteIcon
          //         sx={{
          //           color: '#bc0906',
          //           opacity: rd?.isActive == 'false' ? '0.3' : '',
          //         }}
          //       />
          //     ),
          //     tooltip: 'Deactivate',
          //     onClick: (event, rowData) => {
          //       if (rowData?.isActive == 'false') {
          //         return;
          //       }
          //       handleDelete(rowData);
          //     },
          //   }),
        ]}
        options={{
          search: false,
          showTitle: false,
          selection: false,
          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
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
      {selectedData && (
        <DialTax id={selectedData} setSelectedData={setSelectedData} />
      )}
    </>
  );
};

export default Taxes;
