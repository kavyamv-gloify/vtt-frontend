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

const AssetsLiab = ({
  clickedSwitch,
  activeStep,
  setActiveStep,
  setClickedSwitch,
}) => {
  const [formData, setFormData] = useState({});
  function getValue(val, nm, elm) {
    if (
      !val ||
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
    //Use save as draft API to save
    alert('Data saved as draft.');
    setActiveStep(clickedSwitch);
  }
  let fields = [
    [
      {
        title: 'Capital - Schedule 1',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'capitalSchedule1',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Reserve and Surplus - Schedule 2',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'reserveAndSurplusSchedule2',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Deposits - Schedule 3',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'depositsSchedule3',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Borrowings - Schedule 4',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'borrowingsSchedule4',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Other Liabilities and Provisions - Schedule 5',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'otherLiabilitiesAndProvisionsSchedule5',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Total Capital and Liabilities',
        textOnly: true,
        align: 'left',
        isBold: true,
      },
      {
        name: 'totalCapitalAndLiabilities',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Assets',
        textOnly: true,
        align: 'left',
        isBold: true,
        colSpan: 2,
      },
    ],
    [
      {
        title: 'Cash and Balances with RBI - Schedule 6',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'CashAndBalancesWithRBISchedule6',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title:
          'Balances with Banks and Money at Call and Short Notice - Schedule 7',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'BalancesWithBanksAndMoneyAtCallAndShortNoticeSchedule7',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Investments - Schedule 8',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'InvestmentsSchedule8',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Advances - Schedule 9',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'AdvancesSchedule9',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Fixed assets - Schedule 10',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'FixedAssetsSchedule10',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Other assets - Schedule 11',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'OtherAssetsSchedule11',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Total Assets',
        textOnly: true,
        align: 'left',
        isBold: true,
      },
      {
        name: 'TotalAssets',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Contingent Liabilities - Schedule 12',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'ContingentLiabilitiesSchedule12',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Contingent Liabilities - Schedule 12',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'ContingentLiabilitiesSchedule12',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Bills for Collection',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'BillsForCollection',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Credit Equivalent of OBS Exposures (as per Basel-II)',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'CreditEquivalentOfOBSExposuresAsPerBaselII',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Contingent Credits',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'ContingentCredits',
        type: 'text',
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Derivatives',
        textOnly: true,
        align: 'left',
        isBold: false,
      },
      {
        name: 'Derivatives',
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
                Capital and Liabilities
              </TableCell>
              <TableCell
                key={'right-head'}
                align={'right'}
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

export default AssetsLiab;
