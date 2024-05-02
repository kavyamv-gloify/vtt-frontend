import {Button, TableContainer, TextField} from '@mui/material';
import React, {useEffect} from 'react';

const AssetsLiab = ({
  clickedSwitch,
  activeStep,
  setActiveStep,
  setClickedSwitch,
}) => {
  useEffect(() => {
    if (clickedSwitch != activeStep) onSaveAsDraft();
  }, [clickedSwitch]);

  function onSaveAsDraft() {
    console.log(formData);
    //Use save as draft API to save
    alert('Data saved as draft.');
    setActiveStep(clickedSwitch);
  }
  let fields = [
    [
      {
        title: 'Capital - Schedule 1',
        textOnly: true,
        align: 'center',
        isBold: false,
      },
      {
        name: 'capitalSchedule1',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Reserve and Surplus - Schedule 2',
        textOnly: true,
        align: 'center',
        isBold: false,
      },
      {
        name: 'reserveAndSurplusSchedule2',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Deposits - Schedule 3',
        textOnly: true,
        align: 'center',
        isBold: false,
      },
      {
        name: 'depositsSchedule3',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Borrowings - Schedule 4',
        textOnly: true,
        align: 'center',
        isBold: false,
      },
      {
        name: 'borrowingsSchedule4',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Other Liabilities and Provisions - Schedule 5',
        textOnly: true,
        align: 'center',
        isBold: false,
      },
      {
        name: 'otherLiabilitiesAndProvisionsSchedule5',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Total Capital and Liabilities',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'totalCapitalAndLiabilities',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Assets',
        textOnly: true,
        align: 'center',
        isBold: true,
        colSpan: 2,
      },
    ],
    [
      {
        title: 'Cash and Balances with RBI - Schedule 6',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'CashAndBalancesWithRBISchedule6',
        type: text,
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
        align: 'center',
        isBold: true,
      },
      {
        name: 'BalancesWithBanksAndMoneyAtCallAndShortNoticeSchedule7',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Investments - Schedule 8',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'InvestmentsSchedule8',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Advances - Schedule 9',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'AdvancesSchedule9',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Fixed assets - Schedule 10',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'FixedAssetsSchedule10',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Other assets - Schedule 11',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'OtherAssetsSchedule11',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Total Assets',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'TotalAssets',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Contingent Liabilities - Schedule 12',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'ContingentLiabilitiesSchedule12',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Contingent Liabilities - Schedule 12',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'ContingentLiabilitiesSchedule12',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Bills for Collection',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'BillsForCollection',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Credit Equivalent of OBS Exposures (as per Basel-II)',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'CreditEquivalentOfOBSExposuresAsPerBaselII',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Contingent Credits',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'ContingentCredits',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    [
      {
        title: 'Derivatives',
        textOnly: true,
        align: 'center',
        isBold: true,
      },
      {
        name: 'Derivatives',
        type: text,
        isNumber: true,
        minVal: 100000,
        maxVal: 999999,
      },
    ],
    {fieldName: 'fields16', minVal: 0, maxVal: 100000, isNumber: true},
  ];
  return (
    <div>
      <TableContainer sx={{maxHeight: '100vh'}}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              <TableCell key={'left-head'} align={'left'}>
                Capital and Liabilities
              </TableCell>
              <TableCell key={'left-head'} align={'right'}>
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
                      <TableCell key={'cell' + ind + ind2} align={column.align}>
                        {column?.textOnly && column?.title}
                        {column?.text && (
                          <TextField fullWidth name={column?.name} />
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
        <Button variant='outlined' disabled>
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
