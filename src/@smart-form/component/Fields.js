/* eslint-disable */
import React, {useState, useEffect} from 'react';
import {makeStyles} from '@mui/styles';
import {useTheme} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import TableCell from '@mui/material/TableCell';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import CancelIcon from '@mui/icons-material/Cancel';
import {Controller} from 'react-hook-form';
import FieldArray from './FieldArray';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Table from './Table';
import Map from '../GoogleMap';
import Mappl from '../GoogleMap/mappl';
import Gmap from '../GoogleMap/gmap';
import _ from '../lodash';
import Tooltip from '@mui/material/Tooltip';
// import CKEditor from 'react-ckeditor-component';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {matchSorter} from 'match-sorter';
import Autocomplete from '@mui/lab/Autocomplete';
import {unregister} from '../serviceWorker';
import Attachment from '../Attachment';
import {Title} from '@mui/icons-material';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import isWeekend from 'date-fns/isWeekend';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OtpInput from 'react-otp-input';
import {Box, InputAdornment} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import {MuiOtpInput} from 'mui-one-time-password-input';
import downDoc from '@common/fileDownload';
import Switch from '@mui/material/Switch';
import AppTooltip from '@crema/core/AppTooltip';
// import { InputBase } from '@mui/material';
import {styled} from '@mui/material/styles';
const hoursOption = [
  {title: '00', value: '00'},
  {title: '01', value: '01'},
  {title: '02', value: '02'},
  {title: '03', value: '03'},
  {title: '04', value: '04'},
  {title: '05', value: '05'},
  {title: '06', value: '06'},
  {title: '07', value: '07'},
  {title: '08', value: '08'},
  {title: '09', value: '09'},
  {title: '10', value: '10'},
  {title: '11', value: '11'},
  {title: '12', value: '12'},
  {title: '13', value: '13'},
  {title: '14', value: '14'},
  {title: '15', value: '15'},
  {title: '16', value: '16'},
  {title: '17', value: '17'},
  {title: '18', value: '18'},
  {title: '19', value: '19'},
  {title: '20', value: '20'},
  {title: '21', value: '21'},
  {title: '22', value: '22'},
  {title: '23', value: '23'},
];
const minsOption = [
  {title: '00', value: '00'},
  {title: '01', value: '01'},
  {title: '02', value: '02'},
  {title: '03', value: '03'},
  {title: '04', value: '04'},
  {title: '05', value: '05'},
  {title: '06', value: '06'},
  {title: '07', value: '07'},
  {title: '08', value: '08'},
  {title: '09', value: '09'},
  {title: '10', value: '10'},
  {title: '11', value: '11'},
  {title: '12', value: '12'},
  {title: '13', value: '13'},
  {title: '14', value: '14'},
  {title: '15', value: '15'},
  {title: '16', value: '16'},
  {title: '17', value: '17'},
  {title: '18', value: '18'},
  {title: '19', value: '19'},
  {title: '20', value: '20'},
  {title: '21', value: '21'},
  {title: '22', value: '22'},
  {title: '23', value: '23'},
  {title: '24', value: '24'},
  {title: '25', value: '25'},
  {title: '26', value: '26'},
  {title: '27', value: '27'},
  {title: '28', value: '28'},
  {title: '29', value: '29'},
  {title: '30', value: '30'},
  {title: '31', value: '31'},
  {title: '32', value: '32'},
  {title: '33', value: '33'},
  {title: '34', value: '34'},
  {title: '35', value: '35'},
  {title: '36', value: '36'},
  {title: '37', value: '37'},
  {title: '38', value: '38'},
  {title: '39', value: '39'},
  {title: '40', value: '40'},
  {title: '41', value: '41'},
  {title: '42', value: '42'},
  {title: '43', value: '43'},
  {title: '44', value: '44'},
  {title: '45', value: '45'},
  {title: '46', value: '46'},
  {title: '47', value: '47'},
  {title: '48', value: '48'},
  {title: '49', value: '49'},
  {title: '50', value: '50'},
  {title: '51', value: '51'},
  {title: '52', value: '52'},
  {title: '53', value: '53'},
  {title: '54', value: '54'},
  {title: '55', value: '55'},
  {title: '56', value: '56'},
  {title: '57', value: '57'},
  {title: '58', value: '58'},
  {title: '59', value: '59'},
];
function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const SwitchToggle = styled(Switch)(({theme}) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));
export const FieldWrapper = ({type, content, attr}) => {
  //
  //
  //
  if (type && type == 'table') {
    return (
      <TableCell
        className='p-4'
        component='th'
        scope='row'
        style={{verticalAlign: 'top'}}
      >
        {content}
      </TableCell>
    );
  } else if (type && type == 'flex') {
    return <div {...attr}>{content}</div>;
  } else {
    return (
      <Grid item {...attr}>
        {content}
      </Grid>
    );
  }
};

function todayDate() {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
function myCustomDate(dat) {
  var d = new Date(dat),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}
const today = new Date();

const useStyles = makeStyles((theme) => ({
  cell: {
    align: 'center',
    padding: 8,
  },
  rootFirstSelect: {
    padding: '14px',
  },
  rootSecondSelect: {
    padding: '10px 80px',
  },
  label: {
    display: 'inline-block',
    marginBottom: '8px',
  },
  formTitle: {
    background: '#ff000000',
    color: '#000',
    textAlign: 'left',
    padding: '8px 0px',
    borderRadius: '5px',
    marginBottom: '16px',
    fontSize: '24px',
    fontWeight: '600',
  },
  sectionTitle: {
    background: '#ff0000',
    color: '#fff',
    textAlign: 'center',
    padding: '8px 14px',
    borderRadius: '5px',
    marginBottom: '16px',
    fontSize: '20px',
    fontWeight: '600',
  },
  button: {
    margin: 5,
  },
  btnContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formControl: {
    margin: useTheme().spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: useTheme().spacing(3),
  },
  attachFile: {
    border: '1px solid #c4c4c4',
    borderRadius: '4px',
    '& label': {
      width: '100%',
      padding: '18px 14px',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    '& img': {
      display: 'inline-block',
      marginRight: '10px',
    },
    '&:hover': {
      border: '1px solid #767676',
    },
  },
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, multiselect) {
  return {
    fontWeight:
      multiselect.indexOf(name) === -1
        ? useTheme().typography.fontWeightRegular
        : useTheme().typography.fontWeightMedium,
  };
}

function validator(v1, sm1, v2) {
  if (sm1 == 'domainCheck') {
    let mailId = '@' + v1?.split('@')[1];
    let v2arr;
    if (typeof v2 == 'string') {
      v2arr = v2?.split(',');
    } else v2arr = v2;
    return v2arr?.includes(mailId);
  }
  if (sm1 == '>') {
    if (v1 && Number(v1) != NaN && Number(v2) != NaN) {
      return Number(v1) > Number(v2);
    }
    return v1 > v2;
  } else if (sm1 == '<') {
    if (v1 && Number(v1) != NaN && Number(v2) != NaN) {
      return Number(v1) < Number(v2);
    }
    return v1 < v2;
  } else if (sm1 == '==') {
    if (v1 && Number(v1) != NaN && Number(v2) != NaN) {
      return Number(v1) == Number(v2);
    }
    return v1 == v2;
  } else if (sm1 == '===') {
    if (v1 && Number(v1) != NaN && Number(v2) != NaN) {
      return Number(v1) === Number(v2);
    }
    return v1 === v2;
  } else if (sm1 == '!=') {
    if (v1 && Number(v1) != NaN && Number(v2) != NaN) {
      return Number(v1) != Number(v2);
    }
    return v1 != v2;
  } else if (sm1 == '!==') {
    if (v1 && Number(v1) != NaN && Number(v2) != NaN) {
      return Number(v1) !== Number(v2);
    }
    return v1 !== v2;
  } else if (sm1 == '<=') {
    if (v1 && Number(v1) != NaN && Number(v2) != NaN) {
      return Number(v1) <= Number(v2);
    }
    return v1 <= v2;
  } else if (sm1 == '>=') {
    if (v1 && Number(v1) != NaN && Number(v2) != NaN) {
      return Number(v1) >= Number(v2);
    }
    return v1 >= v2;
  }
  // else if (sm1 == '!='){
  // 	v1 != v2;
  // }
}

function Fields({
  register,
  errors,
  clickedHere,
  watch,
  control,
  SecretFunc,
  setValue,
  formData,
  setVal,
  clearErr,
  seterrors,
  setSuccessIcon,
  setError,
  clearErrors,
  getValues,
  onChange,
  myInd,
  // onBlur,
  disabled,
  readOnly,
  defaultValues,
  fields,
  layout,
  reset,
  path,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [values, setValues] = useState({});
  const [greenIcon, setGreenIcon] = useState([]);
  const [multiSelect, setMultiSelect] = useState([]);
  const [inputAutoValue, setInputAutoValue] = useState(null);
  const [age, setAge] = React.useState('+91');
  const [open, setOpen] = React.useState(false);
  const [checkLabel, setCheckLabel] = useState({});
  const [otp, setOtp] = useState([]);

  const handleChanges = (event) => {
    setAge(event.target.value);
  };

  // useEffect(()=>{   },[formData])

  function bindObjArr(arr) {
    let tem = [];
    arr?.map((d) => {
      tem?.push(d?.value);
    });
    return tem;
  }
  useEffect(() => {
    setVal?.length &&
      setVal?.map((d) => {
        if (d?.name && d?.value) {
          // && d?.value
          setValue(d?.name, d?.value);
        }
        if (d?.name && d?.value === 0) {
          setValue(d?.name, d?.value);
        }
        if (d?.name && d?.value === '') {
          setValue(d?.name, d?.value);
        }
      });
  }, [setVal]);

  // useEffect(() => {
  // 	setValues(values)

  // }, [values])
  useEffect(() => {
    clearErr?.length &&
      clearErr?.map((d) => {
        if (d?.name && d?.value) {
          clearErrors(d?.name);
        }
      });
  }, [clearErr]);

  useEffect(() => {
    if (seterrors && !_.isEmpty(seterrors)) {
      seterrors?.length &&
        seterrors?.map((d) => {
          if (d?.error) {
            setError(d?.name, {
              type: d?.type ?? 'customized',
              message: d?.message,
            });
          }
        });
    }
  }, [seterrors]);

  useEffect(() => {
    let arr = [];
    setSuccessIcon?.length &&
      setSuccessIcon?.map((d) => {
        if (d?.name && d?.value) {
          arr.push(d?.name);
        }
      });
    setGreenIcon(arr);
  }, [setSuccessIcon]);
  let {xsv, spacing, size} = layout;

  const fxsv = (column) => {
    return column == 1
      ? 12
      : column == 2
      ? 6
      : column == 3
      ? 4
      : column == 6
      ? 2
      : 12;
  };
  const fspacing = (space) => {
    return space || 2;
  };
  const fsize = (sz) => {
    return sz || '';
  };

  const handelChange = (name, value) => {
    //
    let val = values;
    val = {
      ...val,
      [name]: value,
    };
    //
    if (onChange) {
      onChange(val);
    }
    setValues({...val});
  };

  const handelSaveValue = (name, value, d) => {
    setValue(name, value);
  };
  const handleOtpChange = (
    index,
    value,
    name,
    boxarr,
    e,
    minBoxReq,
    pattern,
  ) => {
    // Create a copy of the current OTP or boxarr
    // console.log(boxarr?.length, 'leela');
    // const newOtp = otp?.length ? [...otp] : [...boxarr];
    // Calculate the total value of the input fields
    const totalValue = watch(name)
      ?.filter((eee) => eee)
      .join('');
    // Check if the total value is less than 6 characters
    if (
      !pattern?.value?.test(`${totalValue}`) ||
      totalValue.length <= minBoxReq - 1
    ) {
      // console.log('Entered');
      setError(name, {
        type: 'custom error',
        message: pattern?.message,
      });
    } else {
      clearErrors(name);
    }
    const regex = /^[a-zA-Z0-9]*$/;

    if (value && regex.test(value) && e.key !== 'Backspace') {
      // Update the OTP array
      boxarr[index] = value.toUpperCase()[0];
      // setOtp(newOtp);

      // Update the form value
      setValue(`${name}[${index}]`, value.toUpperCase()[0]);

      // console.log(watch(name), 'valuevaluevaluevaluevalue');

      // Move focus to the next input element if not exceeding 10 boxes
      if (index < boxarr?.length) {
        const nextInput = document.getElementById(`${name}${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (e.key === 'Backspace' && index >= 0) {
      // Handle Backspace key
      boxarr[index] = ''; // Clear the current digit
      // console.log('boxarr', boxarr, index);
      // setOtp(newOtp);
      setValue(`${name}[${index}]`, '');
      const prevInput = document.getElementById(`${name}${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handelChangeCkEditor = (name, value) => {};

  const calculation = ({field, name}) => {
    let start = _.some(field.calculation.from, _.method('includes', '*'));
    let forThis = _.some(field.calculation.from, _.method('includes', 'this*'));
    let watchValues = [];
    let watchArrayValue = [];
    let onerowdata = {};
    let arrttname = name.split(/\.(?=[^\.]+$)/);
    field.calculation.from.forEach((val) => {
      if (val.includes('*')) {
        if (val.includes('this*')) {
          onerowdata = watch(arrttname[0]);
          var flname = val.split('*')[1];
          watchValues.push(Number(onerowdata[flname]));
        } else {
          watchArrayValue = watch(val.split('*')[0]);
          watchArrayValue &&
            watchArrayValue.forEach((av) => {
              watchValues.push(Number(av[val.split('*')[1]]));
            });
        }
      } else {
        let wf = watch(val);
        watchValues.push(Number(wf));
      }
    });

    if (field.calculation.type == 'add') {
      let calc = 0;
      if (watchValues.length) {
        watchValues.forEach((val) => {
          if (val) {
            calc += val;
          }
        });
      }
      if (watch(name) !== calc) {
        setValue(name, calc);
      }
      return calc || 0;
    } else if (field.calculation.type == 'multiplication') {
      let calc = 1;
      if (watchValues.length) {
        watchValues.forEach((val) => {
          if (val) {
            calc *= val;
          }
        });
      }
      if (watch(name) !== calc) {
        setValue(name, calc);
      }
      return calc || 0;
    } else if (field.calculation.type == 'division') {
      let calc = 0;
      if (watchValues.length) {
        watchValues.forEach((val) => {
          if (val) {
            calc /= val;
          }
        });
      }
      if (watch(name) !== calc) {
        setValue(name, calc);
      }
      return calc || 0;
    }
  };

  return (
    <>
      {fields.map((field) => {
        let preValue = {};
        let {
          title,
          type,
          name,
          validationProps,
          dynamic,
          disDate,
          options,
          defaultValue,
          // setVal,
          object,
          from,
          buttonFor,
          min,
          max,
          maxVal,
          maxlength,
          minlength,
          bind,
          widget,
          multiple,
          inputiconurl,
          multilimit,
          infoMessage,
          boxheight,
          isSMS,
          isProfile,
          input_type,
          blocks,
          accept,
          isCheckBox,
          maxSize,
          subFields,
          isUpper,
          isLower,
          isNumber,
          isSpace,
          maxChar,
          boxarr,
          spaceAfter,
          minBoxReq,
          fixedValue,
          placeholder,
          fixErrorBox,
          fileName,
          pattern,
          style,
          message,
          distribute,
        } = field;
        // useEffect(()=>{
        // 	if(type == 'switchToggle'){
        // 		handelSaveValue(name, preValue.defaultValue ?? options[1]?.value);
        // 		handelChange(name, preValue.defaultValue ?? options[1]?.value);
        // 	}
        // },[])
        // if (boxarr) setOtp([...boxarr]);
        let disableField = {};
        if (field && field.disabled == false) {
          disableField = {};
        } else if (field && field.disabled == true) {
          disableField = {
            disabled: 'disabled',
          };
        } else if (disabled) {
          disableField = {
            disabled: 'disabled',
          };
        }

        if (
          field &&
          field.type !== 'section' &&
          field.layout &&
          field.layout.column
        ) {
          xsv =
            field.layout.column == 1
              ? 12
              : field.layout.column == 2
              ? 6
              : field.layout.column == 3
              ? 4
              : 12;
        }

        let maxDate = {},
          minDate = {};

        if (field && field.type == 'date') {
          if (field && field.min == 'today') {
            minDate = {
              inputProps: {
                min: todayDate(),
              },
            };
          } else if (field && field.max == 'today') {
            minDate = {
              inputProps: {
                max: todayDate(),
              },
            };
          }
          if (field && field.min && field.min !== 'today') {
            minDate = {
              inputProps: {
                min: todayDate(),
              },
            };
          } else if (field && field.max == 'today') {
            minDate = {
              inputProps: {
                max: todayDate(),
              },
            };
          }
          if (field && field.minmax == 'custom') {
            minDate = {
              inputProps: {
                min: myCustomDate(field.minCustomDate),
                max: myCustomDate(field.maxCustomDate),
              },
            };
          } else {
            minDate = {
              inputProps: {
                min: myCustomDate(
                  field?.min == 'today'
                    ? new Date().getTime()
                    : new Date('1000-01-01').getTime(),
                ),
                max: myCustomDate(
                  field?.max == 'today'
                    ? new Date().getTime()
                    : new Date('9999-12-31').getTime(),
                ),
              },
            };
          }
        }

        // if(field && field.type=='text'){
        // 	if(field && field.type=='text'){
        //
        // 	}
        // }
        // register(name).onChange(defaultValue);
        // setValue(name, defaultValue);
        // handelChange(name, defaultValue);
        // handelSaveValue(name, defaultValue);
        if (defaultValue) {
          preValue = {
            defaultValue: defaultValue,
          };
          if (
            type == 'multiSelect' &&
            _.isArray(preValue.defaultValue) == false
          ) {
            if (preValue.defaultValue) {
              preValue.defaultValue = preValue.defaultValue.split(',');
            }
          }
        }
        if (defaultValues) {
          preValue = {
            defaultValue: defaultValues[name] || defaultValue,
          };
          if (
            type == 'multiSelect' &&
            _.isArray(preValue.defaultValue) == false
          ) {
            if (preValue.defaultValue) {
              preValue.defaultValue = preValue.defaultValue.split(',');
            }
          }
        }

        let sectionProps = {
          register,
          errors,
          watch,
          control,
          setValue,
          setError,
          clearErrors,
          object,
          from,
          getValues,
          disabled,
          readOnly,
          // clickedHere,
          onChange,
          // // onBlur: (fldname) => onBlur(fldname),
          reset,
          defaultValues,
          fields: field.fields,
          layout: {
            xsv: fxsv(
              (field.layout && field.layout.column) ||
                (layout && layout.column),
            ),
            spacing: fspacing(
              (field.layout && field.layout.spacing) ||
                (layout && layout.spacing),
            ),
            size: fsize(
              (field.layout && field.layout.size) || (layout && layout.size),
            ),
            label:
              (field.layout && field.layout.label) || (layout && layout.label),
            type:
              (field.layout && field.layout.type) || (layout && layout.type),
          },
        };

        let registerName = name;
        if (path) {
          registerName = `${path}.${name}`;
          preValue = {
            defaultValue: _.get(defaultValues, registerName),
          };
          sectionProps = {
            ...sectionProps,
            path: path,
          };
        }

        if (type == 'mappl' && watch(registerName)) {
          preValue.defaultValue = watch(registerName);
        }

        if (type == 'autocomplete' && watch(name)) {
          let res = options.filter((ele) => ele.value == watch(name));
          preValue.value = res[0];
        }
        // if(type == "file" && watch(registerName)){
        // 	var image2 = document.getElementById(registerName + "image_round2");
        // 	if(image2){
        // 		image2.href = URL.createObjectURL(watch(registerName)[0]);
        // 	}
        // }
        if (type == 'file' && watch(registerName)) {
          var image2 = document.getElementById(registerName + 'image_round2');
          if (image2 && typeof watch(registerName) != 'string') {
            image2.href = URL.createObjectURL(watch(registerName)[0]);
          }
          var image = document.getElementById(registerName + 'image_round');
          if (image && isProfile == true) {
            image.src = URL.createObjectURL(watch(registerName)[0]);
          }
        }
        if (
          type == 'multiSelect' &&
          preValue &&
          preValue.defaultValue &&
          preValue.defaultValue.length &&
          multiSelect.length == 0
        ) {
          setMultiSelect({
            ...multiSelect,
            [registerName]: preValue.defaultValue,
          });
        }

        if (
          type == 'autocomplete' &&
          preValue &&
          preValue.defaultValue &&
          !inputAutoValue
        ) {
          let res = [];
          if (object) {
            res = options.filter((ele) => {
              return _.get(ele.value, object.filter) == preValue.defaultValue;
            });
          } else {
            res = options?.filter((ele) => {
              return ele.value == preValue.defaultValue;
            });
          }
          preValue.defaultValue = res?.length ? res[0] : [];
        }

        if (bind) {
          if (bind && bind.field && bind.field.indexOf('*') == -1) {
          } else {
            let dName = bind && `${path}.${bind['field'].split('*')[1]}`;

            if (
              bind.data[watch(dName)] &&
              watch(registerName) !== bind.data[watch(dName)]
            ) {
              setValue(registerName, bind.data[watch(dName)] || 0);
            }
            preValue = {
              defaultValue: bind.data[watch(dName)] || 0,
            };
          }
        }

        if (from) {
          if (from.indexOf('.') == -1) {
            if (watch(from) && watch(registerName) !== watch(from)) {
              setValue(registerName, watch(from));
            }
          } else {
            let fname = from.split('.')[0],
              fkeys = [],
              value;
            from.split('.').forEach((fkey, index) => {
              if (index !== 0) {
                fkeys.push(fkey);
              }
            });
            value = _.get(watch(fname), fkeys);
            if (value && watch(registerName) !== value) {
              //  ', fname, watch(fname), registerName, watch(registerName), _.get(watch(fname), fkeys))
              setValue(registerName, value);
            }
          }
        }

        let filterOptions = (options, {inputValue}) =>
          matchSorter(options, inputValue, {keys: ['value', 'title']});

        let validateObj = {};

        if (!_.isEmpty(validationProps)) {
          let enableValidation = true;
          if (
            validationProps.validateRow &&
            validationProps.validateRow.length
          ) {
            let tempchaker = false;
            validationProps.validateRow.forEach((fldname) => {
              if (watch(path + '.' + fldname)) {
                tempchaker = true;
              }
            });
            if (!tempchaker) {
              enableValidation = false;
            }
          }
          if (validationProps.enable) {
            let cs = validationProps.enable.split(' ');
            if (validationProps.enable.indexOf('"') > -1) {
              var sp1 = validationProps.enable.split('"');
              cs = sp1[0].trim().split(' ');
              cs.push(sp1[1]);
            }

            cs.forEach((element, i) => {
              if (!(element && element.indexOf('*') == -1)) {
                cs[i] = `${path}.${element.split('*')[1]}`;
              }
            });
            let checker = validator(watch(cs[0]), cs[1], watch(cs[2]));

            enableValidation = checker;
            if (!checker) {
              validateObj = {
                required: false,
                validate: false,
                manual: false,
              };
            }
            if (!checker && _.get(errors, registerName)) {
              // clearErrors(registerName);
            }
          }
          if (enableValidation) {
            for (const vp in validationProps) {
              //
              // Validated for mandatory with condition true false in a keyword booleanrequired
              if (validationProps.booleanrequired) {
                validateObj = {
                  ...validateObj,
                  required: validationProps[vp],
                };
              } else {
              }
              if (vp == 'required') {
                validateObj = {
                  ...validateObj,
                  required: validationProps[vp],
                };
              } else if (vp == 'validate' && validationProps[vp].length) {
                validationProps[vp].forEach((vld, i) => {
                  let cs = vld.condition.split(' ');
                  cs.forEach((element, i) => {
                    if (!(element && element.indexOf('*') == -1)) {
                      cs[i] = `${path}.${element.split('*')[1]}`;
                    }
                  });
                  if (type == 'date' && (!watch(cs[0]) || !watch(cs[2]))) {
                    return;
                  }
                  let checker = validator(watch(cs[0]), cs[1], watch(cs[2]));

                  if (type == 'date') {
                    checker = validator(
                      new Date(watch(cs[0])),
                      cs[1],
                      new Date(watch(cs[2])),
                    );
                  }
                  if (checker && _.get(errors, registerName)) {
                    // clearErrors(registerName);
                  }
                  if (validateObj.validate) {
                    validateObj = {
                      ...validateObj,
                      validate: {
                        ...validateObj.validate,
                        ['validate' + i]: (value) => checker || vld.message,
                      },
                    };
                  } else {
                    validateObj = {
                      ...validateObj,
                      validate: {
                        ['validate' + i]: (value) => checker || vld.message,
                      },
                    };
                  }
                });
              } else if (vp == 'manual' && validationProps[vp].length) {
                validationProps[vp].forEach((vld, i) => {
                  let cs = vld.condition.split(' ');
                  cs.forEach((element, i) => {
                    if (!(element && element.indexOf('*') == -1)) {
                      cs[i] = `${path}.${element.split('*')[1]}`;
                    }
                  });
                  let checker = validator(
                    watch(cs[0]),
                    cs[1],
                    Number(cs[2]) || cs[2],
                  );
                  if (type == 'date') {
                    if (cs[2] == 'today') {
                      checker = validator(
                        new Date(watch(cs[0])),
                        cs[1],
                        new Date(todayDate()),
                      );
                    } else {
                      checker = validator(
                        new Date(watch(cs[0])),
                        cs[1],
                        new Date(watch(cs[2])),
                      );
                    }
                    if (checker && _.get(errors, registerName)) {
                      clearErrors(registerName);
                    }
                  }
                  if (
                    type == 'text' ||
                    type == 'password' ||
                    type == 'number'
                  ) {
                    checker = validator(
                      values[cs[0]] || watch(cs[0]),
                      cs[1],
                      values[cs[2]] || watch(cs[2]),
                    );
                  }
                  if (validateObj.validate) {
                    validateObj = {
                      ...validateObj,
                      validate: {
                        ...validateObj.validate,
                        ['validateManual' + i]: (value) =>
                          checker || vld.message,
                      },
                    };
                  } else {
                    validateObj = {
                      ...validateObj,
                      validate: {
                        ['validateManual' + i]: (value) =>
                          checker || vld.message,
                      },
                    };
                  }
                });
              } else if (
                vp == 'maxLength' &&
                Object.keys(disableField).length === 0
              ) {
                let ml = watch(registerName);
                if (
                  ml &&
                  ml.length > validationProps[vp].value &&
                  !_.get(errors, registerName)
                ) {
                  setError(registerName, {
                    type: 'maxLength',
                    message: validationProps[vp].message,
                  });
                } else if (
                  ml &&
                  ml.length <= validationProps[vp].value &&
                  _.get(errors, registerName) &&
                  _.get(errors, registerName).type === 'maxLength'
                ) {
                  clearErrors(registerName);
                }
              } else if (vp == 'minLength') {
                let ml = watch(registerName);
                if (
                  ml &&
                  ml.length < validationProps[vp].value &&
                  !_.get(errors, registerName)
                ) {
                  setError(registerName, {
                    type: 'minLength',
                    message: validationProps[vp].message,
                  });
                } else if (
                  ml &&
                  ml.length >= validationProps[vp].value &&
                  _.get(errors, registerName) &&
                  _.get(errors, registerName).type === 'minLength'
                ) {
                  clearErrors(registerName);
                }
              } else if (vp == 'max') {
                let ml = watch(registerName);
                if (
                  ml > validationProps[vp].value &&
                  !_.get(errors, registerName)
                ) {
                  setError(registerName, {
                    type: 'max',
                    message: validationProps[vp].message,
                  });
                } else if (
                  ml <= validationProps[vp].value &&
                  _.get(errors, registerName) &&
                  _.get(errors, registerName).type === 'max'
                ) {
                  clearErrors(registerName);
                }
              } else if (vp == 'min') {
                let ml = watch(registerName);
                if (
                  ml < validationProps[vp].value &&
                  !_.get(errors, registerName)
                ) {
                  setError(registerName, {
                    type: 'min',
                    message: validationProps[vp].message,
                  });
                } else if (
                  ml >= validationProps[vp].value &&
                  _.get(errors, registerName) &&
                  _.get(errors, registerName).type === 'min'
                ) {
                  clearErrors(registerName);
                }
              } else if (vp == 'size' && type == 'file') {
                let filesize =
                  (watch(registerName) &&
                    watch(registerName)[0] &&
                    watch(registerName)[0].size) ||
                  0;
                let fsz = filesize / 1024;
                if (
                  fsz > validationProps[vp].value * 1024 &&
                  !_.get(errors, registerName)
                ) {
                  setError(registerName, {
                    type: 'size',
                    message: validationProps[vp].message,
                  });
                } else if (
                  fsz <= validationProps[vp].value * 1024 &&
                  _.get(errors, registerName) &&
                  _.get(errors, registerName).type === 'size'
                ) {
                  clearErrors(registerName);
                }
              } else if (vp == 'pattern') {
                validateObj = {
                  ...validateObj,
                  pattern: {
                    value: validationProps[vp].value,
                    message: validationProps[vp].message,
                  },
                };
              } else if (vp == 'error') {
                // validateObj = {
                // 	...validateObj,
                // 	pat: {
                // 		value: validationProps[vp].value,
                // 		message: validationProps[vp].message,
                // 	},
                // };
                let ml = 'NA';
                if (
                  (ml =
                    validationProps[vp].value && !_.get(errors, registerName))
                ) {
                  setError(registerName, {
                    type: 'error',
                    message: validationProps[vp].message,
                  });
                }
                // {
                // 	clearErrors(registerName);
                // }
              }

              // else{
              // 	validateObj = {}
              // }
            }
          }
        }

        let showField = true;
        if (dynamic) {
          if (_.isArray(dynamic.field)) {
            //
            let dy = {};
            dynamic.field.forEach((fld, idx) => {
              // unregister(fld);
              let tpval = false;
              if (fld.indexOf('*') == -1) {
                const wv = _.isObject(watch(fld))
                  ? watch(fld).value
                  : watch(fld);
                if (dynamic && dynamic.value) {
                  tpval = dynamic
                    ? wv && dynamic['value'][idx].includes(wv)
                    : true;
                  if (dynamic.value[idx].includes('undefined') && !tpval) {
                    tpval = wv ? false : true;
                  }
                } else if (dynamic && dynamic.isNotValue) {
                  tpval = dynamic
                    ? wv && !dynamic['isNotValue'][idx].includes(wv)
                    : true;
                }
              } else {
                let dName = `${path}.${fld.split('*')[1]}`;
                const wv = _.isObject(watch(dName))
                  ? watch(dName).value
                  : watch(dName);

                if (dynamic && dynamic.value) {
                  tpval = dynamic
                    ? wv && dynamic['value'][idx].includes(wv)
                    : true;
                  if (dynamic.value[idx].includes('undefined') && !showField) {
                    tpval = wv ? false : true;
                  }
                } else if (dynamic && dynamic.isNotValue) {
                  tpval = dynamic
                    ? wv && !dynamic['isNotValue'][idx].includes(wv)
                    : true;
                }
              }
              dy = {
                ...dy,
                [fld]: tpval,
              };
              //
            });
            if (dynamic && dynamic.condition) {
              showField = eval(dynamic.condition);
              if (!showField && watch(name)) {
                unregister(name);
              }
            }
          } else {
            if (dynamic && dynamic.field && dynamic.field.indexOf('*') == -1) {
              let temfield;
              if (dynamic.arrName) {
                temfield =
                  watch()?.[dynamic.arrName] &&
                  watch()?.[dynamic.arrName][myInd] &&
                  watch()?.[dynamic.arrName][myInd][dynamic['field']]
                    ? watch()?.[dynamic.arrName][myInd][dynamic['field']]
                    : dynamic.defaultShow;
              } else {
                temfield = watch(dynamic['field']);
              }
              const wv = _.isObject(temfield) ? temfield.value : temfield;
              if (dynamic && dynamic.value) {
                showField = dynamic
                  ? wv && dynamic['value'].includes(wv)
                  : true;
                if (dynamic.value.includes('undefined') && !showField) {
                  showField = wv ? false : true;
                }
              } else if (dynamic && dynamic.isNotValue) {
                showField = dynamic
                  ? wv && !dynamic['isNotValue'].includes(wv)
                  : true;
              }
            } else {
              let dName =
                dynamic && `${path}.${dynamic['field'].split('*')[1]}`;
              const wv = _.isObject(watch(dName))
                ? watch(dName).value
                : watch(dName);

              if (dynamic && dynamic.value) {
                showField = dynamic
                  ? wv && dynamic['value'].includes(wv)
                  : true;
                if (dynamic.value.includes('undefined') && !showField) {
                  showField = wv ? false : true;
                }
              } else if (dynamic && dynamic.isNotValue) {
                showField = dynamic
                  ? wv && !dynamic['isNotValue'].includes(wv)
                  : true;
              }
            }
          }
        }
        if (!showField) return null;
        switch (type) {
          case 'blank_field':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {style}}}
                content={<></>}
              />
            );
          case 'heading':
            return (
              <h4 style={{display: 'flex', alignItems: 'center'}}>{title}</h4>
            );
          case 'blank':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {style}}}
                content={
                  <TextField
                    id={name}
                    {...register(registerName, {...validateObj})}
                    disabled
                    variant='outlined'
                    fullWidth
                    size={size}
                    inputProps={{
                      maxlength: maxlength,
                      minlength: minlength,
                      readOnly,
                    }}
                    style={{opacity: 0}}
                  />
                }
              />
            );
          case 'hidden':
            return (
              <input
                type='hidden'
                {...register(registerName, {...validateObj})}
                {...preValue}
              />
            );
          case 'text':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{
                  xs: xsv,
                  key: name,
                  spacing: spacing,
                  style: {...{padding: '0px !important '}, ...style},
                }}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label
                        htmlFor={name}
                        className={classes.label}
                        style={{
                          width: '100%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          marginBottom: '3px',
                        }}
                      >
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}

                    {message?.length ? (
                      <span>
                        <p style={{color: 'red'}}>{message}</p>
                      </span>
                    ) : null}

                    <div
                      style={{
                        display: 'flex',
                        position: 'relative',
                        // marginTop: '-5px',
                      }}
                    >
                      {/* {greenIcon?.includes(name) && <span style={{ position: 'absolute', right: '35px', top: '-25px' }}><img style={{ width: "20px", marginBottom: "-50px", marginRight: "2px" }} src="/assets/images/tick.svg" /></span>} */}
                      <TextField
                        id={name}
                        // label={
                        //   layout.label !== 'fixed' && layout.label !== 'blank'
                        //     ? title
                        //     : ''
                        // }
                        type={input_type ?? 'text'}
                        {...register(registerName, {...validateObj, pattern})}
                        {...preValue}
                        label={placeholder}
                        placeholder={placeholder}
                        autoComplete='off'
                        onInput={(e) => {
                          if (isUpper) {
                            setValue(
                              name,
                              e.target?.value?.trimStart()?.toUpperCase(),
                            );
                          }
                          if (isLower) {
                            setValue(
                              name,
                              e.target?.value?.trimStart()?.toLowerCase(),
                            );
                          }
                          if (
                            maxChar &&
                            e?.target?.value?.length > Number(maxChar)
                          ) {
                            setValue(
                              name,
                              e.target?.value
                                ?.trimStart()
                                ?.slice(0, Number(maxChar)),
                            );
                          }
                          if (isNumber) {
                            let myinpval = e.target?.value;
                            if (
                              name?.includes('mobile') &&
                              myinpval?.length == 1 &&
                              Number(myinpval) < 5
                            )
                              myinpval = null;
                            if (Number(maxVal) < Number(e?.target?.value)) {
                              myinpval = Number(maxVal);
                              e.target.value = maxVal;
                            }
                            setValue(
                              name,
                              myinpval?.trimStart().replace(/\D/g, ''),
                            );
                          }
                          if (isSpace == false) {
                            setValue(name, e.target?.value?.trim());
                          }
                        }}
                        onChange={(e) => {
                          register(registerName).onChange(e);
                          handelChange(name, e.target.value?.trimStart());
                          handelSaveValue(name, e.target.value?.trimStart());
                          // if(validationProps?.manual?.length){
                          // 	validationProps?.manual?.map(temel=>{
                          // 		if(temel?.type == 'notEqualTo' && formData[temel.field] == e.target.value){
                          // 			setError(temel.field, {
                          // 				type: "manual",
                          // 				message: validationProps?.notEqualTo?.message,
                          // 			});
                          // 		}
                          // 	})
                          // }
                        }}
                        // // onBlur={() => onBlur(registerName)}
                        {...disableField}
                        variant='outlined'
                        fullWidth
                        size={size}
                        inputProps={{
                          // autocomplete: "off",
                          maxlength: maxlength,
                          minlength: minlength,
                          readOnly,
                        }}
                        InputProps={
                          inputiconurl
                            ? {
                                startAdornment: (
                                  <InputAdornment position='start'>
                                    <img
                                      src={inputiconurl}
                                      style={{
                                        maxWidth: '20px',
                                        maxHeight: '20px',
                                      }}
                                    />{' '}
                                  </InputAdornment>
                                ),
                              }
                            : greenIcon?.includes(name) && {
                                endAdornment: (
                                  <InputAdornment position='start'>
                                    <img
                                      style={{width: '20px'}}
                                      src='/assets/images/tick.svg'
                                    />{' '}
                                  </InputAdornment>
                                ),
                              }
                        }
                        error={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? true
                            : false
                        }
                        helperText={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? _.get(errors, registerName)
                                .message?.trim()
                                ?.slice(-1) == '.'
                              ? _.get(errors, registerName).message + ''
                              : _.get(errors, registerName).message + '.'
                            : fixErrorBox
                            ? ' '
                            : ''
                        }
                      />
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>
                  </>
                }
              />
            );

          case 'phoneNumber':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label
                        htmlFor={name}
                        className={classes.label}
                        style={{width: '100%'}}
                      >
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                        {greenIcon?.includes(name) && (
                          <span style={{float: 'right', marginRight: '2%'}}>
                            <img
                              style={{width: '20px', marginBottom: '-50px'}}
                              src='/assets/images/tick.svg'
                            />
                          </span>
                        )}
                      </label>
                    )}
                    <div style={{display: 'flex'}}>
                      <Paper
                        component='form'
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: 800,
                          height: 50,
                          border: '1px solid #a9a9a9',
                          boxShadow: 'none',
                          background: 'none',
                          borderRadius: '0.5rem',
                          height: '3.3rem',
                        }}
                      >
                        <Select
                          style={{height: '3.3rem'}}
                          open={open}
                          // onClose={handleClose}
                          // onOpen={handleOpen}
                          value={age}
                          disableUnderline
                          label='Age'
                          // onChange={handleChanges}
                        >
                          <MenuItem value='+91'>
                            <em>+91</em>
                          </MenuItem>
                          <MenuItem value={10}>+91</MenuItem>
                          <MenuItem value={20}>110</MenuItem>
                          <MenuItem value={30}>210</MenuItem>
                        </Select>
                        {/* <h4>+91</h4> */}
                        <InputBase
                          style={{
                            width: '100%',
                            height: '4rem',
                            padding: '1rem',
                          }}
                          id={name}
                          label={
                            layout.label !== 'fixed' && layout.label !== 'blank'
                              ? title
                              : ''
                          }
                          {...register(registerName, {...validateObj, pattern})}
                          {...preValue}
                          placeholder={layout?.placeholder}
                          onChange={(e) => {
                            register(registerName).onChange(e);
                            handelChange(name, e.target.value);
                            handelSaveValue(name, e.target.value);
                          }}
                          // // onBlur={() => onBlur(registerName)}
                          {...disableField}
                          variant='outlined'
                          fullWidth
                          size={size}
                          inputProps={{
                            // autocomplete: "off",
                            maxlength: maxlength,
                            minlength: minlength,
                            readOnly,
                          }}
                          error={
                            _.get(errors, registerName) &&
                            (_.get(errors, registerName) ||
                              _.get(errors, registerName).type === 'required' ||
                              _.get(errors, registerName).type === 'manual')
                              ? true
                              : false
                          }
                          helperText={
                            _.get(errors, registerName) &&
                            (_.get(errors, registerName) ||
                              _.get(errors, registerName).type === 'required' ||
                              _.get(errors, registerName).type === 'manual')
                              ? _.get(errors, registerName).message.slice(-1) ==
                                '.'
                                ? _.get(errors, registerName).message + ''
                                : _.get(errors, registerName).message + '.'
                              : ''
                          }
                        />
                      </Paper>
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>
                  </>
                }
              />
            );

          case 'password':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label
                        htmlFor={name}
                        className={classes.label}
                        style={{width: '100%'}}
                      >
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                        {greenIcon?.includes(name) && (
                          <span style={{float: 'right', marginRight: '8%'}}>
                            <img
                              style={{width: '20px', marginBottom: '-50px'}}
                              src='/assets/images/tick.svg'
                            />
                          </span>
                        )}
                      </label>
                    )}

                    {message?.length ? (
                      <span>
                        <p style={{color: 'red'}}>{message}</p>
                      </span>
                    ) : null}

                    <div style={{display: 'flex'}}>
                      <TextField
                        id={name}
                        label={
                          layout.label !== 'fixed' && layout.label !== 'blank'
                            ? title
                            : ''
                        }
                        {...register(registerName, {...validateObj, pattern})}
                        {...preValue}
                        placeholder={layout?.placeholder}
                        onChange={(e) => {
                          register(registerName).onChange(e);
                          handelChange(name, e.target.value);
                          handelSaveValue(name, e.target.value);
                        }}
                        // // onBlur={() => onBlur(registerName)}
                        {...disableField}
                        variant='outlined'
                        type='password'
                        fullWidth
                        size={size}
                        autoComplete='new-password'
                        inputProps={{
                          // autocomplete: "off",
                          maxlength: maxlength,
                          minlength: minlength,
                          readOnly,
                        }}
                        InputProps={{
                          startAdornment: inputiconurl ? (
                            <InputAdornment position='start'>
                              {inputiconurl ? (
                                <img
                                  src={inputiconurl}
                                  style={{maxWidth: '20px', maxHeight: '20px'}}
                                />
                              ) : null}
                            </InputAdornment>
                          ) : null,
                        }}
                        error={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? true
                            : false
                        }
                        helperText={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? _.get(errors, registerName).message.slice(-1) ==
                              '.'
                              ? _.get(errors, registerName).message + ''
                              : _.get(errors, registerName).message + '.'
                            : ''
                        }
                      />
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>
                  </>
                }
              />
            );
          case 'multiInput':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{
                  xs: xsv,
                  key: name,
                  spacing: spacing,
                  style: {...style},
                }}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    {message?.length ? (
                      <span>
                        <p style={{color: 'red'}}>{message}</p>
                      </span>
                    ) : null}
                    <Controller
                      {...register(registerName, {...validateObj, pattern})}
                      // {...register(registerName, validateObj, pattern)}
                      control={control}
                      render={({field}) => (
                        <MuiOtpInput
                          {...field}
                          sx={{gap: 0.5}}
                          length={blocks || 6}
                          {...disableField}
                          onChange={(value) => {
                            if (isNumber) {
                              handelChange(
                                name,
                                value
                                  .toUpperCase()
                                  ?.trimStart()
                                  .replace(/\D/g, ''),
                              );
                              handelSaveValue(
                                name,
                                value
                                  .toUpperCase()
                                  ?.trimStart()
                                  .replace(/\D/g, ''),
                              );
                            } else {
                              field.onChange(value.toUpperCase());
                              handelChange(name, value.toUpperCase());
                              handelSaveValue(name, value.toUpperCase());
                            }
                            // onBlur(registerName);
                          }}
                          TextFieldsProps={{
                            disabled: disabled,
                            size: size,
                            placeholder: placeholder || '-',
                            inputProps: {
                              style: {
                                paddingLeft: 0,
                                paddingRight: 0,
                              },
                            },
                          }}
                        />
                      )}
                    />
                    {_.get(errors, registerName) &&
                      _.get(errors, registerName).type === 'required' && (
                        <FormHelperText
                          style={{display: 'flex', alignItems: 'center'}}
                        >
                          {_.get(errors, registerName).message}
                        </FormHelperText>
                      )}
                  </>
                }
              />
            );
          case 'otptypebox':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    <Box display='flex' justifyContent='center'>
                      {boxarr?.map((digit, index) => (
                        <>
                          {/* {index > 0 && spaceAfter?.includes(index - 1) && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '10px',
                                width: '20px', // Adjust the width of the line as needed
                              }}
                            >
                              <span
                                style={{
                                  borderBottom: '2px solid black',
                                  width: '100%',
                                }}
                              ></span>
                            </Box>
                          )} */}
                          <Controller
                            key={index}
                            control={control}
                            defaultValue={boxarr[index]}
                            rules={{
                              required: index < minBoxReq + 1 ? true : false,
                            }}
                            {...register(registerName, {
                              ...validateObj,
                              pattern,
                            })}
                            // rules={{
                            //   validate: (value) =>
                            //     index < 6 ? value.length === 1 : true,
                            // }}
                            render={({field, fieldState}) => (
                              <Box
                                sx={{
                                  mr: spaceAfter?.includes(index) ? 4 : 1,
                                }}
                              >
                                {/* {console.log('preValue', preValue)} */}
                                <TextField
                                  type='text'
                                  fullWidth
                                  id={`${name}${index}`}
                                  // value={digit}
                                  value={field.value}
                                  onKeyDown={(e) =>
                                    handleOtpChange(
                                      index,
                                      e.target.value,
                                      name,
                                      boxarr,
                                      e,
                                      minBoxReq,
                                      pattern,
                                    )
                                  }
                                  onChange={(e) => {
                                    // register(registerName).onChange(e);
                                    handleOtpChange(
                                      index,
                                      e.target.value,
                                      name,
                                      boxarr,
                                      e,
                                      minBoxReq,
                                      pattern,
                                    );
                                  }}
                                  onInput={(e) => {
                                    handleOtpChange(
                                      index,
                                      e.target.value,
                                      name,
                                      boxarr,
                                      e,
                                      minBoxReq,
                                      pattern,
                                    );
                                  }}
                                />
                              </Box>
                            )}
                            name={`${name}[${index}]`}
                          />
                        </>
                      ))}
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </Box>
                    {Object.keys(errors).some((errorKey) => errors[errorKey]) ||
                    errors[name] ? (
                      <FormHelperText
                        style={{
                          color: '#d32f2f',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {console.log(errors, errors)}
                        {errors[name] &&
                        (errors[name][0]?.type == 'required' ||
                          errors[name]?.type == 'custom error')
                          ? errors[name]?.message
                          : null}
                      </FormHelperText>
                    ) : null}
                  </>
                }
              />
            );
          case 'time':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    <Controller
                      {...register(registerName, {...validateObj, pattern})}
                      control={control}
                      render={({field}) => (
                        <div style={{display: 'flex'}}>
                          <Autocomplete
                            // disablePortal
                            ListboxProps={{
                              style: {
                                maxHeight: '150px',
                              },
                            }}
                            sx={{
                              width: '50%',
                              border: 'none',
                              '& .MuiAutocomplete-popupIndicator': {
                                transform: 'none',
                              },
                            }}
                            value={
                              watch(registerName)?.split(':')[0] &&
                              watch(registerName)?.split(':')[0] != 'null'
                                ? {
                                    title: watch(registerName)?.split(':')[0],
                                    value: watch(registerName)?.split(':')[0],
                                  }
                                : null
                            }
                            onChange={(e, data, v) => {
                              let hrs = data?.value || null;
                              let mins =
                                watch(registerName)?.split(':')?.length > 1
                                  ? watch(registerName)?.split(':')[1]
                                  : '00';
                              register(registerName).onChange(e);
                              handelChange(name, `${hrs}:${mins}`);
                              handelSaveValue(registerName, `${hrs}:${mins}`);
                              if (data?.value) clearErrors(registerName);
                              if (!hrs)
                                setError(name, {
                                  type: 'manual',
                                  message: 'This is a mandatory field.',
                                });
                            }}
                            popupIcon={
                              <span
                                style={{fontSize: '14px', marginTop: '5px'}}
                              >
                                Hrs
                              </span>
                            }
                            disableClearable
                            options={hoursOption}
                            getOptionLabel={(option) => option.title}
                            id={'combo-box-demo1' + registerName}
                            renderInput={(params) => (
                              <TextField
                                error={_.get(errors, registerName)?.message}
                                {...params}
                              />
                            )}
                          />
                          <Autocomplete
                            // disablePortal
                            disableClearable
                            ListboxProps={{
                              style: {
                                maxHeight: '150px',
                              },
                            }}
                            sx={{
                              ml: 2,
                              width: '50%',
                              border: 'none',
                              '& .MuiAutocomplete-popupIndicator': {
                                transform: 'none',
                              },
                            }}
                            value={
                              watch(registerName)?.split(':')?.length > 1
                                ? {
                                    title: watch(registerName)?.split(':')[1],
                                    value: watch(registerName)?.split(':')[1],
                                  }
                                : null
                            }
                            popupIcon={
                              <span
                                style={{fontSize: '14px', marginTop: '5px'}}
                              >
                                Mins
                              </span>
                            }
                            getOptionLabel={(option) => option.title}
                            id={'combo-box-demo11' + registerName}
                            onChange={(e, data, v) => {
                              let mins = data?.value || '00';
                              let hrs =
                                watch(registerName)?.split(':')[0] &&
                                watch(registerName)?.split(':')[0] != 'null'
                                  ? watch(registerName)?.split(':')[0]
                                  : '00';
                              register(registerName).onChange(e);
                              handelChange(name, `${hrs}:${mins}`);
                              handelSaveValue(registerName, `${hrs}:${mins}`);
                              if (data?.value) clearErrors(registerName);
                              if (!hrs)
                                setError(name, {
                                  type: 'manual',
                                  message: 'This is a mandatory field.',
                                });
                            }}
                            options={minsOption}
                            renderInput={(params) => (
                              <TextField
                                error={_.get(errors, registerName)?.message}
                                {...params}
                              />
                            )}
                          />
                          {infoMessage?.length ? (
                            <span>
                              <Tooltip
                                title={
                                  <ul
                                    style={{
                                      listStyleType: 'circle',
                                      paddingLeft: '10px',
                                    }}
                                  >
                                    {infoMessage?.map((infomsg) => {
                                      return <li>{infomsg}</li>;
                                    })}
                                  </ul>
                                }
                                placement='right'
                              >
                                <InfoOutlinedIcon
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    margin: '16px 10px 0px 5px',
                                  }}
                                />
                              </Tooltip>
                            </span>
                          ) : null}
                        </div>
                      )}
                    />
                    {_.get(errors, registerName)?.message && (
                      <FormHelperText
                        style={{
                          color: '#d32f2f',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {_.get(errors, registerName).message}
                      </FormHelperText>
                    )}
                  </>
                }
              />
            );
          case 'number':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                      </label>
                    )}
                    <div style={{display: 'flex'}}>
                      <TextField
                        id={registerName}
                        label={
                          layout.label !== 'fixed' && layout.label !== 'blank'
                            ? title
                            : ''
                        }
                        type='number'
                        {...register(registerName, validateObj)}
                        {...preValue}
                        value={
                          field && field.calculation
                            ? calculation({field, name: registerName})
                            : register(registerName).value
                        }
                        onChange={(e) => {
                          register(registerName).onChange(e);
                          handelChange(name, e.target.value);
                          handelSaveValue(name, e.target.value);
                          if (e.target.value == 0) {
                            setError(name, {
                              type: 'manual',
                              message: 'Should not be empty or 0.',
                            });
                          } else if (
                            e.target.value == null ||
                            e.target.value > 0
                          ) {
                            if (
                              errors &&
                              _.get(errors, registerName) &&
                              _.get(errors, registerName)['type'] === 'manual'
                            ) {
                              clearErrors(name);
                            }
                          }
                        }}
                        // // onBlur={() => onBlur(registerName)}
                        {...disableField}
                        variant='outlined'
                        fullWidth
                        size={size}
                        inputProps={{
                          maxlength: maxlength,
                          minlength: minlength,
                          max: max,
                          min: min,
                          readOnly: field && field.calculation ? true : false,
                        }}
                        error={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? true
                            : false
                        }
                        helperText={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? _.get(errors, registerName).message
                            : ''
                        }
                      />
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='left'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '18px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>
                  </>
                }
              />
            );
          case 'email':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                      </label>
                    )}
                    <TextField
                      id={name}
                      label={
                        layout.label !== 'fixed' && layout.label !== 'blank'
                          ? title
                          : ''
                      }
                      type='email'
                      {...register(registerName, validateObj)}
                      {...preValue}
                      onChange={(e) => {
                        register(registerName).onChange(e);
                        handelChange(name, e.target.value);
                        handelSaveValue(name, e.target.value);
                      }}
                      // // onBlur={() => onBlur(registerName)}
                      {...disableField}
                      variant='outlined'
                      fullWidth
                      size={size}
                      error={
                        _.get(errors, registerName) &&
                        (_.get(errors, registerName) ||
                          _.get(errors, registerName).type === 'required' ||
                          _.get(errors, registerName).type === 'manual')
                          ? true
                          : false
                      }
                      helperText={
                        _.get(errors, registerName) &&
                        (_.get(errors, registerName) ||
                          _.get(errors, registerName).type === 'required' ||
                          _.get(errors, registerName).type === 'manual')
                          ? _.get(errors, registerName).message
                          : ''
                      }
                    />
                  </>
                }
              />
            );
          case 'tel':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                      </label>
                    )}
                    <TextField
                      id={name}
                      label={
                        layout.label !== 'fixed' && layout.label !== 'blank'
                          ? title
                          : ''
                      }
                      type='tel'
                      {...register(registerName, validateObj)}
                      {...preValue}
                      onChange={(e) => {
                        register(registerName).onChange(e);
                        handelChange(name, e.target.value);
                        handelSaveValue(name, e.target.value);
                      }}
                      // // onBlur={() => onBlur(registerName)}
                      {...disableField}
                      variant='outlined'
                      inputProps={{
                        maxlength: maxlength,
                        minlength: minlength,
                        min: min,
                        max: max,
                      }}
                      fullWidth
                      size={size}
                      error={
                        _.get(errors, registerName) &&
                        (_.get(errors, registerName) ||
                          _.get(errors, registerName).type === 'required' ||
                          _.get(errors, registerName).type === 'manual')
                          ? true
                          : false
                      }
                      helperText={
                        _.get(errors, registerName) &&
                        (_.get(errors, registerName) ||
                          _.get(errors, registerName).type === 'required' ||
                          _.get(errors, registerName).type === 'manual')
                          ? _.get(errors, registerName).message
                          : ''
                      }
                    />
                  </>
                }
              />
            );
          case 'textarea':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {isCheckBox ? (
                      <span style={{marginLeft: '-10px'}}>
                        <Checkbox
                          defaultChecked={
                            !(isCheckBox && checkLabel[name + 'check'])
                          }
                          id={name + 'check'}
                          onChange={(e) => {
                            if (!e.target.checked) {
                              handelSaveValue(name, null);
                            }
                            setCheckLabel({
                              ...checkLabel,
                              [name + 'check']: !e.target.checked,
                            });
                          }}
                        />
                      </span>
                    ) : null}
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    <div style={{display: 'flex', position: 'relative'}}>
                      <TextField
                        id={name}
                        label={
                          layout.label !== 'fixed' && layout.label !== 'blank'
                            ? title
                            : ''
                        }
                        multiline
                        disabled={
                          disabled || (isCheckBox && checkLabel[name + 'check'])
                        }
                        rows={boxheight || 4}
                        {...register(registerName, {...validateObj, pattern})}
                        {...preValue}
                        onChange={(e) => {
                          register(registerName).onChange(e);
                          handelChange(name, e.target.value);
                          handelSaveValue(name, e.target.value);
                        }}
                        // // onBlur={() => onBlur(registerName)}
                        {...disableField}
                        variant='outlined'
                        fullWidth
                        size={size}
                        inputProps={{
                          maxlength: maxlength,
                          minlength: minlength,
                        }}
                        error={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? true
                            : false
                        }
                        helperText={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? _.get(errors, registerName).message
                            : ''
                        }
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '33px',
                          top: '-18px',
                        }}
                      >
                        {isSMS
                          ? (watch(name)?.length ?? 0) +
                            '/' +
                            (Math.trunc((watch(name)?.length || 0) / 160) + 1)
                          : ''}
                      </span>
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>
                  </>
                }
              />
            );
          case 'checkbox':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    <FormControl
                      component='fieldset'
                      error={
                        _.get(errors, registerName) &&
                        _.get(errors, registerName).type === 'required'
                          ? true
                          : false
                      }
                      size={size}
                      style={{flexDirection: 'row'}}
                    >
                      <Controller
                        {...register(registerName, validateObj)}
                        control={control}
                        render={({field}) => (
                          <FormControlLabel
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handelChange(name, e.target.checked);
                              handelSaveValue(name, e.target.checked);
                              // onBlur(registerName);
                            }}
                            {...disableField}
                            control={
                              <Checkbox
                                defaultChecked={preValue.defaultValue}
                                id={name}
                                color='primary'
                                style={{marginTop: '20px'}}
                              />
                            }
                          />
                        )}
                      />
                      <label
                        htmlFor={name}
                        style={{
                          display: 'flex',
                          alignItems: 'left',
                          marginTop: '20px',
                          marginLeft: '-16px',
                          alignItems: 'center',
                        }}
                      >
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                      {_.get(errors, registerName) &&
                        _.get(errors, registerName).type === 'required' && (
                          <FormHelperText
                            style={{display: 'flex', alignItems: 'center'}}
                          >
                            {_.get(errors, registerName).message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </>
                }
              />
            );
          case 'radio':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    <FormControl
                      component='fieldset'
                      error={
                        _.get(errors, registerName) &&
                        _.get(errors, registerName).type === 'required'
                          ? true
                          : false
                      }
                      size={size}
                    >
                      <label
                        htmlFor={name}
                        style={{display: 'flex', alignItems: 'center'}}
                      >
                        {title}
                        {/* :{' '} */}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                      {message?.length ? (
                        <span>
                          <p style={{color: 'red', marginTop: '0.5rem'}}>
                            {message}
                          </p>
                        </span>
                      ) : null}
                      <Controller
                        {...register(registerName, validateObj)}
                        control={control}
                        render={({field}) => (
                          <>
                            <div style={{display: 'flex'}}>
                              <RadioGroup
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handelChange(name, e.target.value);
                                  handelSaveValue(name, e.target.value);
                                  // onBlur(registerName);
                                }}
                                row
                                style={{height: '62px'}}
                              >
                                {options.map((radio) => (
                                  <FormControlLabel
                                    value={radio.value}
                                    {...disableField}
                                    {...preValue}
                                    control={<Radio size={size} />}
                                    label={radio.title}
                                    labelPlacement={
                                      radio.labelPlacement || 'end'
                                    }
                                  />
                                ))}
                              </RadioGroup>
                              {infoMessage?.length ? (
                                <span>
                                  <Tooltip
                                    title={
                                      <ul
                                        style={{
                                          listStyleType: 'circle',
                                          paddingLeft: '10px',
                                        }}
                                      >
                                        {infoMessage?.map((infomsg) => {
                                          return <li>{infomsg}</li>;
                                        })}
                                      </ul>
                                    }
                                    placement='right'
                                  >
                                    <InfoOutlinedIcon
                                      style={{
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        margin: '23px 10px 0px 5px',
                                      }}
                                    />
                                  </Tooltip>
                                </span>
                              ) : null}
                            </div>
                          </>
                        )}
                      />
                      {_.get(errors, registerName) &&
                        (_.get(errors, registerName) ||
                          _.get(errors, registerName).type === 'required' ||
                          _.get(errors, registerName).type === 'manual') && (
                          <FormHelperText
                            style={{display: 'flex', alignItems: 'center'}}
                          >
                            {_.get(errors, registerName).message.slice(-1) ==
                            '.'
                              ? _.get(errors, registerName).message + ''
                              : _.get(errors, registerName).message + '.'}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </>
                }
              />
            );
          case 'slider':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    <FormControl
                      component='fieldset'
                      error={
                        _.get(errors, registerName) &&
                        _.get(errors, registerName).type === 'required'
                          ? true
                          : false
                      }
                      size={size}
                      style={{width: '100%'}}
                    >
                      <label
                        htmlFor={name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginRight: '10px',
                        }}
                      >
                        {title}:
                      </label>
                      <Controller
                        control={control}
                        {...preValue}
                        {...register(registerName, validateObj)}
                        render={({field: {onChange}}) => (
                          <Slider
                            name={name}
                            onChange={(_, value) => {
                              onChange(value);
                              handelChange(name, value);
                              handelSaveValue(name, value);
                              // onBlur(registerName);
                            }}
                            {...disableField}
                            valueLabelDisplay='auto'
                            defaultValue={preValue.defaultValue}
                            max={max}
                            step={1}
                          />
                        )}
                      />
                      {_.get(errors, registerName) &&
                        (_.get(errors, registerName) ||
                          _.get(errors, registerName).type === 'required' ||
                          _.get(errors, registerName).type === 'manual') && (
                          <FormHelperText
                            style={{display: 'flex', alignItems: 'center'}}
                          >
                            {_.get(errors, registerName).message}
                          </FormHelperText>
                        )}
                    </FormControl>
                  </>
                }
              />
            );
          case 'date2':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        id={name}
                        {...register(registerName, {...validateObj, pattern})}
                        value={values[name]}
                        onChange={(e) => {
                          handelChange(name, e.toString());
                          handelSaveValue(name, e.toString());
                          setValue(name, e.toString());
                        }}
                        // // onBlur={() => onBlur(registerName)}
                        shouldDisableDate={(date) => {
                          let dateInterditesRaw = disDate;
                          const dateInterdites = dateInterditesRaw.map(
                            (arrVal) => {
                              return new Date(arrVal)?.getTime();
                            },
                          );
                          return dateInterdites.includes(date.getTime());
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant='outlined'
                            fullWidth
                            size={size}
                            // inputProps={{
                            // 	maxlength: maxlength,
                            // 	minlength: minlength,
                            // 	readOnly
                            // }}
                            error={
                              _.get(errors, registerName) &&
                              (_.get(errors, registerName) ||
                                _.get(errors, registerName).type ===
                                  'required' ||
                                _.get(errors, registerName).type === 'manual')
                                ? true
                                : false
                            }
                            helperText={
                              _.get(errors, registerName) &&
                              (_.get(errors, registerName) ||
                                _.get(errors, registerName).type ===
                                  'required' ||
                                _.get(errors, registerName).type === 'manual')
                                ? _.get(errors, registerName).message
                                : ''
                            }
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </>
                }
              />
            );

          case 'date':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    <div style={{display: 'flex'}}>
                      <TextField
                        id={name}
                        label={
                          layout.label !== 'fixed' && layout.label !== 'blank'
                            ? title
                            : ''
                        }
                        type='date'
                        // max="2022-12-31"
                        {...register(registerName, {...validateObj})}
                        onChange={(e) => {
                          register(registerName).onChange(e);
                          handelChange(name, e.target.value);
                          handelSaveValue(name, e.target.value);
                          // onBlur(registerName);
                        }}
                        {...disableField}
                        defaultValue={
                          preValue.defaultValue &&
                          formatDate(preValue.defaultValue)
                        }
                        // {...preValue}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        {...minDate}
                        {...maxDate}
                        // inputProps={{
                        // 	min: todayDate()
                        // }}
                        {...disableField}
                        variant='outlined'
                        fullWidth
                        size={size}
                        error={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? true
                            : false
                        }
                        helperText={
                          _.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual')
                            ? _.get(errors, registerName).message
                            : ''
                        }
                      />
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>
                  </>
                }
              />
            );
          case 'select':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && title && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    <div style={{display: 'flex'}}>
                      <FormControl
                        error={
                          _.get(errors, registerName) &&
                          _.get(errors, registerName).type === 'required'
                            ? true
                            : false
                        }
                        variant='outlined'
                        fullWidth
                        size={size}
                      >
                        {layout.label !== 'fixed' && title && (
                          <InputLabel id={name}>{title}</InputLabel>
                        )}
                        <Controller
                          render={({field}) => {
                            let properties = {};
                            if (layout.label !== 'fixed') {
                              properties = {
                                labelId: name,
                                label: title,
                              };
                            }
                            return (
                              <>
                                <Select
                                  // native
                                  labelId='demo-simple-select-label'
                                  // id='demo-simple-select'
                                  id={name}
                                  {...properties}
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    handelChange(name, e.target.value);
                                    handelSaveValue(name, e.target.value);
                                    // onBlur(registerName);
                                  }}
                                  {...disableField}
                                >
                                  {options &&
                                    options.map((option) => (
                                      <MenuItem value={option.value}>
                                        <div
                                          style={{
                                            display: 'flex',
                                            gap: '0.5rem', // Adjusted gap
                                            alignItems: 'center',
                                          }}
                                        >
                                          <div
                                            style={{
                                              width: '12px', // Decreased width
                                              height: '12px', // Decreased height
                                              backgroundColor: `${
                                                option.title.split(' ')?.[1]
                                              }`,
                                              borderRadius: '2px', // Decreased border radius
                                            }}
                                          ></div>
                                          <span
                                            style={{
                                              fontSize: '0.8rem',
                                              paddingLeft: '0.1rem',
                                            }}
                                          >
                                            {option.title}
                                          </span>{' '}
                                          {/* Adjusted font size */}
                                        </div>
                                      </MenuItem>
                                    ))}
                                </Select>
                              </>
                            );
                          }}
                          control={control}
                          {...preValue}
                          {...register(registerName, validateObj)}
                        />
                        {_.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual') && (
                            <FormHelperText>
                              {_.get(errors, registerName).message}
                            </FormHelperText>
                          )}
                      </FormControl>

                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>
                  </>
                }
              />
            );
          case 'autocomplete':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && title && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    <div style={{display: 'flex'}}>
                      <Autocomplete
                        id={name}
                        {...preValue}
                        multiple={multiple}
                        limitTags={multilimit ?? 3}
                        disableCloseOnSelect={multiple}
                        {...register(registerName, validateObj)}
                        onChange={(e, data, v) => {
                          //  , validateObj);
                          if (v == 'clear') {
                            handelSaveValue(registerName, null);
                            handelChange(name, null);
                            // if (clickedHere) {
                            // 	setError(registerName, { type: 'required', message: validateObj?.required });
                            // }
                          } else {
                            register(registerName).onChange(e);
                            handelChange(name, data);
                            if (data && (data.value || data.length)) {
                              handelSaveValue(registerName, data.value ?? data);
                              clearErrors(registerName);
                            }
                          }
                        }}
                        // // onBlur={() => onBlur(registerName)}
                        {...disableField}
                        options={options}
                        getOptionLabel={(option) => option.title}
                        style={{width: '100%', minWidth: '135px'}}
                        fullWidth
                        variant='outlined'
                        size={size}
                        renderOption={(props, option, ind) => (
                          <>
                            {option?.imgsrc ? (
                              <Box
                                key={ind + '>>'}
                                component='li'
                                sx={{'& > img': {mr: 2, flexShrink: 0}}}
                                {...props}
                              >
                                <img
                                  loading='lazy'
                                  width='20'
                                  src={option.imgsrc}
                                  alt=''
                                />
                                {option.title2 || option.title}
                              </Box>
                            ) : (
                              <Box
                                key={ind + '>>'}
                                component='li'
                                sx={{'& > img': {mr: 2, flexShrink: 0}}}
                                {...props}
                              >
                                {option.title}
                              </Box>
                            )}
                          </>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={
                              validateObj.required &&
                              _.get(errors, registerName) &&
                              (_.get(errors, registerName) ||
                                _.get(errors, registerName).type ===
                                  'required' ||
                                _.get(errors, registerName).type === 'manual')
                                ? true
                                : false
                            }
                            label={layout.label !== 'fixed' && title}
                            variant='outlined'
                            size={size}
                            style={{minWidth: '75px'}}
                          />
                        )}
                        error={
                          _.get(errors, registerName) &&
                          _.get(errors, registerName).type === 'required'
                            ? true
                            : false
                        }
                      />
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>

                    {_.get(errors, registerName) &&
                      (_.get(errors, registerName) ||
                        _.get(errors, registerName).type === 'required' ||
                        _.get(errors, registerName).type === 'manual') && (
                        <FormHelperText style={{color: '#d32f2f'}}>
                          {_.get(errors, registerName).message.slice(-1) == '.'
                            ? _.get(errors, registerName).message + ''
                            : _.get(errors, registerName).message + '.'}
                        </FormHelperText>
                      )}
                  </>
                }
              />
            );
          case 'multiSelect':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    <div style={{display: 'flex'}}>
                      <FormControl
                        error={
                          _.get(errors, registerName) &&
                          _.get(errors, registerName).type === 'required'
                            ? true
                            : false
                        }
                        fullWidth
                        size={size}
                      >
                        {layout.label !== 'fixed' && (
                          <InputLabel id={name}>{title}</InputLabel>
                        )}
                        <Select
                          labelId={name}
                          id='demo-mutiple-chip'
                          className='mymultiSelCss'
                          style={{
                            // marginTop: '5px',
                            padding: multiSelect[registerName]?.length
                              ? '2px 2px'
                              : '5px 2px',
                          }}
                          multiple
                          {...preValue}
                          {...register(registerName, validateObj)}
                          value={
                            multiSelect && multiSelect[registerName]
                              ? multiSelect[registerName]
                              : preValue &&
                                'defaultValue' in preValue &&
                                _.isArray(preValue.defaultValue)
                              ? preValue.defaultValue
                              : []
                          }
                          // size='small'
                          onChange={(e) => {
                            if (e?.target?.value?.includes('<<==ALL==>>')) {
                              setMultiSelect({
                                ...multiSelect,
                                [registerName]: bindObjArr(options),
                              });
                              register(registerName).onChange(e);
                              handelChange(name, bindObjArr(options));
                              handelSaveValue(
                                registerName,
                                bindObjArr(options),
                              );
                            } else {
                              setMultiSelect({
                                ...multiSelect,
                                [registerName]: e.target.value,
                              });
                              register(registerName).onChange(e);
                              handelChange(name, e.target.value);
                              handelSaveValue(registerName, e.target.value);
                            }
                          }}
                          // // onBlur={() => onBlur(registerName)}
                          disableUnderline
                          input={<Input id='select-multiple-chip' />}
                          renderValue={(selected) => (
                            <div className={classes.chips}>
                              {selected &&
                                selected.length &&
                                selected.map((value) =>
                                  value &&
                                  Object.keys(disableField).length === 0 ? (
                                    <Chip
                                      key={value}
                                      label={
                                        options &&
                                        options.filter(
                                          (ch) => ch.value == value,
                                        )[0] &&
                                        options.filter(
                                          (ch) => ch.value == value,
                                        )[0].title
                                          ? options &&
                                            options.filter(
                                              (ch) => ch.value == value,
                                            )[0].title
                                          : null
                                      }
                                      clickable
                                      deleteIcon={
                                        <CancelIcon
                                          onMouseDown={(event) =>
                                            event.stopPropagation()
                                          }
                                        />
                                      }
                                      className={classes.chip}
                                      onDelete={(e) => {
                                        let ms =
                                          multiSelect &&
                                          multiSelect[registerName];
                                        let index = ms.indexOf(value);
                                        if (index > -1) {
                                          ms.splice(index, 1);
                                        }
                                        setMultiSelect({
                                          ...multiSelect,
                                          [registerName]: ms,
                                        });
                                        handelChange(name, ms);
                                        handelSaveValue(name, ms);
                                      }}
                                    />
                                  ) : (
                                    <Chip
                                      key={value}
                                      label={
                                        options &&
                                        options.filter(
                                          (ch) => ch.value == value,
                                        )[0] &&
                                        options.filter(
                                          (ch) => ch.value == value,
                                        )[0].title
                                          ? options &&
                                            options.filter(
                                              (ch) => ch.value == value,
                                            )[0].title
                                          : null
                                      }
                                      clickable
                                      className={classes.chip}
                                    />
                                  ),
                                )}
                            </div>
                          )}
                          MenuProps={MenuProps}
                          // variant='outlined'
                          {...disableField}
                        >
                          {options?.length ? (
                            <MenuItem key={'<<==ALL==>>'} value={'<<==ALL==>>'}>
                              <Checkbox
                                checked={
                                  (multiSelect && multiSelect[registerName]
                                    ? multiSelect[registerName]
                                    : preValue &&
                                      'defaultValue' in preValue &&
                                      _.isArray(preValue.defaultValue)
                                    ? preValue.defaultValue
                                    : []
                                  ).join(',') == bindObjArr(options).join(',')
                                }
                              />
                              {'Select All'}
                            </MenuItem>
                          ) : null}
                          {/* <MenuItem value="ALL">Select All</MenuItem> */}
                          {options &&
                            options.length &&
                            options.map((option) => (
                              <MenuItem
                                key={option.value}
                                value={option.value}
                                style={getStyles(
                                  option.value,
                                  multiSelect[registerName] || [],
                                  theme,
                                )}
                              >
                                <Checkbox
                                  checked={
                                    (multiSelect && multiSelect[registerName]
                                      ? multiSelect[registerName]
                                      : preValue &&
                                        'defaultValue' in preValue &&
                                        _.isArray(preValue.defaultValue)
                                      ? preValue.defaultValue
                                      : []
                                    ).indexOf(option.value) > -1
                                  }
                                />
                                {option.title}
                              </MenuItem>
                            ))}
                        </Select>
                        {_.get(errors, registerName) &&
                          (_.get(errors, registerName) ||
                            _.get(errors, registerName).type === 'required' ||
                            _.get(errors, registerName).type === 'manual') && (
                            <FormHelperText>
                              {_.get(errors, registerName).message}
                            </FormHelperText>
                          )}
                      </FormControl>
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                      {/* {infoMessage?.length ? <span>
												<Tooltip title={
													<ul style={{ listStyleType: "circle", paddingLeft: "10px" }}>
														{infoMessage?.map(infomsg => {
															return (<li>{infomsg}</li>)
														})}
													</ul>
												} placement="left">
													<InfoOutlinedIcon style={{ cursor: "pointer", fontSize: "16px", margin: "16px 0px 0px 5px" }} />
												</Tooltip>
											</span> : null} */}
                    </div>
                  </>
                }
              />
            );
          case 'url':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {/* <label htmlFor={name}>{title}</label> */}
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                      </label>
                    )}
                    <TextField
                      id={name}
                      label={
                        layout.label !== 'fixed' && layout.label !== 'blank'
                          ? title
                          : ''
                      }
                      type='url'
                      {...register(registerName, validateObj)}
                      {...preValue}
                      onChange={(e) => {
                        register(registerName).onChange(e);
                        handelChange(name, e.target.value);
                        handelSaveValue(name, e.target.value);
                      }}
                      // // onBlur={() => onBlur(registerName)}
                      {...disableField}
                      variant='outlined'
                      fullWidth
                      size={size}
                    />
                    {errors && _.get(errors, registerName) && (
                      <span className='red-text'>
                        {_.get(errors, registerName)['message']}
                      </span>
                    )}
                  </>
                }
              />
            );
          case 'ckeditor':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {isCheckBox ? (
                      <span style={{marginLeft: '-10px'}}>
                        <Checkbox
                          defaultChecked={
                            !(isCheckBox && checkLabel[name + 'check'])
                          }
                          id={name + 'check'}
                          onChange={(e) => {
                            if (!e.target.checked) {
                              handelSaveValue(name, null);
                            }
                            setCheckLabel({
                              ...checkLabel,
                              [name + 'check']: !e.target.checked,
                            });
                          }}
                        />
                      </span>
                    ) : null}

                    {/* <label htmlFor={name}>{title}</label> */}
                    {layout.label == 'fixed' && title && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}

                    <CKEditor
                      editor={ClassicEditor}
                      config={{
                        toolbar: [
                          // { name: 'document', groups: [ 'mode', 'document', 'doctools' ], items: [ 'Source', '-', 'Save', 'NewPage', 'ExportPdf', 'Preview', 'Print', '-', 'Templates' ] },
                          // { name: 'clipboard', groups: [ 'clipboard', 'undo' ], items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
                          // { name: 'editing', groups: [ 'find', 'selection', 'spellchecker' ], items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
                          // { name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
                          '/',
                          {
                            name: 'basicstyles',
                            groups: ['basicstyles', 'cleanup'],
                            items: [
                              'Bold',
                              'Italic',
                              'Underline',
                              'Strike',
                              'Subscript',
                              'Superscript',
                              '-',
                              'CopyFormatting',
                              'RemoveFormat',
                            ],
                          },
                          {
                            name: 'paragraph',
                            groups: [
                              'list',
                              'indent',
                              'blocks',
                              'align',
                              'bidi',
                            ],
                            items: [
                              'NumberedList',
                              'BulletedList',
                              '-',
                              'Outdent',
                              'Indent',
                              '-',
                              'Blockquote',
                              'CreateDiv',
                              '-',
                              'JustifyLeft',
                              'JustifyCenter',
                              'JustifyRight',
                              'JustifyBlock',
                              '-',
                              'BidiLtr',
                              'BidiRtl',
                              'Language',
                            ],
                          },
                          {name: 'links', items: ['Link', 'Unlink']},
                          {
                            name: 'insert',
                            items: ['Table', 'HorizontalRule', 'PageBreak'],
                          },
                          '/',
                          {
                            name: 'styles',
                            items: ['Styles', 'Format', 'Font', 'FontSize'],
                          },
                          {name: 'colors', items: ['TextColor', 'BGColor']},
                          {name: 'tools', items: ['Maximize', 'ShowBlocks']},
                          // { name: 'others', items: [ '-' ] },
                          // { name: 'about', items: [ 'About' ] }
                        ],
                        readOnly:
                          disabled ||
                          (isCheckBox && checkLabel[name + 'check']),
                      }}
                      activeClass='p10'
                      content={watch(name)}
                      data={watch(name)}
                      onChange={(e, editor) => {
                        const data = editor.getData();
                        if (data !== watch(name)) {
                          handelChangeCkEditor(name, data);
                          handelSaveValue(name, data);
                        }
                      }}
                      // events={{
                      // 	change: (e) => {
                      // 		const data = e.editor.getData();
                      // 		if (data !== watch(name)) {
                      // 			handelChangeCkEditor(name, data);
                      // 			handelSaveValue(name, data);
                      // 		}
                      // 	},
                      // 	// blur: () => onBlur(registerName),
                      // }}
                    />
                    <input
                      {...preValue}
                      {...register(registerName, validateObj)}
                      value={preValue.defaultValue}
                      type='hidden'
                    />
                    {errors && _.get(errors, registerName) && (
                      <span className='red-text' style={{color: '#f44336'}}>
                        {_.get(errors, registerName)['message']}
                      </span>
                    )}
                  </>
                }
              />
            );
          case 'file':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{
                  xs: xsv,
                  key: name,
                  spacing: spacing,
                  style: {...style},
                }}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label htmlFor={name} className={classes.label}>
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Controller
                        {...register(registerName, validateObj)}
                        control={control}
                        render={({field}) => (
                          <input
                            {...field}
                            value={undefined}
                            accept={accept}
                            className={classes.input}
                            style={{display: 'none'}}
                            id={registerName}
                            multiple={multiple}
                            type='file'
                            onChange={(e) => {
                              clearErrors(registerName);
                              if (isProfile == true) {
                                var image = document.getElementById(
                                  registerName + 'image_round',
                                );
                                image.src = URL.createObjectURL(
                                  e.target.files[0],
                                );
                              }
                              var image2 = document.getElementById(
                                registerName + 'image_round2',
                              );
                              image2.href = URL.createObjectURL(
                                e.target.files[0],
                              );
                              setValue(registerName, e.target.files);
                              // register(registerName).onChange(e);
                              handelChange(name, e.target.files[0]);
                              onBlur(registerName);
                              // field.onChange(e);
                            }}
                            {...disableField}
                          />
                        )}
                      />
                      <Tooltip
                        title={
                          (watch(registerName) &&
                            watch(registerName)[0] &&
                            watch(registerName)[0].name) ||
                          field.tempFilename ||
                          'Add File'
                        }
                      >
                        <label htmlFor={registerName}>
                          <div
                            style={
                              isProfile == true
                                ? {
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    overflow: 'hidden',
                                    backgroundColor: 'blue',
                                  }
                                : {}
                            }
                            color={
                              watch(registerName) &&
                              watch(registerName)[0] &&
                              watch(registerName)[0].name
                                ? 'secondry'
                                : 'primary'
                            }
                            aria-label='upload picture'
                            size={size}
                            component='span'
                          >
                            {isProfile == true ? (
                              <img
                                id={registerName + 'image_round'}
                                src='/assets/images/upload.png'
                                onError={(event) =>
                                  (event.target.src =
                                    '/assets/images/placeholder.jpg')
                                }
                                width='200'
                              />
                            ) : (
                              <div
                                variant='contained'
                                startIcon={<CloudUploadIcon />}
                                component='span'
                                size={size}
                                style={{
                                  minHeight: size == 'medium' ? '51px' : '36px',
                                  color: 'white',
                                  padding: '10px',
                                  borderRadius: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  background:
                                    field.tempFilename ||
                                    (watch(registerName) &&
                                      watch(registerName)[0] &&
                                      watch(registerName)[0].name)
                                      ? '#d6d6d4'
                                      : '#00dcff',
                                }}
                              >
                                {(watch(registerName) &&
                                  watch(registerName)[0] &&
                                  watch(registerName)[0].name &&
                                  watch(registerName)[0].name.substring(
                                    0,
                                    title && title.length,
                                  )) ||
                                  //  field.tempFilename
                                  (field?.tempFilename?.slice(10)
                                    ? '...' +
                                      field?.tempFilename?.slice(
                                        field?.tempFilename?.length > 10
                                          ? field?.tempFilename?.length - 10
                                          : 0,
                                      )
                                    : field?.tempFilename) ||
                                  title ||
                                  'Upload'}
                              </div>
                            )}
                          </div>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            {fileName &&
                              watch(registerName) &&
                              watch(registerName)[0] &&
                              watch(registerName)[0].name}
                          </span>
                        </label>
                      </Tooltip>
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='right'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '7px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                      <Tooltip title={watch(registerName) ? 'Preview' : ''}>
                        <>
                          <div
                            style={{
                              cursor: 'pointer',
                              color: 'rgb(0, 220, 255)',
                              marginLeft: '15px',
                              marginTop: '8px',
                              display:
                                !watch(registerName) ||
                                typeof watch(registerName) == 'string'
                                  ? ''
                                  : 'none',
                            }}
                          >
                            <VisibilityIcon
                              onClick={() => {
                                if (field?.tempFilename)
                                  downDoc?.openDoc(field?.tempFilename);
                              }}
                            />
                          </div>
                          <a
                            id={registerName + 'image_round2'}
                            target='_blank'
                            style={{
                              cursor: 'pointer',
                              display:
                                !watch(registerName) ||
                                typeof watch(registerName) == 'string'
                                  ? 'none'
                                  : '',
                              color: 'rgb(0, 220, 255)',
                              marginLeft: '15px',
                              marginTop: '8px',
                            }}
                          >
                            <VisibilityIcon />
                          </a>
                        </>
                      </Tooltip>
                    </div>
                    {/* <div class="circular_image_profile">
										<img id={registerName+"image_round"} width="200" />
									</div> */}
                    {errors && _.get(errors, registerName) && (
                      <span className='red-text' style={{color: '#f44336'}}>
                        {_.get(errors, registerName)['message']}
                      </span>
                    )}
                  </>
                }
              />
            );
          case 'button':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        id='btnMui123'
                        disabled={buttonFor && greenIcon?.includes(buttonFor)}
                        style={{marginTop: '42px', minWidth: '74px'}}
                        variant='contained'
                        onClick={() => {
                          if (SecretFunc) SecretFunc(title);
                        }}
                      >
                        {title}
                      </Button>
                    </div>
                  </>
                }
              />
            );
          case 'attachment':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {title && (
                      <label htmlFor={name} className={classes.label}>
                        {title + ': '}
                      </label>
                    )}
                    {preValue.defaultValue && (
                      <Attachment src={preValue.defaultValue} />
                    )}
                  </>
                }
              />
            );
          case 'map':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {title && (
                      <label htmlFor={name} className={classes.label}>
                        {title + ': '}
                      </label>
                    )}
                    <div style={{display: 'flex'}}>
                      <Map
                        id={name}
                        label={
                          layout.label !== 'fixed' && layout.label !== 'blank'
                            ? title
                            : ''
                        }
                        {...register(registerName, {...validateObj, pattern})}
                        {...preValue}
                        // defaultValue={preValue.defaultValue}
                        onChange={(val) => {
                          //register(registerName).onChange(e);
                          handelChange(name, val);
                          handelSaveValue(name, val);
                        }}
                        {...disableField}
                        size={size}

                        // error={
                        // 	_.get(errors, registerName) &&
                        // 		(_.get(errors, registerName) ||
                        // 			_.get(errors, registerName).type === 'required' ||
                        // 			_.get(errors, registerName).type === 'manual')
                        // 		? true
                        // 		: false
                        // }
                        // helperText={
                        // 	_.get(errors, registerName) &&
                        // 		(_.get(errors, registerName) ||
                        // 			_.get(errors, registerName).type === 'required' ||
                        // 			_.get(errors, registerName).type === 'manual')
                        // 		? _.get(errors, registerName).message
                        // 		: ''
                        // }
                      />
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='left'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>
                  </>
                }
              />
            );
          case 'mappl':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    {layout.label == 'fixed' && (
                      <label
                        htmlFor={name}
                        className={classes.label}
                        style={{width: '100%'}}
                      >
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                        {greenIcon?.includes(name) && (
                          <span style={{float: 'right', marginRight: '8%'}}>
                            <img
                              style={{width: '20px', marginBottom: '-50px'}}
                              src='/assets/images/tick.svg'
                            />
                          </span>
                        )}
                      </label>
                    )}
                    <div style={{display: 'flex', marginTop: '5px'}}>
                      <Controller
                        {...register(registerName, validateObj)}
                        control={control}
                        render={({field}) => (
                          <Gmap
                            {...field}
                            id={name}
                            label={
                              layout.label !== 'fixed' &&
                              layout.label !== 'blank'
                                ? title
                                : ''
                            }
                            // {...register(registerName, { ...validateObj, pattern })}
                            {...preValue}
                            onChange={(val) => {
                              if (distribute?.length > 0) {
                                distribute?.map((char, index) => {
                                  let fData =
                                    fields.filter(
                                      (d) => d?.name == char?.name,
                                    ) ?? [];
                                  setValue(
                                    char?.name,
                                    val[char?.value] ?? fData[0]?.defaultValue,
                                  );
                                  if (
                                    val[char.value] ||
                                    fData[0]?.defaultValue
                                  ) {
                                    clearErrors(char?.name);
                                  }
                                });
                              }
                              if (val.locName) {
                                clearErrors(registerName);
                              }
                              handelChange(name, val);
                              handelSaveValue(name, val);
                            }}
                            {...disableField}
                            size={size}
                            distribute={distribute}
                          />
                        )}
                      />
                      {infoMessage?.length ? (
                        <span>
                          <Tooltip
                            title={
                              <ul
                                style={{
                                  listStyleType: 'circle',
                                  paddingLeft: '10px',
                                }}
                              >
                                {infoMessage?.map((infomsg) => {
                                  return <li>{infomsg}</li>;
                                })}
                              </ul>
                            }
                            placement='left'
                          >
                            <InfoOutlinedIcon
                              style={{
                                cursor: 'pointer',
                                fontSize: '16px',
                                margin: '16px 10px 0px 5px',
                              }}
                            />
                          </Tooltip>
                        </span>
                      ) : null}
                    </div>

                    {errors && _.get(errors, registerName) && (
                      <span className='red-text' style={{color: '#f44336'}}>
                        {_.get(errors, registerName)['message']}
                      </span>
                    )}
                  </>
                }
              />
            );
          case 'array':
            return (
              <>
                {/* {registerName} */}
                <FieldWrapper
                  type={layout && layout.type}
                  attr={{
                    xs: xsv,
                    key: name,
                    spacing: spacing,
                    style: {overflowX: 'auto', ...style},
                  }}
                  content={
                    <>
                      <FieldArray
                        {...{
                          path: registerName,
                          control,
                          register,
                          defaultValues,
                          object,
                          from,
                          getValues,
                          watch,
                          setError,
                          clearErrors,
                          setValue,
                          // // onBlur: (fldName) => { onBlur(fldName); },
                          errors,
                          name,
                          disabled,
                          readOnly,
                          reset,
                          subFields,
                          style,
                          arrLayout: field.layout,
                          columns: field.columns,
                        }}
                      />
                    </>
                  }
                />
              </>
            );

          case 'table':
            return (
              preValue.defaultValue && (
                <FieldWrapper
                  type={layout && layout.type}
                  attr={{
                    xs: xsv,
                    key: name,
                    spacing: spacing,
                    style: {...style},
                  }}
                  content={
                    <Table
                      columns={field.columns}
                      rows={preValue.defaultValue}
                    />
                  }
                />
              )
            );

          case 'switchToggle':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <>
                    <FormControl
                      component='fieldset'
                      error={
                        _.get(errors, registerName) &&
                        _.get(errors, registerName).type === 'required'
                          ? true
                          : false
                      }
                      size={size}
                      style={{flexDirection: 'row'}}
                    >
                      <label
                        htmlFor={name}
                        style={{
                          display: 'flex',
                          marginRight: '16px',
                          alignItems: 'center',
                        }}
                      >
                        {title}
                        {validationProps?.required && (
                          <span style={{color: 'red'}}>*</span>
                        )}
                      </label>
                      <AppTooltip title={watch(name)} placement='right'>
                        <div className='sf-label'>
                          <Controller
                            {...register(registerName, validateObj)}
                            control={control}
                            render={({field}) => (
                              <FormControlLabel
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  let t_val;
                                  if (e.target.checked)
                                    t_val = options[0]?.value;
                                  else t_val = options[1]?.value;
                                  handelSaveValue(name, t_val);
                                  handelChange(name, t_val);
                                }}
                                {...disableField}
                                control={
                                  <SwitchToggle
                                    defaultChecked={
                                      preValue.defaultValue ===
                                      options[0]?.value
                                    }
                                    id={name}
                                    color='primary'
                                    // style={{ marginTop: "20px" }}
                                  />
                                }
                              />
                            )}
                          />
                        </div>
                      </AppTooltip>
                    </FormControl>
                  </>
                }
              />
            );
          case 'section':
            return (
              <FieldWrapper
                type={layout && layout.type}
                attr={{xs: xsv, key: name, spacing: spacing, style: {...style}}}
                content={
                  <Grid container spacing={2}>
                    {title && (
                      <Grid item xs={12} className={classes.label}>
                        {title + ': '}
                      </Grid>
                    )}
                    <Fields
                      setSuccessIcon={setSuccessIcon}
                      SecretFunc={SecretFunc}
                      {...sectionProps}
                    />
                  </Grid>
                }
              />
            );
          default:
            return (
              <Grid item xs={xsv} key={name}>
                <span className='red-text'>Invalid Field</span>
              </Grid>
            );
        }
      })}
    </>
  );
}

export default Fields;
