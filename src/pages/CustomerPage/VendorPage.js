import React, {useState, useEffect, useRef} from 'react';
import {Grid} from '@mui/material';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import BusinessIcon from '@mui/icons-material/Business';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import geturl from '@common/fileUrl';
import moment from 'moment';
import AppTooltip from '@crema/core/AppTooltip';
import Api from '@api';
import axios from 'axios';
import CustomLabel from 'pages/common/CustomLabel';
import {useNavigate, useParams} from 'react-router-dom';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
const VendorPage = () => {
  const [list, setList] = useState();
  const [isHover, setIsHover] = useState(false);
  const [index, setIndex] = useState();
  const {id} = useParams();
  const [compLogo, setCompLogo] = useState('');
  const navigate = useNavigate();

  const Item = styled(Paper)(({theme}) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    height: 'auto',
    color: theme.palette.text.secondary,
    borderRadius: '12px',
    boxShadow: '0px 0px 10px -2px rgba(0, 0, 0, 0.07)',
    border: '1px solid #ECECEC',
  }));

  const getVendorList = () => {
    axios
      .get(
        Api.baseUri +
          '/user-reg/associatevendor/getallassociateVendorBycorporateId/' +
          id,
      )
      .then((re) => {
        if (re?.data?.status == '200') {
          setList(re?.data?.data ?? []);
        }
      })
      .catch((err) => {
        setList([]);
      });
  };
  useEffect(() => {
    getVendorList();
  }, []);

  function handleMouseEnter(ind) {
    if (index == ind) {
      setIsHover(true);
    }
  }

  function handleMouseLeave() {
    setIsHover(false);
  }
  function handleImpersonate() {
    window.location.href = `/customer-page/masterpage/vendor`;
  }
  return (
    <>
      <Grid container spacing={2} sx={{mb: 6}}>
        <Grid item xs={8}>
          <CustomLabel labelVal='Vendor Page' variantVal='h3-underline' />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={6}
        style={{background: 'white', padding: '20px', marginTop: '10px'}}
      >
        {list?.map((el, ind) => {
          return (
            <Grid
              item
              md={4}
              sm={6}
              xs={12}
              onMouseEnter={() => {
                setIndex(ind);
                handleMouseEnter(ind);
              }}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                navigate(`/customer-page/corporatapage/vendorPage/${el?.id}`);
              }}
              style={{
                height: 'auto',

                position: 'relative',
              }}
            >
              <Item
                sx={{
                  height: '100%',
                  paddingBottom: '55px',
                  paddingTop: '10px',
                  paddingRight: '10px',
                  backgroundColor:
                    index == ind && isHover ? '#f5f5f5' : 'white',
                }}
              >
                <Grid container>
                  <Grid
                    item
                    md={12}
                    sm={12}
                    xs={12}
                    sx={{display: 'flex', justifyContent: 'end'}}
                  >
                    <AppTooltip title={'Impersonate'}>
                      <LabelImportantIcon
                        sx={{fontSize: '15px'}}
                        color='primary'
                        onClick={() => {
                          handleImpersonate();
                        }}
                      />
                    </AppTooltip>
                  </Grid>
                </Grid>
                <Grid container spacing={1}>
                  {/* <Grid
                    item
                    md={3}
                    sm={12}
                    style={{
                      justifyContent: 'center',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <img
                        src={Api.imgUrl + compLogo}
                        style={{
                          // height: '200px',
                          height: '80px',
                          aspectRatio: '1 / 1',
                          border: '1px solid grey',
                          borderRadius: '50%',
                          // border: '1px solid black',
                        }}
                      />
                    </div>
                  </Grid> */}
                  <Grid item md={12} sm={12}>
                    <div style={{padding: '30px'}}>
                      <h4
                        style={{
                          fontSize: '21px',
                          color: '#212121',
                        }}
                      >
                        {el?.vendor?.vendorName}
                      </h4>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '5px',
                        }}
                      >
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <img
                            src='/assets/images/companyId 3.svg'
                            style={{
                              width: '17px',
                              marginTop: '4px',
                              height: '21px',
                            }}
                          />
                          <h5
                            style={{
                              fontSize: '11px',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              marginLeft: '5px',
                            }}
                          >
                            {el?.vendor?.vendorCode}
                          </h5>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '15px',
                          }}
                        >
                          <img
                            src='/assets/images/CalenderVector.svg'
                            style={{
                              width: '13px',
                              height: '13px',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                            }}
                          />
                          <h5 style={{fontSize: '11px', marginLeft: '5px'}}>
                            {/* 10-07-2023 */}
                            {moment(el?.vendor?.createdOn)?.format(
                              'DD-MM-YYYY',
                            )}
                          </h5>
                        </div>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <img
                          src='/assets/images/MapVector.svg'
                          style={{
                            width: '17px',
                            height: '21px',
                            marginTop: '3px',
                          }}
                        />
                        <h5
                          style={{
                            color: 'black',
                            fontSize: '11px',
                            marginLeft: '6px',
                            marginTop: '3px',
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {el?.vendor?.address?.addressName?.split('++')?.[0] +
                            ',' +
                            el?.vendor?.address?.addressName?.split('++')?.[1] +
                            ',' +
                            el?.vendor?.address?.city +
                            ',' +
                            el?.vendor?.address?.state +
                            ',' +
                            el?.vendor?.address?.pinCode}
                        </h5>
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                  sm={12}
                  style={{
                    background: '#F8F8F8',
                    borderRadius: '0px 0px 12px 12px',
                    width: 'calc(100% - 24px)',
                    padding: '15px',
                    position: 'absolute',
                    bottom: '0',
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '10px',
                  }}
                >
                  <Grid container>
                    <AppTooltip placement={'bottom'} title={el?.emailId}>
                      <Grid
                        item
                        md={3}
                        sm={4}
                        xs={4}
                        className='cursor'
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <img
                          src='/assets/images/Message.svg'
                          style={{
                            width: '20px',
                            height: '20px',
                            marginRight: '5px',
                          }}
                        />
                        <div
                          style={{
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {el?.vendor?.emailId}
                        </div>
                      </Grid>
                    </AppTooltip>
                    <Grid
                      item
                      md={3}
                      sm={4}
                      xs={4}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src='/assets/images/call.svg'
                        style={{
                          width: '15px',
                          height: '15px',
                          marginRight: '5px',
                        }}
                      />
                      <div
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {el?.vendor?.mobileNo}
                      </div>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={4}
                      xs={4}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <img
                        src='/assets/images/companyBuilding.svg'
                        style={{
                          width: '14px',
                          height: '13px',
                          marginRight: '5px',
                          marginTop: '-3px',
                        }}
                      />
                      <div
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {el?.vendor?.address?.city}
                      </div>
                    </Grid>
                    <Grid
                      item
                      md={3}
                      sm={4}
                      xs={4}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    ></Grid>
                  </Grid>
                </Grid>
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default VendorPage;
