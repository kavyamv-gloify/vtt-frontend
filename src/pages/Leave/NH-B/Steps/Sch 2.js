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
import _ from 'lodash';
import React, {useEffect, useState} from 'react';

const Sch2 = ({clickedSwitch, activeStep, setActiveStep, setClickedSwitch}) => {
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

  const editableFields = [
    'openingBalance',
    'Additionsduringtheyear',
    'Deductionsduringtheyear',
    'BalanceinProfitandLossAccount',
  ];

  let repeatedChild = [
    {
      title: 'a)Opening Balance',
      rightRow: {
        name: 'openingBalance',
        type: 'text',
      },
      key: 'openingBalance',
    },
    {
      title: 'b)Additions during the year',
      rightRow: {
        name: 'Additionsduringtheyear',
        type: 'text',
      },
      key: 'Additionsduringtheyear',
    },
    {
      title: 'c)Deductions during the year',
      rightRow: {
        name: 'Deductionsduringtheyear',
        type: 'text',
      },
      key: 'Deductionsduringtheyear',
    },
  ];
  let fields = {
    title:
      'Schedule 2 - Reserves and Surplus (A + B + C + D + E + F + G + H + I)',
    rightRow: {
      name: 'Schedule2ReservesandSurplus',
      type: 'text',
    },
    key: 'Schedule2ReservesandSurplus',
    child: [
      {
        title: 'A. Statutory Reserve (a + b - c)',
        rightRow: {
          name: 'Schedule2ReservesandSurplus',
          type: 'text',
        },
        key: 'Schedule2ReservesandSurplus',
        child: repeatedChild,
      },
      {
        title: 'B. Share Premium (a + b - c)',
        rightRow: {
          name: 'SharePremium',
          type: 'text',
        },
        key: 'SharePremium',
        child: repeatedChild,
      },
      {
        title:
          'D. Special Reserve u/s 36(1) of Income Tax Act 1961 (a + b - c)',
        rightRow: {
          name: 'GeneralReserve',
          type: 'text',
        },
        key: 'GeneralReserve',
        child: repeatedChild,
      },
      {
        title:
          'D. Special Reserve u/s 36(1) of Income Tax Act 1961 (a + b - c)',
        rightRow: {
          name: 'SpecialReserve',
          type: 'text',
        },
        key: 'SpecialReserve',
        child: repeatedChild,
      },
      {
        title: 'E. Capital Reserve (a + b - c)',
        rightRow: {
          name: 'CapitalReserve',
          type: 'text',
        },
        key: 'CapitalReserve',
        child: repeatedChild,
      },
      {
        title: 'F. Foreign Currency Translation Reserve',
        rightRow: {
          name: 'ForeignCurrencyTranslationReserve',
          type: 'text',
        },
        key: 'ForeignCurrencyTranslationReserve',
        child: repeatedChild,
      },
      {
        title: 'G. Revaluation Reserve (a + b - c)',
        rightRow: {
          name: 'RevaluationReserve',
          type: 'text',
        },
        key: 'RevaluationReserve',
        child: repeatedChild,
      },
      {
        title: 'H. Revenue and other Reserves (I + II + III)',
        rightRow: {
          name: 'RevenueandotherReserves',
          type: 'text',
        },
        key: 'RevenueandotherReserves',
        child: [
          {
            title: 'I.Investment Reserve Account(a + b - c)',
            isBold: true,
            rightRow: {
              name: 'InvestmentReserveAccount',
              type: 'text',
            },
            key: 'InvestmentReserveAccount',
            child: repeatedChild,
          },
          {
            title: 'II. Other Revenue Reserves (a + b - c)',
            isBold: true,
            rightRow: {
              name: 'OtherRevenueReserves',
              type: 'text',
            },
            key: 'OtherRevenueReserves',
            child: repeatedChild,
          },
          {
            title: 'III. Other Reserves (a + b - c)',
            isBold: true,
            rightRow: {
              name: 'OtherReserves',
              type: 'text',
            },
            key: 'OtherReserves',
            child: repeatedChild,
          },
        ],
      },
      {
        title: 'I. Balance in Profit and Loss Account',
        rightRow: {
          name: 'BalanceinProfitandLossAccount',
          type: 'text',
        },
        key: 'BalanceinProfitandLossAccount',
      },
    ],
  };

  // useEffect(() => {
  function updateData(tem) {
    Object.entries(tem)?.map(([k1, v1]) => {
      v1.value = 0;
      Object.entries(v1)?.map(([k2, v2]) => {
        if (typeof v2 == 'object') {
          v2.value = editableFields?.includes(k2) ? (v2?.value || 0) - 0 : 0;
          if (k2 == 'Deductionsduringtheyear') {
            v1.value = v1.value - v2?.value;
          } else {
            v1.value = v1.value + v2?.value;
          }
        }
        Object.entries(v2)?.map(([k3, v3]) => {
          if (typeof v3 == 'object') {
            v3.value = editableFields?.includes(k3) ? (v3?.value || 0) - 0 : 0;
            if (k3 == 'Deductionsduringtheyear') {
              v2.value = v2.value - v3?.value;
              v1.value = v1.value - v3?.value;
            } else {
              v2.value = v2.value + v3?.value;
              v1.value = v1.value + v3?.value;
            }
          }
          Object.entries(v3)?.map(([k4, v4]) => {
            if (typeof v4 == 'object') {
              v4.value = editableFields?.includes(k4)
                ? (v4?.value || 0) - 0
                : 0;
              if (k4 == 'Deductionsduringtheyear') {
                v3.value = v3.value - v4?.value;
                v2.value = v2.value - v4?.value;
                v1.value = v1.value - v4?.value;
              } else {
                v3.value = v3.value + v4?.value;
                v2.value = v2.value + v4?.value;
                v1.value = v1.value + v4?.value;
              }
            }
          });
        });
      });
    });
    console.log(tem, 'fsadfsdfasdfsafdasdfsaf');
    setFormData({...tem});
  }
  // }, [formData]);
  return (
    <div>
      <TableContainer sx={{mb: 8}}>
        <Table aria-label='sticky table' style={{border: '1px solid #e0e0e0'}}>
          <TableHead>
            <TableRow>
              <TableCell key={'left-head'}></TableCell>
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
            <TableRow>
              <TableCell sx={{fontWeight: 600}}>{fields?.title}</TableCell>
              <TableCell sx={{fontWeight: 600}}>
                <TextField
                  fullWidth
                  size='small'
                  value={formData[fields.key]?.value}
                  disabled
                />
              </TableCell>
            </TableRow>
            {fields?.child?.map((el1, ind1) => {
              let tem1 = formData || {};
              tem1[fields.key] = tem1[fields.key] || {};
              tem1[fields.key][el1.key] = tem1[fields?.key][el1.key] || {};
              return (
                <>
                  <TableRow>
                    <TableCell sx={{fontWeight: 600}}>{el1?.title}</TableCell>
                    <TableCell sx={{fontWeight: 600}}>
                      <TextField
                        fullWidth
                        disabled={!editableFields?.includes(el1?.key)}
                        size='small'
                        value={formData[fields.key][el1.key]?.value}
                        onInput={(e) => {
                          console.log(e.target.value);
                          let tem = formData || {};
                          tem[fields.key][el1.key].value = getValue(
                            e?.target?.value,
                            tem[fields.key][el1.key].value,
                            {isNumber: true, maxVal: 100000},
                          );
                          updateData(tem);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  {el1?.child?.map((el2, ind2) => {
                    tem1[fields.key][el1.key][el2.key] =
                      tem1[fields.key][el1.key][el2.key] || {};
                    return (
                      <>
                        <TableRow>
                          <TableCell sx={{fontWeight: el2.isBold ? 600 : 400}}>
                            {el2?.title}
                          </TableCell>
                          <TableCell sx={{fontWeight: 600}}>
                            <TextField
                              disabled={!editableFields?.includes(el2?.key)}
                              fullWidth
                              size='small'
                              value={
                                formData[fields.key][el1.key][el2.key]?.value
                              }
                              onInput={(e) => {
                                let tem = formData || {};
                                tem[fields.key][el1.key][el2.key].value =
                                  getValue(
                                    e?.target?.value,
                                    tem[fields.key][el1.key][el2.key].value,
                                    {isNumber: true, maxVal: 100000},
                                  );
                                updateData(tem);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                        {el2?.child?.map((el3, ind3) => {
                          tem1[fields.key][el1.key][el2.key][el3.key] =
                            tem1[fields.key][el1.key][el2.key][el3.key] || {};
                          return (
                            <>
                              <TableRow>
                                <TableCell>{el3?.title}</TableCell>
                                <TableCell sx={{fontWeight: 600}}>
                                  <TextField
                                    fullWidth
                                    size='small'
                                    disabled={
                                      !editableFields?.includes(el3?.key)
                                    }
                                    value={
                                      formData[fields.key][el1.key][el2.key][
                                        el3.key
                                      ]?.value
                                    }
                                    onInput={(e) => {
                                      let tem = formData || {};
                                      tem[fields.key][el1.key][el2.key][
                                        el3.key
                                      ].value = getValue(
                                        e?.target?.value,
                                        tem[fields.key][el1.key][el2.key][
                                          el3.key
                                        ].value,
                                        {isNumber: true, maxVal: 100000},
                                      );
                                      updateData(tem);
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                      </>
                    );
                  })}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
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

export default Sch2;
