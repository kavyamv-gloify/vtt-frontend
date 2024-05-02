import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {useForm, useFieldArray, Controller} from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import {IconButton} from '@mui/material';
import AppTooltip from '@crema/core/AppTooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const DriverAttendanceFilter = ({
  fieldList,
  open,
  handleClose,
  title,
  setFilter,
}) => {
  const {register, control, handleSubmit, reset, trigger, setError} = useForm(
    {},
  );
  const [operatorList, setOperatorList] = useState([
    {title: 'OR', value: '$or'},
    {title: 'AND', value: '$and'},
  ]);
  const [operatorVal, setOperatorVal] = useState({});
  const [valType, setValType] = useState({});
  const [fieldVal, setFieldVal] = useState({});
  const [searchVal, setsearchVal] = useState({});
  useEffect(() => {
    if (!operatorList.length) return;
    setOperatorVal({...operatorVal, [0]: operatorList[1]});
    append();
  }, [operatorList]);
  const {fields, append, remove} = useFieldArray({control, name: 'test'});
  return (
    <div>
      <Dialog
        className='yourClassName'
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '800px',
          },
        }}
        open={open}
        onClose={() => {
          handleClose('NO');
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle
          id='alert-dialog-title'
          style={{background: '#ededed', color: '#343434'}}
        >
          <h1>{title}</h1>
          <div
            style={{
              cursor: 'pointer',
              position: 'absolute',
              top: '12px',
              right: '14px',
            }}
            onClick={() => {
              handleClose('NO');
            }}
          >
            <CloseIcon />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className='smart-filter-head'>
            <div
              className='cursor'
              style={{
                color: '#098fdc',
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'center',
              }}
              onClick={() => {
                setOperatorVal({
                  ...operatorVal,
                  [fields?.length]: operatorList[1],
                });
                append();
              }}
            >
              <AddIcon sx={{fontSize: '14px'}} />
              <span style={{fontSize: '12px'}}>Add More</span>
            </div>
          </div>
          <form
            style={{marginTop: '35px'}}
            onSubmit={handleSubmit((data) => {
              let arr = [];
              fields?.map((el, i) => {
                if (searchVal[i])
                  arr.push({
                    field: fieldVal[i]?.value,
                    value: searchVal[i],
                  });
              });
              console.log([...arr]);
              var mapped = arr.map((item) => ({[item.field]: item.value}));
              var newObj = Object.assign({}, ...mapped);
              console.log(newObj);
              let postData = {};
              postData = newObj;
              setFilter(postData ?? {});
              //   handleClose();
            })}
          >
            {fields.map((item, index) => (
              <span key={item.id}>
                <Grid container spacing={2} sx={{mt: 4}}>
                  <Grid item xs={12} sm={3} md={5.5}>
                    <Autocomplete
                      size='small'
                      id='tags-outlined'
                      options={[
                        {title: 'From Date', value: 'fromDate'},
                        {title: 'To date', value: 'toDate'},
                        {title: 'Drivaer Name', value: 'driverName'},
                        {title: 'Driver Mobile No.', value: 'driverMobNo'},
                        {title: 'Vendor Name', value: 'vendorName'},
                        {title: 'Status', value: 'status'},
                      ]}
                      value={fieldVal[index]}
                      onChange={(e, v, r) => {
                        setFieldVal({...fieldVal, [index]: v});
                      }}
                      getOptionLabel={(option) => option.title}
                      sx={{width: '100%'}}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          variant='outlined'
                          label={'Field'}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} md={5.5}>
                    <TextField
                      fullWidth
                      label={'Search Value'}
                      size='small'
                      autoComplete='off'
                      sx={{mr: 2}}
                      value={searchVal[index]}
                      onInput={(e) => {
                        setsearchVal({...searchVal, [index]: e.target.value});
                      }}
                      {...register(`test.${index}.lastName`)}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={1}
                    md={1}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {fields.length > 1 && (
                      <>
                        <AppTooltip title='Remove' placement='bottom'>
                          <IconButton onClick={() => remove(index)}>
                            <ClearIcon
                              sx={{fontSize: '16px', color: '#bc0906'}}
                            />
                          </IconButton>
                        </AppTooltip>
                      </>
                    )}
                  </Grid>
                </Grid>
              </span>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '15px',
              }}
            >
              <Button id='btnMui123' variant='contained' type='submit'>
                Filter
              </Button>
              {/* <Button id='btnMui123' sx={{ml:2}} variant='contained' onClick={()=>{setFilter({}); setOperatorVal({}); setFieldVal({}); setsearchVal({});}} >Clear</Button> */}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverAttendanceFilter;
