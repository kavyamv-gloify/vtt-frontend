import React, {useState} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import getDocUrl from '@common/makeurl';
import {useAuthUser} from '@crema/utility/AuthHooks';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import Api from '@api';
import EditForm from '../EditPage/pending';
import {useNavigate, useParams} from 'react-router-dom';
import CustomLabel from 'pages/common/CustomLabel';
const List = () => {
  const [filter, setFilter] = useState({});
  const navigate = useNavigate();
  const {user} = useAuthUser();
  console.log('user', user);
  const tenants = user?.userList?.tanentId;
  const tableRef = React.useRef();
  const [openform, setOpenForm] = useState();
  const [id, setId] = useState();
  const routeParams = useParams();
  console.log('id', routeParams?.id);
  const tableTemplate = {
    columns: [
      // {
      //   title: 'Corporate Logo',
      //   field: "companyLogo",
      //   render: rowData => (
      //     <Avatar alt="Logo" src={ getDocUrl.docURL(rowData.logo)} />
      //   )
      // },
      {
        title: 'Corporate Name',
        field: 'companyName',
      },
      {
        title: 'Address',
        field: 'companyAddress.addressName',
      },
      {
        title: 'Contact Person First Name',
        field: 'contactPersonFirstName',
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

  // function handleClickView(rowData) {
  //   navigate('/onbordCorporate/detailPage/' + rowData.id);
  //
  // };
  function handleClickEdit(rowData) {
    setId(rowData.id);
    setOpenForm(true);
  }

  function handleCloseform() {
    setOpenForm(false);
    setTimeout(() => {
      tableRef.current && tableRef.current.onQueryChange();
    }, 0);
  }

  function handleClose() {
    setOpenForm(false);
  }

  return (
    <>
      <div style={{marginBottom: '20px'}}>
        <CustomLabel
          labelVal='Profile Update Request'
          variantVal='h3-underline'
        />
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
            // let url = `${api.onBoardCorporate.changeRequest}/${tenants}/PENDING/status?page=0&size=2`,
            // let url = `${
            //     Api?.onBoardCorporate?.pendingCorp + tenants
            //   }/tanent/PENDING/status`,
            let url =
                api.baseUri +
                `/user-reg/corporate-change/${
                  user?.userList?.userRole == 'SUPERADMIN'
                    ? routeParams?.id
                    : tenants
                }/tanent/PENDING/status`,
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
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          {
            icon: () => <EditIcon color='primary' />,
            tooltip: 'edit',
            onClick: (event, rowData) => handleClickEdit(rowData),
          },
          // {
          //   icon: () => (<VisibilityIcon color="primary" />),
          //   tooltip: 'view',
          //   onClick: (event, rowData) => handleClickView(rowData)
          // }
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

      <Dialog
        // onClose={handleClose}
        open={openform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '90%',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <div>
          <DialogTitle
            style={{
              background: '#f5f2f2',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h1>Corporate Pending Request</h1>
            <CloseIcon
              onClick={handleClose}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>

          <DialogContent style={{padding: '0px'}}>
            <div style={{padding: '1rem', marginTop: '60px'}}>
              <EditForm id={id} close={handleCloseform} />
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default List;
