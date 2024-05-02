import {
  Button,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import React, {useEffect, useState} from 'react';
import Sch1_file2 from './Sch1_File2';

const Sch1 = ({clickedSwitch, activeStep, setActiveStep, setClickedSwitch}) => {
  const [formData, setFormData] = useState({});
  function getValue(val, nm, elm) {
    if (
      (elm.isNumber && _.isNaN(Number(val))) ||
      val > (elm?.maxVal || 100000000)
    ) {
      return nm || '';
    } else {
      return val;
    }
  }
  useEffect(() => {
    if (clickedSwitch != activeStep) onSaveAsDraft();
  }, [clickedSwitch]);

  function onSaveAsDraft() {
    console.log(formData);
    //Use save as draft API to save
    alert('Data saved as draft.');
    setActiveStep(clickedSwitch);
  }
  useEffect(() => {
    console.log(';;;11');
    let tm1 = (formData?.CapitalHeldByGoI1 || 0) - 0;
    let tm2 = (formData?.CapitalHeldByOthers1 || 0) - 0;
    if (formData?.EquityCapital == tm1 + tm2) return;
    setFormData({...formData, EquityCapital: tm1 + tm2});
  }, [formData]);

  useEffect(() => {
    console.log(';;;22');
    let tm1 = (formData?.CapitalHeldByGoI2 || 0) - 0;
    let tm2 = (formData?.CapitalHeldByOthers2 || 0) - 0;
    if (formData?.AnyOtherInstrumentsQualifyingAsCapital == tm1 + tm2) return;
    setFormData({
      ...formData,
      AnyOtherInstrumentsQualifyingAsCapital: tm1 + tm2,
    });
  }, [formData]);

  useEffect(() => {
    let tm1 = (formData?.EquityCapital || 0) - 0;
    let tm2 = (formData?.AnyOtherInstrumentsQualifyingAsCapital || 0) - 0;
    console.log(';;;33', formData?.Schedule1Capital_I_II, tm1, tm2);

    if (formData?.Schedule1Capital_I_II == tm1 + tm2) return;
    setFormData({...formData, Schedule1Capital_I_II: tm1 + tm2});
  }, [formData]);
  console.log(formData, 'formDataformDataformDataformDataformData');
  let fields = [
    [
      {
        title: 'Schedule 1 - Capital (I + II)',
        textOnly: true,
        align: 'left',
        isBold: true,
      },
      {
        name: 'Schedule1Capital_I_II',
        type: 'text',
        disabled: true,
      },
    ],
    [
      {
        title: 'I. Equity Capital',
        textOnly: true,
        align: 'left',
        isBold: true,
      },
      {
        name: 'EquityCapital',
        type: 'text',
        disabled: true,
      },
    ],
    [
      {
        title: 'I.1 Capital held by GoI',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'CapitalHeldByGoI1',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'I.2 Capital held by Others',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'CapitalHeldByOthers1',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'II. Any Other Instruments Qualifying as Capital',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'AnyOtherInstrumentsQualifyingAsCapital',
        type: 'text',
        isNumber: true,
        disabled: true,
      },
    ],
    [
      {
        title: 'II.1 Capital held by GoI',
        textOnly: true,
        align: 'left',
        isBold: true,
      },
      {
        name: 'CapitalHeldByGoI2',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'II.2 Capital held by Others',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'CapitalHeldByOthers2',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
  ];

  return (
    <div>
      <TableContainer sx={{mb: 8}}>
        <Table aria-label='sticky table' style={{border: '1px solid #e0e0e0'}}>
          <TableHead>
            <TableRow>
              <TableCell
                key={'left-head'}
                align={'left'}
                style={{fontWeight: 600}}
              >
                For Indian Banks
              </TableCell>
              <TableCell
                key={'right-head'}
                align={'center'}
                style={{fontWeight: 600}}
              >
                Amount in Rs. Lakhs
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields?.map((row, ind) => {
              return (
                <TableRow key={'row' + ind}>
                  {row?.map((column, ind2) => {
                    return (
                      <TableCell
                        colSpan={column?.colSpan}
                        key={'cell' + ind + ind2}
                        align={column?.align || 'left'}
                        style={{fontWeight: column?.isBold ? 600 : 400}}
                      >
                        {column?.textOnly && column?.title}
                        {column?.type == 'text' && (
                          <TextField
                            size='small'
                            disabled={column?.disabled}
                            fullWidth
                            name={column?.name}
                            value={formData[column?.name]}
                            onInput={(e) => {
                              setFormData({
                                ...formData,
                                [column?.name]: getValue(
                                  e?.target?.value,
                                  formData[column?.name],
                                  column,
                                ),
                              });
                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position='start'>
                                  ₹
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Sch1_file2 />
      <div style={{width: '100%', textAlign: 'center'}}>
        <Button
          variant='outlined'
          onClick={() => {
            setActiveStep(activeStep - 1);
            setClickedSwitch(clickedSwitch - 1);
          }}
        >
          Back
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            onSaveAsDraft();
          }}
          sx={{ml: 2, mr: 2}}
        >
          Save As Draft
        </Button>
        <Button
          onClick={() => {
            setActiveStep(activeStep + 1);
            setClickedSwitch(clickedSwitch + 1);
          }}
          variant='outlined'
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Sch1;
