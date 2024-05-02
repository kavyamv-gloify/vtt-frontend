import React, {useEffect, useState} from 'react';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import SmartTable from '@smart-table';
import Confirm from '@confirmation-box';
import AppTooltip from '@crema/core/AppTooltip';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import Api from '@api';
import CustomLabel from 'pages/common/CustomLabel';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
const tableTemplate = {
  columns: [
    {
      title: 'Group Name',
      field: 'complianceGroupName',
    },
    {
      title: 'Topic',
      field: 'topicNameKey',
    },
    {
      title: 'Sub Topics',
      field: 'complianceSubTopicList',
      render: (rd) => {
        let arr = [];
        rd?.complianceSubTopicList?.map((el) => {
          arr.push(el.subTopicName);
        });
        return arr?.join(', ');
      },
    },
    {
      title: 'Compliance For',
      field: 'complianceType',
    },

    {
      title: 'Available For',
      field: 'accessTo',
      render: (rd) => rd?.accessTo?.join(', '),
    },
  ],
};

const Listing = () => {
  const [openDial, setOpenDial] = useState(false);
  const [selectedCompliances, setSelectedCompliances] = useState();
  const [complianceList, setComplianceList] = useState([]);
  const [complianceListTem, setComplianceListTem] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [data, setData] = useState([]);
  const [delId, setDelId] = useState();
  const {id} = useParams();
  useEffect(() => {
    setSelectedCompliances(null);
    setComplianceListTem([]);
  }, [openDial]);
  function closeConfirmBox(d) {
    setDelId('');
    if (d == 'YES') {
      axios
        .post(
          Api.baseUri +
            '/user-reg/compliance-topic/assign-compliance-topic-corporate?topicsId=&corporate=' +
            id +
            '&removeTopicsId=' +
            delId,
          {},
        )
        .then((res) => {
          if (res?.data?.status == '200') {
            toast.success('Compliance removed successfully.');
            getAll();
          } else {
            toast.error(res?.data?.message || 'Something went wrong.');
          }
        })
        .catch((er) => {
          toast.error('Something went wrong.');
        });
    }
  }
  useEffect(() => {
    getAll();
  }, [id]);
  function getAll() {
    axios
      .get(
        Api.baseUri +
          '/user-reg/compliance-topic/get-compliance-topic-bycorporateid/' +
          id,
      )
      .then((res) => {
        setData(res?.data?.data || []);
      })
      .catch(() => {
        setData([]);
      });
    axios
      .get(Api.baseUri + '/user-reg/compliance/getAllByStatus/ACTIVE')
      .then((re) => {
        let tem = [];
        console.log("res========", re)
        re?.data?.data.map((ele) => {
          tem.push({title: ele.name, value: ele.id});
        });
        setGroupList(tem || []);
      })
      .catch((er) => {
        setGroupList([]);
      });
    axios
      .get(
        Api.baseUri +
          '/user-reg/compliance-topic/get-compliance-topic-not-assigned-to-corporateId/' +
          id,
      )
      .then((res) => {
        console.log("res", res)
        let arr = [];
        res?.data?.data?.map((el) => {
          arr.push({
            title: el.topicNameKey,
            value: el.id,
            gId: el.complianceGroupId,
          });
        });
        
        setComplianceList(arr || []);
      })
      .catch(() => {
        setComplianceList([]);
      });
  }
  return (
    <div>
      <Grid container spacing={2} sx={{mb: 6}} className='page-header-second'>
        <Grid item xs={8}>
          <CustomLabel labelVal="Compliances' List" variantVal='h3-underline' />
        </Grid>
        <Grid item xs={4}>
          <Box display='flex' justifyContent='flex-end'>
            <div className='left-seperator'>
              <AppTooltip placement={'top'} title={'Associate New Compliance'}>
                <img
                  src='/assets/images/title-icon/add vehicle variant.svg'
                  className='title-icons-mui'
                  onClick={() => {
                    setOpenDial(true);
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
        data={data}
        options={{
          search: false,
          showTitle: false,
          selection: false,

          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (data) => ({
            icon: () => (
              <CancelScheduleSendIcon
                color='primary'
                style={{
                  color: '#bc0805',
                }}
              />
            ),
            tooltip: 'Remove',
            onClick: (event, rowData) => {
              setDelId(rowData.id);
            },
          }),
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
      {delId && (
        <Confirm
          open={true}
          header={'Confirm to Remove'}
          cnfMsg={'Are you sure, You want to remove it?'}
          handleClose={closeConfirmBox}
        />
      )}
      {openDial && (
        <Dialog
          onClose={() => {
            setOpenDial(false);
          }}
          open={true}
          PaperProps={{
            sx: {
              width: '600px',
            },
          }}
          style={{borderRadius: '4rem'}}
        >
          <DialogTitle
            style={{
              background: '#f5f2f2',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h1>Associate Compliance</h1>
            <CloseIcon
              onClick={() => {
                setOpenDial(false);
              }}
              style={{color: '#4f4f4f', fontWeight: 'bold'}}
            />
          </DialogTitle>
          <DialogContent>
            <div style={{paddingTop: '20px', width: '100%'}}>
              <h5>
                Select Groups <span style={{color: 'red'}}>*</span>
              </h5>
              <Autocomplete
                name='vendorId'
                // value={selectedCompliances || []}
                options={groupList || []}
                getOptionLabel={(option) => option.title}
                onChange={(e, data) => {
                  let tempo = [];
                  complianceList?.map((ele) => {
                    if (ele.gId == data?.value) {
                      tempo.push(ele);
                    }
                  });
                  setComplianceListTem([...tempo]);
                  setSelectedCompliances([]);
                  // setSelectedCompliances(data);
                }}
                size='small'
                id='combo-box-demo'
                sx={{width: '100%', mt: 2, mb: 4}}
                renderInput={(params) => {
                  return (
                    <TextField {...params} id='outlined-error-helper-text' />
                  );
                }}
              />
              <h5>
                Select Compliances <span style={{color: 'red'}}>*</span>
              </h5>
              <Autocomplete
                name='vendorId'
                multiple
                value={selectedCompliances || []}
                options={complianceListTem || []}
                limitTags={3}
                getOptionLabel={(option) => option.title}
                // disablePortal
                onChange={(e, data) => {
                  setSelectedCompliances(data);
                }}
                size='small'
                id='combo-box-demo'
                sx={{width: '100%', mt: 2}}
                renderInput={(params) => {
                  return (
                    <TextField {...params} id='outlined-error-helper-text' />
                  );
                }}
              />
              <div style={{width: '100%', textAlign: 'center'}}>
                <Button
                  sx={{mt: 6}}
                  disabled={
                    !selectedCompliances || !selectedCompliances?.length
                  }
                  variant='contained'
                  onClick={() => {
                    setOpenDial(false);
                    let arr = [];
                    selectedCompliances?.map((el) => {
                      arr.push(el.value);
                    });
                    axios
                      .post(
                        Api.baseUri +
                          '/user-reg/compliance-topic/assign-compliance-topic-corporate?topicsId=' +
                          arr.join() +
                          '&corporate=' +
                          id +
                          '&removeTopicsId=',
                        {},
                      )
                      .then((res) => {
                        if (res?.data?.status == '200') {
                          toast.success('Compliance associated successfully.');
                          getAll();
                        } else {
                          toast.error(
                            res?.data?.message || 'Something went wrong.',
                          );
                        }
                      })
                      .catch(() => {
                        toast.error('Something went wrong.');
                      });
                  }}
                >
                  Associate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Listing;
