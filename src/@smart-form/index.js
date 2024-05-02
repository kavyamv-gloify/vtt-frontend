/* eslint-disable */
import React, {useState, useEffect, useRef, createRef} from 'react';
import {makeStyles} from '@mui/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useForm, useWatch} from 'react-hook-form';
import Fields from './component/Fields';
import TopWrapper from './component/TopWrapper';
import _ from './lodash';
import './index.css';

const useStyles = makeStyles(() => ({
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
    background: '#f6f7f9',
    textAlign: 'center',
    padding: '8px 14px',
    marginBottom: '16px',
    fontSize: '18px',
    fontWeight: '400',
  },
  buttonBox: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  button: {
    // margin: 5
  },
  btnContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

// Reusable Form Component
function Form(props) {
  const {
    template,
    onSubmit,
    onBack,
    filterbtnStyle,
    clearStyle,
    watchFields,
    validate,
    onChange,
    getOnInput,
    onBlur,
    setVal,
    clearErr,
    seterrors,
    SecretFun,
    fetchLayoutData,
    setSuccessIcon,
    mode,
    defaultValues,
    buttons,
    onCancel,
    disabled,
    success,
  } = props;
  const classes = useStyles();
  const refSubmitButtom = useRef([]);
  const [values, setValues] = useState({});
  const [isErrorPAGE, setIsErrorPAGE] = useState(false);
  const [buttonName, setButtonName] = useState('');
  const [urName, setUrName] = useState({});
  const [unregisterd, setUnregisterd] = useState([]);
  const [btnDisable, setBtnDisable] = useState({});
  const [clickedHere, setclickedHere] = useState(false);
  const [valid, setValid] = useState(true);
  useEffect(() => {
    let tem_isError = false;
    seterrors?.map((ele) => {
      if (ele?.error == true) tem_isError = true;
    });
    setIsErrorPAGE(tem_isError);
  }, [seterrors]);
  let {
    register,
    unregister,
    handleSubmit,
    formState: {errors},
    trigger,
    watch,
    setError,
    clearErrors,
    control,
    setValue,
    getValues,
    reset,
  } = useForm({defaultValues: defaultValues, mode: mode});
  const formData = useWatch({control, defaultValue: 'default'});
  useEffect(() => {
    if (props.getOnInput) props.getOnInput(formData);
  }, [formData]);
  let {layout, title, fields, sections} = template;
  function SecretFunc(title) {
    if (SecretFun) SecretFun(title, formData);
  }
  const handleBlur = async (fldname) => {
    if (mode == 'all:onBlur') {
      const result = await trigger();
    } else if (mode == 'onBlur') {
      const result = await trigger(fldname);
    }
    try {
      onBlur(watch());
    } catch (err) {}
  };

  function isEmpty(value) {
    return (
      value == null ||
      (value.hasOwnProperty('length') && value.length === 0) ||
      (value.constructor === Object && Object.keys(value).length === 0)
    );
  }

  let urtemp = {};
  const setObjUnName = (obj, fldname) => {
    let unst = urtemp;
    obj &&
      obj.forEach((uobj) => {
        if (unst && unst[uobj]) {
          if (!unst[uobj].includes(fldname)) {
            unst[uobj].push(fldname);
          }
        } else {
          unst = {
            ...unst,
            [uobj]: [fldname],
          };
        }
      });
    urtemp = unst;
    setUrName(urtemp);
  };

  function getNameByKeyName(obj, propKey, btnName) {
    for (var property in obj) {
      if (obj.hasOwnProperty(property)) {
        if (typeof obj[property] == 'object') {
          if (property === propKey) {
            setObjUnName(obj[propKey], obj.name);
          } else if (isEmpty(obj[property])) {
            setObjUnName(obj[propKey], obj.name);
          } else {
            getNameByKeyName(obj[property], propKey, btnName);
          }
        } else {
          if (property === propKey) {
            setObjUnName(obj[propKey], obj.name);
          }
          if (isEmpty(obj[property])) {
            setObjUnName(obj[propKey], obj.name);
          }
        }
      }
    }
  }

  useEffect(() => {
    if (template) {
      let bts = {};
      getNameByKeyName(template, 'unregister');
      if (buttons && buttons.length) {
        buttons.forEach((btn, i) => {
          bts = {
            ...bts,
            [btn]: false,
          };
        });
        setBtnDisable(bts);
        refSubmitButtom.current = buttons.map(
          (element, i) => refSubmitButtom.current[i] ?? createRef(),
        );
      }
    }
  }, [template]);

  useEffect(() => {
    let bts = {};
    if (buttons && buttons.length) {
      buttons.forEach((btn, i) => {
        bts = {
          ...bts,
          [btn]: success == null && success == false ? true : false,
        };
      });
      setBtnDisable(bts);
    }
  }, [success]);

  const handlesubmit = (btn, index) => {
    setButtonName(btn);
    if (urName[btn] && urName[btn].length) {
      urName[btn] && unregister(urName[btn]);
    }
    refSubmitButtom &&
      refSubmitButtom.current &&
      refSubmitButtom.current[index] &&
      refSubmitButtom.current[index].current.click();
  };

  const FormButtons = () => {
    let btnHtml = [];
    if (buttons && buttons.length) {
      buttons.forEach((btn, i) => {
        if (btn == 'reset') {
          btnHtml.push(
            <Button
              id='btnMui123'
              className={classes.button}
              key={btn}
              variant='raised'
              component='span'
              color='primary'
              size={layout.size}
              onClick={() => reset(defaultValues || {})}
            >
              {btn}
            </Button>,
          );
        } else if (btn == 'cancel') {
          btnHtml.push(
            <Button
              id='btnMui123'
              className={classes.button}
              key={btn}
              variant='raised'
              component='span'
              color='primary'
              size={layout.size}
              onClick={onCancel}
            >
              {btn}
            </Button>,
          );
        } else if (btn == 'back') {
          btnHtml.push(
            <Button
              id='btnMui123'
              className={classes.button}
              key={btn}
              variant='raised'
              component='span'
              color='primary'
              size={layout.size}
              onClick={onBack}
            >
              {btn}
            </Button>,
          );
        } else {
          btnHtml.push(
            <>
              <Button
                id='btnMui123'
                className={classes.button}
                key={btn}
                type='button'
                component='button'
                style={btn == 'clear' ? clearStyle : filterbtnStyle}
                disabled={btnDisable[btn]}
                variant='contained'
                color='primary'
                size={layout.size}
                onClick={() => {
                  if (isErrorPAGE) return;
                  if (fetchLayoutData) {
                    fetchLayoutData(formData, template);
                  }
                  setclickedHere(true);
                  handlesubmit(btn, i);
                }}
              >
                {btn}
              </Button>
              <Button
                id='btnMui123'
                hidden={true}
                sx={{display: 'none'}}
                disabled={isErrorPAGE}
                ref={refSubmitButtom.current[i]}
                type={'submit'}
                onClick={handleSubmit((data) => {
                  onSubmit({data, button: btn});
                  setBtnDisable({...btnDisable, [btn]: true});
                })}
              />
            </>,
          );
        }
      });
    }
    if (layout && layout !== 'flex') {
      return <div className={classes.buttonBox}>{btnHtml}</div>;
    }
    return btnHtml;
  };

  const formRender = () => {
    let xsv = (column) => {
      return column == 1
        ? 12
        : column == 2
        ? 6
        : column == 3
        ? 4
        : column == 4
        ? 3
        : column == 6
        ? 2
        : column == 6
        ? 2
        : 12;
    };
    let spacing = (space) => {
      return space || 2;
    };
    let size = (sz) => {
      return sz || '';
    };
    let html = [];
    if (title) {
      html.push(<h4 className={classes.formTitle}>{title}</h4>);
    }
    for (const temp in template) {
      if (temp == 'fields') {
        html.push(
          <>
            <TopWrapper
              type={layout && layout.type}
              spacing={spacing(layout && layout.spacing)}
            >
              <Fields
                // SecretFunc = {SecretFunc}
                {...{
                  register,
                  clickedHere: clickedHere,
                  // tempFilename:tempFilename,
                  errors,
                  watch,
                  setError,
                  clearErrors,
                  control,
                  SecretFunc,
                  setValue,
                  formData,
                  seterrors,
                  setVal,
                  clearErr,
                  setSuccessIcon,
                  getValues,
                  onChange,
                  // onBlur: (fldname) => handleBlur(fldname),
                  defaultValues,
                  reset,
                  fields,
                  layout: {
                    xsv: xsv(layout && layout.column),
                    spacing: spacing(layout && layout.spacing),
                    size: size(layout && layout.size),
                    label: layout && layout.label,
                  },
                }}
              />
            </TopWrapper>
          </>,
        );
      } else if (temp == 'sections') {
        sections.forEach((ele) => {
          html.push(
            <div key={ele.fields.name}>
              {ele && ele.title && (
                <h2 className={classes.sectionTitle}>{ele.title}</h2>
              )}
              <TopWrapper
                type={layout && layout.type}
                spacing={spacing(layout && layout.spacing)}
              >
                <Fields
                  {...{
                    register,
                    errors,
                    watch,
                    clickedHere: clickedHere,
                    control,
                    setValue,
                    formData,
                    setVal,
                    clearErr,
                    seterrors,
                    SecretFunc,
                    setSuccessIcon,
                    setError,
                    clearErrors,
                    getValues,
                    onChange,
                    // onBlur: (fldname) => handleBlur(fldname),
                    disabled,
                    defaultValues,
                    reset,
                    fields: ele.fields,
                    layout: {
                      xsv: xsv(
                        (ele.layout && ele.layout.column) ||
                          (layout && layout.column),
                      ),
                      spacing: spacing(
                        (ele.layout && ele.layout.spacing) ||
                          (layout && layout.spacing),
                      ),
                      size: size(
                        (ele.layout && ele.layout.size) ||
                          (layout && layout.size),
                      ),
                      label:
                        (ele.layout && ele.layout.label) ||
                        (layout && layout.label),
                      type:
                        (ele.layout && ele.layout.type) ||
                        (layout && layout.type),
                    },
                  }}
                />
                {/* {renderFields(ele.fields, {xsv: xsv((ele.layout && ele.layout.column) || (layout && layout.column)), spacing: spacing((ele.layout && ele.layout.spacing) || (layout && layout.spacing)), size: size((ele.layout && ele.layout.size) || (layout && layout.size))})} */}
                {layout && layout.type == 'flex' && <FormButtons />}
              </TopWrapper>
            </div>,
          );
        });
      }
    }

    return html;
  };

  return (
    <div>
      {formRender()}
      {layout && layout.type !== 'flex' && (
        <>
          {!disabled && buttons && buttons.length && (
            <div className={classes.btnContainer}>
              <FormButtons />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Form;
