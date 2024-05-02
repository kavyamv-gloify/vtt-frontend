import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CustomLabel from 'pages/common/CustomLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Api from '@api';
import {toast} from 'react-toastify';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';
const Association = () => {
  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    height: 'auto',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0px 4px 10px -2px rgba(0, 0, 0, 0.07);',
    border: '1px solid #ECECEC',
  }));
  const data = [
    {title: 'Drivers', image: '/assets/images/Drivers.svg'},
    {title: 'Vehicles', image: '/assets/images/Vehicle.svg'},
    {
      title: 'Corporate Download Associate Excel',
      image: '/assets/images/downloadIcon.svg',
      size:"40px"
    },
    {
      title: 'Corporate Upload Associate Excel',
      image: '/assets/images/uploadIcon.svg',
      size:"40px" 

    },
    {
      title: 'Vendor Download Associate Excel',
      image: '/assets/images/downloadIcon.svg',
      size:"40px"
    },
    {
      title: 'Vendor Upload Associate Excel',
      image: '/assets/images/uploadIcon.svg',
      size:"40px",
    },
    {
      title: 'Corporate Download Unassociate Excel',
      image: '/assets/images/downloadIcon.svg',
      size:"40px"
    },
    {
      title: 'Corporate Upload Unassociate Excel',
      image: '/assets/images/uploadIcon.svg',
      size:"40px"
    },
    {
      title: 'Vendor Download Unassociate Excel',
      image: '/assets/images/downloadIcon.svg',
      size:"40px"
    },
    {
      title: 'Vendor Upload Unassociate Excel',
      image: '/assets/images/uploadIcon.svg',
      size:"40px"
    },
    // {title: 'GPS Listsssss', image: '/assets/images//NodalPoints.svg'},
  ];
  const [tenant, setTenant] = useState([]);
  const [corporate, setCorporate] = useState([]);
  const [downloadClick, setDownloadClick] = useState(false);
  const [myuploadedFile, setMyuploadedFile] = useState();
  const [id, setId] = useState();
  const myref = useRef();
  const [driverError, setDriverError] = useState(false);
  const ref = useRef();
  const my_ref = useRef();
  const _ref = useRef();
  const [errMsg, seterrMsg] = useState();
  const [vehicleError, setVehicleError] = useState(false);
  const [title, setTitle] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/tenant-reg?page=0&size=1000&mobileNo=null&emailId=null&companyPAN=null&companyGSTN=null',
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.body['Tanent List']?.map((el) => {
            temp.push({
              title:
                el?.companyName + el?.companyCode + '(' + el?.emailId + ')',
              value: el?.id,
            });
          });
          setTenant(temp ?? []);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  function getCorporate(id) {
    axios
      .get(Api.baseUri + '/user-reg/corporate-reg/getCorporateByTanentId/' + id)
      .then((res) => {
        if (res?.data?.status == '200') {
          let temp = [];
          res?.data?.data?.map((el) => {
            temp.push({
              title:
                el?.companyName + el?.companyCode + '(' + el?.emailId + ')',
              value: el,
            });
          });
          setCorporate(temp ?? []);
        }
      })
      .catch((err) => {});
  }

  // function handleImpersonate(el) {
  //   // console.log('elllll', el);
  //   let postData = {
  //     authToken: localStorage.getItem('token'),
  //     userRole: 'CORPORATEADMIN',
  //     corporateId: el?.id,
  //     tanentId: el.tanentId,
  //     tanentName: el.tanentName,
  //     tenentCode: el.tanentCode,
  //     isImpersonate: 'CORPORATE',
  //   };

  //   axios
  //     .post(Api.baseUri + '/userauth/switchUserRoleTest1', postData)
  //     .then((resp) => {
  //       if (resp?.status == '200') {
  //         localStorage.setItem('token', resp?.data?.data?.authToken);
  //         if (compLogo)
  //           localStorage.setItem('COMPANY_LOGO', Api.imgUrl + compLogo);
  //         window.location.href = `/association`;
  //       }
  //     })
  //     .catch((err) => {});
  // }

  const getFormData = (object) =>
    Object.keys(object).reduce((formData, key) => {
      formData.append(key, object[key]);
      return formData;
    }, new FormData());

  async function handleDownload(type) {
    axios
      .get(
        Api?.baseUri +
          `/user-reg/associateDriver/downloadDriverVehicleAssociationToCorporateTemplate/${type}`,
        {responseType: 'blob'},
      )
      .then((blob) => {
        const url = window.URL.createObjectURL(blob.data);
        const a = document.createElement('a');
        a.href = url;
        a.download =
          type == 'ASSOCIATE'
            ? 'Corporate-Vehicle-Driver Associate'
            : 'Corporate-Vehicle-Driver UnAssociate';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {});
  }

  async function handleVendorDownload(type) {
    axios
      .get(
        Api?.baseUri +
          `/user-reg/associateDriver/downloadDriverVehicleAssociationToVendorTemplate/${type}`,
        {responseType: 'blob'},
      )
      .then((blob) => {
        const url = window.URL.createObjectURL(blob.data);
        const a = document.createElement('a');
        a.href = url;
        a.download =
          type == 'ASSOCIATE'
            ? 'Vendor-Vehicle-Driver Associate'
            : 'Vendor-Vehicle-Driver UnAssociate';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {});
  }

  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={12} md={7}>
          <CustomLabel labelVal='Associate' variantVal='h3-underline' />
        </Grid>
        <Grid item xs={12} md={5} sx={{display: 'flex'}}>
          <Autocomplete
            disablePortal
            id='actions'
            size='small'
            options={tenant}
            getOptionLabel={(option) => option.title}
            onChange={(e, v) => {
              // console.log('v', v);
              getCorporate(v?.value);
            }}
            sx={{width: '100%', m: 2}}
            renderInput={(params) => <TextField {...params} label='Tenant' />}
          />
          <Autocomplete
            disablePortal
            id='actions'
            size='small'
            options={corporate}
            getOptionLabel={(option) => option.title}
            onChange={(e, v) => {
              console.log('vvv', v?.value?.id);
              setId(v?.value?.id);
              // handleImpersonate(v?.value);
            }}
            sx={{width: '100%', m: 2}}
            renderInput={(params) => (
              <TextField {...params} label='Corporate' />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={6} sx={{padding: '20px', background: 'white'}}>
        {data?.map((el) => {
          return (
            <Grid
              item
              md={2.4}
              sm={4}
              className='cursor'
              xs={6}
              onClick={() => {
                if (el?.title == 'Drivers') {
                  if (!id) {
                    toast.error('Please select Corporate First');
                  } else {
                    navigate('/driver-association/' + id);
                    window?.location.reload();
                  }
                }
                if (el?.title == 'Vehicles') {
                  if (!id) {
                    toast.error('Please select corporate First');
                  } else {
                    navigate('/vehicle-association/' + id);
                    window?.location.reload();
                  }
                }
                if (el?.title == 'Corporate Download Associate Excel') {
                  handleDownload('ASSOCIATE');
                }
                if (el?.title == 'Corporate Upload Associate Excel') {
                  setTitle('Corporate UploadExcel');
                  myref.current.click();
                }
                if (el?.title == 'Vendor Download Associate Excel') {
                  handleVendorDownload('ASSOCIATE');
                }
                if (el?.title == 'Vendor Upload Associate Excel') {
                  setTitle('Vendor UploadExcel');
                  ref.current.click();
                }
                if (el?.title == 'Corporate Download Unassociate Excel') {
                  handleDownload('UNASSOCIATE');
                }
                if (el?.title == 'Corporate Upload Unassociate Excel') {
                  setTitle('Corporate UnassociateUploadExcel');
                  my_ref.current.click();
                }
                if (el?.title == 'Vendor Download Unassociate Excel') {
                  handleVendorDownload('UNASSOCIATE');
                }
                if (el?.title == 'Vendor Upload Unassociate Excel') {
                  setTitle('Vendor UnassociateUploadExcel');
                  _ref.current.click();
                }
              }}
            >
              <Item
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    background: '#f8f8f8',
                    width: '100px',
                    aspectRatio: '1 / 1',
                    // height: '100px',
                    borderRadius: '50%',
                    // width: '100%',
                    margin: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    // position: 'relative',
                  }}
                >
                  {el?.image ? (
                    <img
                      src={el?.image}
                      style={
                        {
                          width: el?.size,
                          height:el?.size,
                          // position: 'absolute',
                          // marginLeft: '-26px',
                          // marginTop: '20px',
                        }
                      }
                    />
                  ) : (
                    el?.icon
                  )}
                </div>
                <p
                  style={{
                    fontSize: '18px',
                    fontFamily: 'Roboto',
                    color: '#000',
                    fontWeight: '600',
                    fontStyle: 'normal',
                    marginTop: '10px',
                  }}
                >
                  {el?.title}
                </p>
              </Item>
            </Grid>
          );
        })}
      </Grid>

      <input
        type='file'
        ref={title == 'Vendor UploadExcel' ? ref : myref}
        style={{display: 'none'}}
        onChange={(e) => {
          console.log('fasdfdsf');
          let baseUrl =
            title == 'Vendor UploadExcel'
              ? '/user-reg/associateDriver/import-driverVehicleToVendorExcel'
              : '/user-reg/associateDriver/import-driverVehicleToCorporateExcel';
          axios({
            method: 'post',
            url: Api?.baseUri + baseUrl,
            data: getFormData({file: e.target.files[0]}),
            headers: {'Content-Type': 'multipart/form-data'},
          })
            .then((res) => {
              console.log('res', res?.data);
              if (res?.data?.status == '200') {
                toast.success('Excel uploaded successfully');
                window.location.reload();
              } else if (res?.data?.status == '500') {
                if (res?.data?.data == null) {
                  toast.error(res?.data?.message);
                  window.location.reload();
                } else {
                  setDriverError(true);
                  seterrMsg(res?.data?.data);
                }
              } else {
                toast.error('Something went wrong');
              }
            })
            .catch((er) => {
              console.log(er);
              toast.error('Something went wrong');
            });
        }}
      />

      <input
        type='file'
        ref={title == 'Corporate UnassociateUploadExcel' ? my_ref : _ref}
        style={{display: 'none'}}
        onChange={(e) => {
          let baseUrl =
            title == 'Corporate UnassociateUploadExcel'
              ? '/user-reg/associateDriver/import-unAssociateDriverVehicleFromCorporateExcel'
              : '/user-reg/associateDriver/import-unAssociateDriverVehicleFromVendorExcel';
          console.log('fasdfdsf');
          axios({
            method: 'post',
            url: Api?.baseUri + baseUrl,
            data: getFormData({file: e.target.files[0]}),
            headers: {'Content-Type': 'multipart/form-data'},
          })
            .then((res) => {
              if (res?.data?.status == '200') {
                toast.success('Excel uploaded successfully');
                window.location.reload();
              } else if (res.data?.status == '500') {
                if (res?.data?.data == null) {
                  toast.error(res?.data?.message);
                  window.location.reload();
                } else {
                  setDriverError(true);
                  seterrMsg(res?.data?.data);
                }
              } else {
                toast.error('Something went wrong');
              }
            })
            .catch((er) => {
              console.log(er);
              toast.error('Something went wrong');
            });
        }}
      />

      {driverError ? (
        <Dialog
          open={true}
          maxWidth='false'
          PaperProps={{
            sx: {
              width: '40%',
            },
          }}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle
            style={{
              background: '#e74b3c',
              color: 'white',
              paddingBottom: '0px',
              fontWeight: 600,
              fontSize: '16px',
            }}
          >
            <span>Total number of error is {errMsg?.length}</span>
            <CloseIcon
              style={{
                cursor: 'pointer',
                position: 'absolute',
                right: '12px',
                top: '12px',
              }}
              onClick={(e) => {
                setDriverError(false);
              }}
            />
          </DialogTitle>
          <DialogContent
            style={{
              padding: '15px 10px 17px 21px;',
              background: '#e74b3c',
              color: 'white',
            }}
          >
            {errMsg?.map((el) => {
              return (
                <div>
                  Row: {el?.row}, message: {el?.errorMsg}{' '}
                </div>
              );
            })}
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};

export default Association;
