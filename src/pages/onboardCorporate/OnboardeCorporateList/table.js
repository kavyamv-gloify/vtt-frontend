import React, {useState, useEffect} from 'react';
import SmartTable from '@smart-table';
import Avatar from '@mui/material/Avatar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {useParams} from 'react-router-dom';
import {Dialog, DialogContent} from '@mui/material';
import ViewForm from '../../ManagesiteOffice/DetailSiteOfficepage/DetailPage';
import CloseIcon from '@mui/icons-material/Close';
import EditForm from '../../ManagesiteOffice/EditSiteOffceForm/EditForm';

const styleView = {
  parentcontainer: {
    display: 'flex',
    justifyContent: 'space-between',
    background: '#f5f2f2',
    height: '4rem',
    paddingRight: '1.5rem',
    paddingLeft: '1.5rem',
    position: 'fixed',
    width: '50%',
    zIndex: '9',
    borderRadius: '5px 5px 0px 0px',
  },

  h1: {
    marginTop: '1.5rem',
  },

  paddingview: {
    padding: '2rem',
    marginTop: '1.5rem',
  },
};

const SiteList = ({childdata, id}) => {
  const [tempData, setTemp] = useState([]);
  const tableRef = React.useRef();
  const [openDialog, setopenDialog] = useState(false);
  const [openform, setOpenForm] = useState(false);
  const [detailform, setDetailForm] = useState(false);
  const navigate = useNavigate();
  const [dialID, setdialID] = useState();
  const {user} = useAuthUser();
  const [mydata, setmydata] = useState();
  //  id=useParams();
  useEffect(() => {
    async function fetchData() {
      const baseURL = `${api.onBoardTenant.list}/${user?.userList?.tanentId}`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          setmydata(response.data.data);
        })
        .catch((err) => {
          setmydata({});
        });
    }
    fetchData();
  }, [user?.userList?.tanentId]);
  function getAll() {
    if (!id) return;
    axios
      .get(
        `${api.siteOffice.list}/corporate/${id}?page=0&size=100&officeName=null`,
      )
      .then((result) => {
        setTemp(result?.data?.data?.body?.['SiteOffice List'] ?? []);
      })
      .catch((err) => {
        setTemp([]);
      });
  }
  useEffect(() => {
    getAll();
  }, [id]);

  useEffect(() => {}, [tempData]);
  function popBTNClick(val) {
    getAll();
    if (!val) {
      setopenDialog(false);
    }
  }
  const tableTemplate = {
    columns: [
      {
        title: 'Site Office Name',
        field: 'officeName',
      },
      // {
      //     title: 'Company Id',
      //     field: "companyId"
      // },
      // {
      //     title: 'Company Name',
      //     field: "companyName"
      // },
      {
        title: 'Office Address ',
        field: 'officeAddress.addressName',
      },
      {
        title: 'Town/City ',
        field: 'officeAddress.city',
      },
      {
        title: 'State ',
        field: 'officeAddress.state',
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

  function handleClickEdit(rowData) {
    // navigate('/onbordCorporate/siteOffice/edit-form/' + rowData.id);
    setopenDialog(true);
    setdialID(rowData?.id);
  }
  const handleDialogForm = () => {
    setOpenForm(true);
  };
  const handleDialogDetailForm = (rowData) => {
    setdialID(rowData?.id);
    setDetailForm(true);
  };

  const handleClose = () => {
    setOpenForm(false);
  };
  const handleCloseForm = (status) => {
    setOpenForm(status);
    getAll();
  };
  const handleClosedialog = () => {
    setDetailForm(false);
  };

  return (
    <>
      {openDialog && dialID && (
        <EditForm
          tenantdata={mydata}
          openDialog={openDialog}
          id={dialID}
          popBTNClick={popBTNClick}
        />
      )}

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
        // tableRef={tableRef}
        data={tempData ?? []}
        options={{
          search: false,
          showTitle: false,

          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          {
            icon: () => <VisibilityIcon color='primary' />,
            tooltip: 'view',
            onClick: (event, rowData) => handleDialogDetailForm(rowData),
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
      <Dialog
        onClose={handleClose}
        open={detailform}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '50%',
          },
        }}
      >
        <div>
          <DialogContent style={{padding: '0px'}}>
            <div style={styleView.parentcontainer}>
              <h1 style={styleView.h1}> Site Details</h1>
              <CloseIcon
                onClick={() => {
                  setDetailForm(false);
                }}
                style={{
                  marginTop: '1.4rem',
                  color: '#4f4f4f',
                  fontWeight: 'bold',
                }}
              />
            </div>
            <div style={styleView.paddingview}>
              {dialID && <ViewForm close={handleClosedialog} id={dialID} />}
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
};

export default SiteList;
