import React, {useEffect, useState} from 'react';
import CustomLabel from 'pages/common/CustomLabel';
import {Box, Grid} from '@mui/material';
import {alpha} from '@mui/material/styles';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import {IconButton} from '@mui/material';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Upload from './uploadUserGuide';
import ViewPDF from './pdfview';
import {useAuthUser} from '@crema/utility/AuthHooks';
import ReactPlayer from 'react-player/lazy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Api from '@api';
import axios from 'axios';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {toast} from 'react-toastify';
import Confirm from '@confirmation-box';
import AppTooltip from '@crema/core/AppTooltip';
import RestoreIcon from '@mui/icons-material/Restore';

const Trainingvideo = () => {
  const {user} = useAuthUser();
  const stakeHolder = null;
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [obj, setObj] = useState({});
  const [route, setRoute] = useState({});
  const [modules, setModules] = useState([]);
  const [myEditData, setMyEditData] = useState({});
  const [openConfirmbox, setopenConfirmbox] = useState(false);
  const [openEditBox, setOpenEditBox] = useState(false);
  // const [openEdit, setOpenEdit]
  useEffect(() => {
    if (!open && !openConfirmbox) getData();
  }, [open, openConfirmbox]);

  function closeConfirmBox(d) {
    if (d == 'YES') {
      axios
        .put(Api.baseUri + '/user-reg/userGuide/update', {
          ...myEditData,
          status: myEditData.btn,
        })
        .then((res) => {
          setopenConfirmbox(false);
          setMyEditData({});
          if (res?.data?.status == 200) {
            toast.success('Deactivated Successfully.');
            getData();
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((err) => {
          toast.error('Something went wrong.');
          setopenConfirmbox(false);
          setMyEditData({});
        });
    } else {
      setopenConfirmbox(false);
      setMyEditData({});
    }
  }
  async function getNextPrevData(module, page, sh, pl) {
    // console.log('sh', sh);
    // console.log('page', page);
    let tempD = route;
    let resp = await axios.post(
      Api.baseUri + '/user-reg/userGuide/getAllByFilters',
      {
        stakeHolder: sh,
        module: module,
        platform: 'WEB',
        page: page,
        size: 4,
      },
    );
    tempD[module + '---' + sh + '---' + pl] = {
      currentPage: resp?.data?.data?.body?.currentPage,
      totalPages: resp?.data?.data?.body?.totalPages,
      totalItems: resp?.data?.data?.body?.totalItems,
      data: resp?.data?.data?.body['UserGuide List'],
    };
    // console.log(' tempD[module]', tempD[module]);
    setRoute({...tempD});
    // setModules({...tempD});
  }
  async function getData() {
    let res = await axios.get(
      Api.baseUri +
        '/user-reg/userGuide/getAllByStakeHolder/' +
        (user?.userList?.userRole == 'SUPERADMIN'
          ? 'null'
          : user?.userList?.userRole),
    );
    let temArr = [];
    res?.data?.data?.map((el) => {
      if (user?.userList?.userRole == 'SUPERADMIN' || el.platform == 'WEB') {
        if (
          !temArr?.includes(
            el.module + '---' + el.stakeHolder + '---' + el.platform,
          )
        )
          temArr.push(el.module + '---' + el.stakeHolder + '---' + el.platform);
      }
    });
    let tempD = {};
    await Promise.all(
      temArr?.map(async (el) => {
        let resp = await axios.post(
          Api.baseUri + '/user-reg/userGuide/getAllByFilters',
          {
            module: el?.split('---')[0],
            stakeHolder: el?.split('---')[1],
            platform: el?.split('---')[2],
            page: 0,
            size: 4,
          },
        );
        tempD[el] = {
          currentPage: resp?.data?.data?.body?.currentPage,
          totalPages: resp?.data?.data?.body?.totalPages,
          totalItems: resp?.data?.data?.body?.totalItems,
          data: resp?.data?.data?.body['UserGuide List'],
        };
      }),
    );
    setRoute({...tempD});
    setModules([...temArr]);
  }
  let style = {
    borderRadius: '50%',
    width: 40,
    height: 40,
    color: (theme) => theme.palette.text.secondary,
    backgroundColor: (theme) => theme.palette.background.default,
    border: 1,
    borderColor: 'transparent',
    '&:hover, &:focus': {
      color: (theme) => theme.palette.text.primary,
      backgroundColor: (theme) => alpha(theme.palette.background.default, 0.9),
      borderColor: (theme) => alpha(theme.palette.text.secondary, 0.25),
    },
  };

  return (
    <div>
      {user?.userList?.userRole == 'SUPERADMIN' && (
        <AppTooltip placement={'top'} title={'Add User Guide '}>
          <LibraryAddIcon
            style={{
              position: 'fixed',
              top: '115px',
              zIndex: 801,
              right: '40px',
            }}
            className='cursor'
            onClick={() => {
              setOpen(true);
            }}
          />
        </AppTooltip>
      )}
      <div style={{background: 'white', padding: '30px'}}>
        {modules?.length > 0 &&
          modules?.map((mod) => {
            return (
              <>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: '900',
                      marginBottom: '10px',
                    }}
                  >
                    {mod?.split('---')[0]} ({route[mod].totalItems || 0})
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <p>
                      {'Page: ' +
                        (route[mod]?.totalPages
                          ? route[mod]?.currentPage + 1
                          : 0) +
                        ' / ' +
                        route[mod]?.totalPages}
                    </p>
                    <IconButton
                      className='icon-btn'
                      sx={{...style, ml: 2}}
                      size='large'
                      onClick={() => {
                        if (route[mod]?.currentPage != 0)
                          getNextPrevData(
                            mod?.split('--')[0],
                            route[mod]?.currentPage - 1,
                            mod?.split('---')[1],
                            mod?.split('---')[2],
                          );
                      }}
                    >
                      <ArrowLeftIcon />
                    </IconButton>
                    <IconButton
                      className='icon-btn'
                      sx={style}
                      onClick={() => {
                        if (
                          route[mod]?.currentPage + 1 <
                          route[mod]?.totalPages
                        )
                          getNextPrevData(
                            mod?.split('---')[0],
                            route[mod]?.currentPage + 1,
                            mod?.split('---')[1],
                            mod?.split('---')[2],
                          );
                      }}
                      size='large'
                    >
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
                <hr style={{color: '1px solid #f1f1f1'}} />
                <Grid container spacing={2} sx={{mt: '20px', mb: '20px'}}>
                  {route[mod]?.data?.length > 0 &&
                    route[mod]?.data?.map((el, index) => {
                      return (
                        <Grid item xs={4} sm={4} md={3}>
                          <div
                            style={{
                              height: '300px',
                              border: '1px solid #f1f1f1',
                              borderRadius: '20px',
                            }}
                          >
                            <div
                              onClick={() => {
                                setOpenView(true);
                                setObj(el);
                              }}
                              className='pointer'
                              style={{
                                width: '100%',
                                borderBottom: 'solid 1px #f1f1f1',
                                padding: '10px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <img
                                src={'/assets/images/pdficon.svg'}
                                style={{width: '50%'}}
                              />
                            </div>
                            <div style={{padding: '15px'}}>
                              <p
                                style={{
                                  fontWeight: '900',
                                  fontSize: '14px',
                                  marginBottom: '10px',
                                  position: 'relative',
                                }}
                              >
                                <span>{el.title}</span>

                                {user?.userList?.userRole == 'SUPERADMIN' && (
                                  <span
                                    style={{
                                      position: 'absolute',
                                      top: '-10px',
                                      right: '0px',
                                    }}
                                  >
                                    <AppTooltip title='Update'>
                                      <EditIcon
                                        color='primary'
                                        sx={{
                                          visibility:
                                            el?.status == 'ACTIVE'
                                              ? ' '
                                              : 'hidden',
                                        }}
                                        onClick={() => {
                                          // if (el?.status == 'INACTIVE') {
                                          //   return;
                                          // }

                                          setMyEditData(el);
                                          setOpenEditBox(true);
                                        }}
                                      />
                                    </AppTooltip>
                                    <AppTooltip
                                      placement={'bottom'}
                                      title={
                                        el.status == 'ACTIVE'
                                          ? 'Deactivate'
                                          : 'Restore'
                                      }
                                    >
                                      {el.status == 'ACTIVE' ? (
                                        <DeleteForeverIcon
                                          className='pointer'
                                          sx={{
                                            color: '#ce1420',
                                            ml: 1,
                                            opacity:
                                              el.status == 'INACTIVE'
                                                ? '0.3'
                                                : '',
                                          }}
                                          onClick={() => {
                                            let ob = el;
                                            ob.btn = 'INACTIVE';
                                            setMyEditData(ob);
                                            setopenConfirmbox(true);
                                          }}
                                        />
                                      ) : (
                                        <RestoreIcon
                                          className='pointer'
                                          color='primary'
                                          sx={{ml: 1}}
                                          onClick={() => {
                                            let ob = el;
                                            ob.btn = 'ACTIVE';
                                            setMyEditData(ob);
                                            setopenConfirmbox(true);
                                          }}
                                        />
                                      )}
                                    </AppTooltip>
                                  </span>
                                )}
                              </p>
                              <p>{el.description}</p>
                            </div>
                          </div>
                        </Grid>
                      );
                    })}
                </Grid>
              </>
            );
          })}
      </div>
      {open && <Upload setOpen={setOpen} getData={getData} />}
      {openEditBox && (
        <Upload
          setOpen={setOpenEditBox}
          data={myEditData}
          getData={getData}
          // allList={getData()}
        />
      )}
      {openView && <ViewPDF obj={obj} setOpenView={setOpenView} />}
      {openConfirmbox && (
        <Confirm
          open={openConfirmbox}
          header={
            'Confirm to ' +
            (myEditData?.btn == 'ACTIVE' ? 'Restore' : 'Deactivate')
          }
          cnfMsg={`Are you sure, You want to ${
            myEditData?.btn == 'ACTIVE' ? 'restore ' : 'deactivate '
          } it?`}
          handleClose={closeConfirmBox}
        />
      )}
    </div>
  );
};

export default Trainingvideo;
