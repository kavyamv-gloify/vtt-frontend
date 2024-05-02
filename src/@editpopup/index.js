import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import SmartForm from '@smart-form';
import AppLoader from '@crema/core/AppLoader';
import CloseIcon from '@mui/icons-material/Close';

const PopEdit = ({
  seterrors,
  openDialog,
  setopenDialog,
  showbtn,
  pageTitle,
  popAction,
  template,
  poptemplate,
  defaultValues,
  oldFormType,
  getOnInput,
  setVal,
  clearErr,
  title,
  SecretFun,
  onChange,
  setSuccessIcon,
}) => {
  const [dropdownVal, setDropdownVal] = useState({});
  const [innertemplate, setInnerTemplate] = useState({});
  const [fieldList, setFieldList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [tempDefaultValues, setTempDefaultValues] = useState(defaultValues);

  useEffect(() => {
    if (showbtn) setLoader(false);
  }, [showbtn]);
  useEffect(() => {
    let temArr = [];
    if (oldFormType == 'STEPPER') {
      template?.steps?.map((old) => {
        old?.form?.sections[0].fields?.map((tem) => {
          if (tem?.type != 'hidden') {
            if (tem?.type == 'section')
              temArr.push({title: tem?.sectiontitle, value: tem?.sectionName});
            else temArr.push({title: tem?.title, value: tem?.name});
          }
        });
      });
    } else {
      poptemplate?.fields?.length &&
        poptemplate?.fields?.map((tem, ind) => {
          //
          if (tem?.type != 'hidden') {
            if (tem?.type == 'section')
              temArr.push({title: tem?.sectiontitle, value: tem?.sectionName});
            else temArr.push({title: tem?.title, value: tem?.name});
          }
        });
    }
    setFieldList(temArr);
  }, [template, poptemplate]);

  useEffect(() => {
    let temField = [];
    if (oldFormType == 'STEPPER') {
      template?.steps?.map((old) => {
        old?.form?.sections[0].fields?.map((op) => {
          if (
            ((op?.type == 'section' && op?.sectionName == dropdownVal?.value) ||
              (op?.type != 'section' && op?.name == dropdownVal?.value)) &&
            op?.type != 'hidden'
          ) {
            temField.push(op);
            return;
          }
        });
      });
    } else {
      poptemplate?.fields?.map((op) => {
        if (
          ((op?.type == 'section' && op?.sectionName == dropdownVal?.value) ||
            (op?.type != 'section' && op?.name == dropdownVal?.value)) &&
          op?.type != 'hidden'
        ) {
          temField.push(op);
          return;
        }
      });
    }
    setInnerTemplate({
      layout: {
        column: 1,
        spacing: 1,
        size: 'medium',
        label: 'fixed',
        type: 'grid',
      },
      description: 'Form for applying Job',
      sections: [
        {
          layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
          id: 'personal_information',
          fields: temField,
        },
      ],
    });
  }, [dropdownVal]);

  const handleSubmit = (val) => {
    popAction(val);
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
    }, 5000);
  };
  const handleCancel = (val) => {
    popAction({close: true});
  };
  function handleChange(val) {
    if (onChange) {
      onChange(val);
    }
  }

  return (
    <Dialog
      open={openDialog}
      aria-labelledby='alert-dialog-title'
      PaperProps={{
        sx: {
          width: '600px',
        },
      }}
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle
        id='alert-dialog-title'
        style={{
          backgroundColor: '#f4f2f2',
          marginBottom: '10px',
          textAlign: 'left',
          fontSize: '22px',
          color: 'black',
          fontWeight: '600',
        }}
      >
        <span>{pageTitle ?? title}</span>
        <span
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: '12px',
            top: '10px',
          }}
        >
          <CloseIcon
            onClick={(e) => {
              handleCancel();
              setopenDialog(false)
            }}
          />
        </span>
      </DialogTitle>
      <DialogContent style={{minWidth: '500px', minHeight: '100px'}}>
        {loader ? <AppLoader /> : null}
        <DialogContentText id='alert-dialog-description'>
          {/* <h1 style={{color:'black', marginBottom:"1.5rem", }}>{title}</h1> */}
          <label
            htmlFor={'selectBox'}
            style={{fontSize: '14px', width: '100%'}}
          >
            Select field
          </label>
          <Autocomplete
            id='selectBox'
            name='selectBox'
            // disabled={deptList?.length == 1}
            freeSolo
            onChange={(e, option, v) => {
              if (v == 'clear') {
                setDropdownVal({});
              } else {
                setDropdownVal(option);
              }
            }}
            // value={realdeptname ? realdeptname : null}
            options={fieldList ?? []}
            style={{background: '#fff'}}
            InputProps={{disableUnderline: true}}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField
                {...params}
                style={{fontWeight: 'bold'}}
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                }}
              />
            )}
          />
          <SmartForm
            template={innertemplate}
            defaultValues={tempDefaultValues}
            buttons={dropdownVal?.value ? ['update'] : null}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            onChange={handleChange}
            setVal={setVal}
            SecretFun={SecretFun}
            getOnInput={getOnInput}
            setSuccessIcon={setSuccessIcon}
            clearErr={clearErr}
            success={showbtn}
            seterrors={seterrors}
            mode={'onTouched'}
          />
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default PopEdit;
