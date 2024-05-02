import React, {useState, useEffect} from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Grid,
  Box,
  Button,
} from '@mui/material';
import SmartForm from '@smart-form';
import axios from 'axios';
import Api from '@api';
import {getFormData} from '@hoc';
import {toast} from 'react-toastify';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import AppTooltip from '@crema/core/AppTooltip';

const Attachement = ({ticketInfo}) => {
  const [showbtn, setshowbtn] = useState(true);
  console.log('arrName', ticketInfo);
  let remarHis = [];
  console.log(
    'ticketInfo 16',
    remarHis.push({
      remarksGivenByName: ticketInfo?.assignedAt,
      remarksAttachement: ticketInfo?.attachement,
    }),
  );
  console.log('remarkHis', remarHis);
  const header = ['Attached By', 'Attachement'];

  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 2, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'file',
            name: 'indentDoc',
            id: 'indentDoc',
            accept: 'image/*,.pdf,.doc,.docx',
            title: 'Upload Attachement',
            validationProps: {
              size: {
                value: 5,
                message: 'File size should not be more than 5 mb.',
              },
            },
          },
        ],
      },
    ],
  };

  const [hideAttach, setHideAttach] = useState(true);

  const getFileName = async (val) => {
    let tem = {
      photo: val?.data?.indentDoc,
    };
    let dataSet;

    Object.keys(tem).map((key) => {
      dataSet = {
        ...dataSet,
        [key]: tem[key][0],
      };
    });

    console.log('dataSet', dataSet);
    let temp = await axios({
      method: 'post',
      url: Api.baseUri + '/user-reg/compliance/save-file',
      data: getFormData(dataSet),
      headers: {'Content-Type': 'multipart/form-data'},
    });
    console.log('temp', temp);
    return temp?.data?.data?.documentName;
  };

  async function handleSubmit(val) {
    console.log('val', val);
    let postData = {};
    postData.id = ticketInfo?.id;
    let myFileName = '';
    if (val?.data?.indentDoc) {
      myFileName = await getFileName(val);
    }

    postData.attachement = myFileName;
    console.log('postData', postData);

    axios
      .post(
        Api.baseUri +
          '/user-reg/incident-management/add-attachement-for-ticket',
        postData,
      )
      .then((res) => {
        if (res?.data?.status == '200') {
          toast.success('Updated Successfully');
          window.location.reload();
        } else {
          toast.error(res?.data?.message || 'Something went Wrong');
        }
      })
      .catch((err) => {
        toast.error('Something went Wrong');
      });
    // await axios({
    //   method: 'put',
    //   url: Api.baseUri + 'user-reg/incident-management/add-attachement-for-ticket',
    //   data: getFormData(postData),
    //   headers: {'Content-Type': 'multipart/form-data'},
    // }).then((res) => {
    //   if (res?.data?.status == '200') {
    //     debugger
    //     toast.success('Updated Successfully');
    //     console.log("res?.data", res?.data)
    //     setHideAttach(false)
    //   }
    // })
  }
  return (
    <div>
      <Grid container sx={{padding: '0px 20px 0px 20px'}}>
        <Grid
          item
          xs={12}
          md={10}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItem: 'center',
            marginTop: '10px',
          }}
        >
          <TableContainer
            style={{
              boxShadow:
                'rgba(0, 0, 0, 0) 0px 2px 4px, rgba(0, 0, 0, 0) 0px 7px 13px -3px, rgb(0,102,133) 0px -3px 0px inset',
            }}
          >
            <Table sx={{minWidth: 650}} aria-label='simple table'>
              <TableHead style={{background: '#f1f1f1'}}>
                <TableRow>
                  {header?.map((el) => {
                    return <TableCell> {el} </TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {remarHis?.length ? (
                  remarHis?.map((el, i) => {
                    return (
                      <TableRow
                        style={{background: i % 2 == 0 ? '' : '#f5f7ff'}}
                      >
                        <TableCell> {el?.remarksGivenByName} </TableCell>
                        <TableCell>
                          {' '}
                          <a>
                            {el?.remarksAttachement?.split('/')?.[2] ||
                              el?.remarksAttachement?.split('/')}
                          </a>
                          {console.log(
                            'remarkName',
                            el?.remarksAttachement?.split('/')?.[2] ||
                              el?.remarksAttachement?.split('/'),
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={10}>
                      No Records Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter></TableFooter>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      {hideAttach && (
        <div>
          <SmartForm
            template={template}
            onSubmit={handleSubmit}
            onChange={getFileName}
            showbtn={showbtn}
            buttons={['submit']}
          />
        </div>
      )}
    </div>
  );
};

export default Attachement;
