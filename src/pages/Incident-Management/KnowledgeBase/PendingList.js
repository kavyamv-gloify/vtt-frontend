import React, {useState, useEffect} from 'react';
import {Grid, Box, Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CardView from '../Tickets/CardView';
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import KnowledgeCard from './KnowledgeCard';
import axios from 'axios';
import Api from '@api';
import {useAuthUser} from '@crema/utility/AuthHooks';
import {toast} from 'react-toastify';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AppTooltip from '@crema/core/AppTooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import parse from 'html-react-parser';
const PendingList = ({close}) => {
  const {user} = useAuthUser();
  const [data, setData] = useState();
  const label = {inputProps: {'aria-label': 'Checkbox demo'}};
  function getAllList() {
    axios
      .get(Api.baseUri + '/user-reg/knowledgeBase/getAllByCorporate/PENDING')
      .then((res) => {
        if (res?.data?.status == '200') {
          setData(res?.data?.data);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        setData([]);
      });
  }

  useEffect(() => {
    getAllList();
  }, []);
  const [open, setOpen] = useState(false);
  let template = {
    layout: {
      column: 2,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    // title: 'Bank Type',
    description: 'Form for applying Job',
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'title',
            id: 'title',
            title: 'Title',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'ckeditor',
            name: 'solution',
            id: 'solution',
            title: 'Message',
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
            options: [
              {title: 'Yes', value: 'Yes'},
              {title: 'No', value: 'No'},
            ],
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'category',
            id: 'category',
            title: 'Category',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'file',
            name: 'attachement',
            id: 'attachement',
            title: 'Add Attachement',
            // infoMessage: ["Radio button is selectable", "e.g.: yes"],
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

  function handleChange(e) {
    console.log('e', e?.target?.name, e?.target?.checked);
    if (e?.target?.name == 'all') {
      const isSelected = data?.map((el) => {
        return {...el, checked: e?.target?.checked};
      });

      setData(isSelected);
    } else {
      const isSelected = data.map((el) =>
        el?.id == e?.target?.name ? {...el, checked: e?.target?.checked} : el,
      );
      console.log(isSelected);
      setData(isSelected);
    }
  }
  useEffect(() => {
    console.log('data', data);
    let temp = [];
    data?.map((el) => {
      if (el.checked == false) {
        return;
      }
      temp.push(el?.id);
    });
    console.log('temp', temp);
  }, [data]);
  return (
    <div>
      <Grid container sx={{marginTop: '10px'}}>
        <Grid md={12} sx={{marginTop: '10px'}}>
          <Grid container sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
              variant='contained'
              onClick={() => {
                let temp = [];
                data?.map((el) => {
                  if (el.checked == false) {
                    return;
                  }
                  temp.push(el?.id);
                  let postData = [{
                    id: temp[0],
                    status:"APPROVE"
                  }];
                  axios.post(
                      Api.baseUri + '/user-reg/knowledgeBase/approve',
                      postData
                    )
                    .then((res) => {
                      if (res?.data?.status == '200') {
                        toast.success('Article approved successfully');
                        close();
                      }
                      else{
                        toast.error("Something went wrong!");
                        close();
                      }
                    });
                });
              }}
            >
              Approve
            </Button>
            <Button variant='contained'
             onClick={() => {
              let temp = [];
              data?.map((el) => {
                if (el.checked == false) {
                  return;
                }
                temp.push(el?.id);
                let postData = [{
                  id: temp[0],
                  status:"PENDING"
                }];
                axios.post(
                    Api.baseUri + '/user-reg/knowledgeBase/approve',
                    postData
                  )
                  .then((res) => {
                    if (res?.data?.status == '200') {
                      toast.success('Article rejected successfully');
                      close();
                    }
                    else{
                      toast.error("Something went wrong!");
                      close();
                    }
                  });
              });
            }}
            sx={{marginLeft: '10px'}}>
              Reject
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper}>
          <Table
            sx={{minWidth: 650, tableLayout: 'fixed'}}
            aria-label='simple table'
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    {...label}
                    onChange={handleChange}
                    className='form-check-input'
                    name='all'
                  />
                </TableCell>

                <TableCell sx={{fontWeight: '900', fontSize: '14px'}}>
                  Title
                </TableCell>
                <TableCell sx={{fontWeight: '900', fontSize: '14px'}}>
                  Solution
                </TableCell>
                <TableCell
                  align='right'
                  sx={{fontWeight: '900', fontSize: '14px'}}
                >
                  Attachement
                </TableCell>
                {/* <TableCell align='right'>Carbs&nbsp;(g)</TableCell>
                <TableCell align='right'>Protein&nbsp;(g)</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell>
                    <Checkbox
                      {...label}
                      name={row?.id}
                      checked={row?.checked == true ? true : false}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </TableCell>
                  <TableCell component='th' scope='row'>
                    {row.title}
                  </TableCell>
                  <TableCell
                    // align='right'

                    sx={
                      {
                        overflow: 'hidden',
                        overflowY: 'auto',
                        textOverflow: 'ellipsis',
                        // width: '100px',
                        whiteSpace: 'noWrap',
                      }
                    }
                  >
                    <div
                      // style={{height: '100px', overflowY: 'auto'}}
                      dangerouslySetInnerHTML={{__html: row?.solution}}
                    ></div>
                    {/* {row?.solution} */}
                  </TableCell>
                  <TableCell align='right'>Attachement</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
};

export default PendingList;
