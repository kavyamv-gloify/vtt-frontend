import React, {useState, useEffect} from 'react';
import axios from 'axios';
import _ from 'lodash';
import api from '@api';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SiteList from './route-listing1';
import {SecurityUpdateWarningRounded} from '@mui/icons-material';
import AppLoader from '@crema/core/AppLoader';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {makeStyles} from '@mui/styles';
import TablePagination from '@mui/material/TablePagination';
import Pagination from '@mui/material/Pagination';
import {Link} from 'react-router-dom';
import {Button} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useAuthUser} from '@crema/utility/AuthHooks';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import {useRef} from 'react';
import Tooltip from '@mui/material/Tooltip';
import './myfile.css';
import Api from '@api';
const List = () => {
  const inputElement = useRef();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [dataid, setDataid] = useState(null);
  const [childdata, setChildData] = useState([]);
  const [expandedPanel, setExpandedPanel] = useState({});
  const itemsPerPage = 10;
  const [page, setPage] = React.useState(1);
  const [totalCount, settotalCount] = React.useState(0);
  const {user} = useAuthUser();
  const tanents = user?.userList?.tanentId;

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();

  const handlethisChange = (event, value) => {
    setPage(value);
  };
  // useEffect(() => {
  //   async function fetchData() {
  //       let baseURL = 'http://180.151.3.104:9000/trip/generate-routes/getallgeneratedroutes'
  //   //   const baseURL = `${api.siteOffice.list}`;
  //     let response = await axios.get(`${baseURL}`);
  //     setChildData(response.data.data)
  //   }
  //   fetchData();
  // }, []);
  useEffect(() => {
    async function fetchData() {
      let baseURL = Api?.routes?.getallgeneratedroutes;
      // const baseURL = `${api.onBoardCorporate.list}/${tanents}/tanent?page=${page-1}&size=${itemsPerPage}`;
      axios
        .get(`${baseURL}`)
        .then((response) => {
          settotalCount(response?.data?.data?.length ?? 0);
          setData(response?.data?.data);
        })
        .catch((err) => {
          setData(null);
        });
    }
    fetchData();
  }, [page]);
  return (
    <>
      <div
        style={{textAlign: 'right', paddingRight: '10px', backgroundColor: ''}}
      >
        <Button
          id='btnMui123'
          variant='contained'
          style={{margin: '8px'}}
          onClick={(e) => {
            navigate('/create-route');
          }}
        >
          Create New Route
        </Button>
      </div>
      <div style={{borderTop: 'solid 2px 11234e'}}>
        <Accordion style={{padding: '10px'}} expanded={false}>
          <AccordionSummary
            className='mb-2'
            expandIcon={
              <>
                <ExpandMoreIcon style={{opacity: '0'}} />
              </>
            }
            // onClick={() => { setDataid(e.id); }}
            aria-controls='panel1a-content'
            style={{fontWeight: 'bold'}}
            id='panel1a-header'
          >
            <Typography style={{fontWeight: '500', width: '10%'}}>
              Route
            </Typography>
            <Typography style={{fontWeight: '500', width: '15%'}}>
              Company
            </Typography>
            <Typography style={{fontWeight: '500', width: '30%'}}>
              Shift Name
            </Typography>
            <Typography style={{fontWeight: '500', width: '10%'}}>
              Vehicle Type
            </Typography>
            <Typography style={{fontWeight: '500', width: '10%'}}>
              Female
            </Typography>
            <Typography style={{fontWeight: '500', width: '15%'}}>
              No of Employee
            </Typography>
            <Typography style={{fontWeight: '500', width: '20%'}}>
              Created on
            </Typography>
            <Typography style={{fontWeight: '500', width: '10%'}}>
              Action
              {/* <EditIcon color="primary" style={{marginRight:"10px"}} />
                  <VisibilityIcon color="primary" style={{marginRight:"10px"}} /> */}
              {/* <img src="/assets/images/edit.png" style={{marginRight:"10px"}} />
                  <img src="/assets/images/assign.png" style={{marginRight:"10px"}} />
                  <img src="/assets/images/view_icon.png" /> */}
            </Typography>
          </AccordionSummary>
          {/* <AccordionDetails>

              </AccordionDetails> */}
        </Accordion>

        {data?.length ? (
          data
            // ? data.slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((e) => {
              return (
                <Accordion
                  style={{padding: '10px'}}
                  expanded={expandedPanel[e.id] ? true : false}
                >
                  <AccordionSummary
                    className='mb-2'
                    expandIcon={
                      <>
                        <ExpandMoreIcon />
                      </>
                    }
                    onClick={() => {
                      let tem = {};
                      tem[e.id] = !expandedPanel[e.id];
                      setExpandedPanel(tem);
                    }}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    <Typography style={{width: '10%'}}>
                      {e.routeName}
                    </Typography>
                    <Typography style={{width: '15%'}}>
                      {e.corporateName}
                    </Typography>
                    <Typography style={{width: '30%'}}>
                      {e.shiftName + ' (09:00 AM - 07:00 PM)'}
                    </Typography>
                    <Typography style={{width: '10%'}}>
                      {e.vehicleType ?? 'NA'}
                    </Typography>
                    <Typography style={{width: '10%'}}>
                      {e.isFemale == 'YES' ? (
                        <img src='/assets/images/avilable_icon.png' />
                      ) : (
                        <img src='/assets/images/notavailable_icon.png' />
                      )}
                    </Typography>
                    <Typography style={{width: '15%'}}>
                      {e.employeeByVehicleTypeDto?.length}
                    </Typography>
                    <Typography style={{width: '20%'}}>
                      {e.routeCreationDateAndTime}
                    </Typography>
                    <Typography
                      style={{width: '10%'}}
                      ref={inputElement}
                      id='ICONIC'
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {/* <EditIcon color="primary" style={{marginRight:"10px"}} />
                  <VisibilityIcon color="primary" style={{marginRight:"10px"}} /> */}
                      <Tooltip title='Edit' onClick={(e) => {}}>
                        <img
                          src='/assets/images/edit.png'
                          style={{marginRight: '10px'}}
                        />
                      </Tooltip>
                      <Tooltip title='Assign to Vendor'>
                        <img
                          src='/assets/images/assign.png'
                          style={{marginRight: '10px'}}
                        />
                      </Tooltip>
                      <Tooltip title='View'>
                        <img src='/assets/images/view_icon.png' />
                      </Tooltip>
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      {/* <div style={{ 'display': 'flex', 'justifyContent': 'flex-end', 'paddingBottom': "10px", "marginLeft": "20px" }}>


                    <Link style={{ "marginRight": "10px" }} to={'/onbordCorporate/editPage/' + e.id}>Edit</Link>
                    <Link style={{ "marginRight": "10px" }} to={'/onbordCorporate/detailPage/' + e.id}>View</Link>

                  </div> */}
                      <SiteList
                        childdata2={e?.employeeByVehicleTypeDto ?? []}
                        childdata={e?.emplyeeData ?? []}
                        id={dataid}
                      />
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })
        ) : data == null ? (
          <>No data Found</>
        ) : (
          <AppLoader />
        )}
        <div
          className={classes.root}
          style={{display: 'flex', justifyContent: 'center'}}
        >
          <Pagination
            // count={Math.ceil(data?.length / itemsPerPage)}
            count={Math.ceil(totalCount / itemsPerPage)}
            page={page}
            defaultPage={0}
            // color="primary"
            size='large'
            showFirstButton
            showLastButton
            onChange={handlethisChange}
          />
        </div>
        {/* <SmartTable
                components={{
                    Toolbar: (props) => (
                        <>
                            <div
                                style={{
                                    height: "0px",
                                }}
                            >
                            </div>
                        </>
                    ),
                }}
                title="Onboard Tenants List"
                columns={tableTemplate.columns}
                data={query =>
                    new Promise((resolve, reject) => {
                        let url = `http://180.151.3.104:9000/trip/generate-routes/getallgeneratedroutes`,
                            body = {
                                pageSize: query.pageSize,
                                pageNo: query.page
                            }
                        if (!_.isEmpty(filter)) {
                            body = {
                                ...body,
                                ...filter
                            }
                        }
                        axios.get(url, body).then(result => {
                            resolve({
                                data: result?.data?.data,
                                page: (result.data && result.data.currentPage) ? result.data.currentPage : 0,
                                totalCount: (result.data && result.data.totalItems) ? result.data.totalItems : 0,
                            })
                        })
                    })}
                options={{
                    search: false,
                    showTitle: false,
                    // filtering: true,
                    actionsColumnIndex: -1,
                    headerStyle: { position: "sticky", top: 0 },
                }}
                actions={[
                    {
                        icon: () => (<EditIcon color="primary" />),
                        tooltip: 'Assign',
                        onClick: (event, rowData) => handleClickEdit(rowData)
                    },
                    {
                        icon: () => (<VisibilityIcon color="primary" />),
                        tooltip: 'view',
                        onClick: (event, rowData) => {myDial(true)}
                    }
                ]}
                localization={{
                    body: {
                        emptyDataSourceMessage: "No records to display",
                        filterRow: {
                            filterTooltip: "Filter",
                            filterPlaceHolder: "Filtaaer",
                        },
                    },
                }}
                style={{ borderRadius: 16, boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)' }}
            />
            <Dialog
        onClose={handleClose}
        height='500px'
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <PopupMap id={"driverId"} myDial={myDial} driverName={"driverName"} radius={8000}
          />
          </DialogContent>
          </Dialog> */}
      </div>
    </>
  );
};

export default List;
