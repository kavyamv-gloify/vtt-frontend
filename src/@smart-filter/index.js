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
import _ from 'lodash';
const SmartFilter = ({fieldList, open, handleClose, title, setFilter}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,

    formState: {errors},
  } = useForm({});
  const [operatorList, setOperatorList] = useState([
    {title: 'OR', value: '$or'},
    {title: 'AND', value: '$and'},
  ]);
  const [operatorVal, setOperatorVal] = useState({});
  const [valType, setValType] = useState({});
  const [fieldVal, setFieldVal] = useState({});
  const [searchVal, setsearchVal] = useState({});
  const [error, setError] = useState(false);
  const [keyword, setKeyword] = useState('fromDate');
  useEffect(() => {
    if (!operatorList.length) return;
    setOperatorVal({...operatorVal, [0]: operatorList[1]});
    append();
  }, [operatorList]);
  useEffect(() => {
    console.log('searchVal[index]', searchVal);
  }, [searchVal]);

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
              if (_.isEmpty(searchVal)) {
                setError(true);
                return;
              }
              let arr = [];
              fields?.map((el, i) => {
                if (searchVal[i])
                  arr.push({
                    fieldOperator: operatorVal[i]?.value || '$and',
                    field: fieldVal[i]?.value,
                    valueOperator: valType[i]?.value,
                    value:
                      fieldVal[i]?.value == 'profileStatus'
                        ? searchVal[i].toUpperCase() == 'NOT VERIFIED'
                          ? 'DEFAULT'
                          : 'ACTIVE'
                        : searchVal[i],
                  });
              });
              // console.log('arr', [...arr]);
              setFilter([...arr]);
              handleClose();
            })}
          >
            {fields.map((item, index) => (
              <span key={item.id}>
                <Grid container spacing={2} sx={{mt: 4}}>
                  <Grid item xs={12} sm={2} md={2}>
                    {
                      <Autocomplete
                        size='small'
                        id='tags-outlined'
                        options={operatorList || []}
                        disabled={index == 0 && fields.length == 1}
                        value={operatorVal[index]}
                        onChange={(e, v, r) => {
                          setOperatorVal({...operatorVal, [index]: v});
                        }}
                        getOptionLabel={(option) => option.title}
                        sx={{width: '100%'}}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size='small'
                            variant='outlined'
                            label={'Operator'}
                            fullWidth
                          />
                        )}
                      />
                    }
                  </Grid>
                  <Grid item xs={12} sm={3} md={3}>
                    <Autocomplete
                      size='small'
                      id='tags-outlined'
                      options={fieldList || []}
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
                  <Grid item xs={12} sm={3} md={3}>
                    <Autocomplete
                      size='small'
                      id='tags-outlined'
                      options={[
                        {title: 'Equal', value: '$eq'},
                        {title: 'Contains', value: '$regex'},
                      ]}
                      value={valType[index]}
                      onChange={(e, v, r) => {
                        setValType({...valType, [index]: v});
                      }}
                      getOptionLabel={(option) => option.title}
                      sx={{width: '100%'}}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size='small'
                          variant='outlined'
                          label={'Value Type'}
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    md={3}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                    }}
                  >
                    <TextField
                      fullWidth
                      label={'Search Value'}
                      size='small'
                      error={error}
                      // error={_.isEmpty(searchVal) ? true : false}
                      // type={keyword == 'fromDate' ? 'date' : ' '}
                      autoComplete='off'
                      sx={{mr: 2}}
                      value={searchVal[index]}
                      onInput={(e) => {
                        setsearchVal({...searchVal, [index]: e.target.value});
                      }}
                      {...register(`test.${index}.lastName`)}
                    />
                    <p style={{color: 'red'}}>
                      {error == true ? 'This is a required field' : ' '}
                    </p>
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

export default SmartFilter;
