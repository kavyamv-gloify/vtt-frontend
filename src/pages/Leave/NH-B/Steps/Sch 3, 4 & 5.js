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

const Sch3_4_5 = ({
  clickedSwitch,
  activeStep,
  setActiveStep,
  setClickedSwitch,
}) => {
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
  const fields = [
    [
      {
        title: 'Schedule 3 - Deposits (I + II + III)',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'Schedule3Deposits',
        type: 'text',
        disabled: true,
      },
    ],
    [
      {
        title: 'I. Demand/Current Deposits (a + b)',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'DemandCurrentDeposits',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'a)From banks',
        type: 'heading',
      },
      {
        name: 'FromBanks1',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'b)From others',
        type: 'heading',
      },
      {
        name: 'Fromothers1',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'II. Savings Bank Deposits',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'SavingsBankDeposits',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'III. Term Deposits (a + b)',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'TermDeposits',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'a)From banks',
        type: 'heading',
      },
      {
        name: 'FromBanks2',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'b)From others',
        type: 'heading',
      },
      {
        name: 'Fromothers2',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'A.Deposits of branches in India',
        type: 'heading',
      },
      {
        name: 'DepositsofbranchesinIndia',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'B.Deposits of branches outside India',
        type: 'heading',
      },
      {
        name: 'DepositsofbranchesoutsideIndia',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'Schedule 4 - Borrowings (I + II)',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'Schedule4Borrowings',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'I. Borrowings in India (a + b + c)',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'BorrowingsinIndia',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'a From RBI',
        type: 'heading',
      },
      {
        name: 'FromRBI',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'b From other banks',
        type: 'heading',
      },
      {
        name: 'Fromotherbanks',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title:
          'c From other institutions and agencies (Not included in Sch 1 - Capital)',
        type: 'heading',
      },
      {
        name: 'Fromotherinstitutionsandagencies',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'c.1 Innovative Perpetual Debt Instruments (IPDI)',
        type: 'heading',
      },
      {
        name: 'InnovativePerpetualDebtInstruments',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'c.2 Subordinated Debts and Bonds',
        type: 'heading',
      },
      {
        name: 'SubordinatedDebtsandBonds',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'c.3 Others',
        type: 'heading',
      },
      {
        name: 'Others',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'II. Borrowings Outside India',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'BorrowingsOutsideIndia',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'II.1 Capital Instruments (IPDI, Bonds, Debentures, etc.)',
        type: 'heading',
      },
      {
        name: 'CapitalInstruments',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'II.2 Bonds and Notes',
        type: 'heading',
      },
      {
        name: 'BondsandNotes',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'II.3 All Other Borrowings',
        type: 'heading',
      },
      {
        name: 'AllOtherBorrowings',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'Secured Borrowings included in I and II above',
        type: 'heading',
      },
      {
        name: 'SecuredBorrowingsincluded',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title:
          'Schedule 5 - Other Liabilities and Provisions (I + II + III + IV)',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'OtherLiabilitiesandProvisions',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'I.Bills Payable',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'BillsPayable',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'II.Inter - Office Adjustments (net)',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'InterOfficeAdjustments',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'III.Interest Accrued',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'InterestAccrued',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'IV. Other (including Provisions)',
        style: {fontWeight: 600},
        type: 'heading',
      },
      {
        name: 'OtherincludingProvisions',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'IV.1 Prudential Provisions against Standard Assets',
        style: {paddingLeft: '20px'},
        type: 'heading',
      },
      {
        name: 'PrudentialProvisionsagainstStandardAssets',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'IV.2 Proposed Dividend (incl. Tax on Dividend)',
        style: {paddingLeft: '20px'},
        type: 'heading',
      },
      {
        name: 'ProposedDividend',
        type: 'text',
        formula: '',
      },
    ],
    [
      {
        title: 'IV.3 Deferred Tax Liabilities (net)',
        style: {paddingLeft: '20px'},
        type: 'heading',
      },
      {
        name: 'DeferredTaxLiabilities',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
    [
      {
        title: 'IV.4 All Others',
        type: 'heading',
        style: {paddingLeft: '20px'},
      },
      {
        name: 'AllOthers',
        type: 'text',
        disabled: true,
        formula: '',
      },
    ],
  ];
  function updateData(d, nm) {
    let tem = formData;
    tem[nm] = getValue(d, formData[nm], {isNumber: true, maxVal: 100000});
    //FORMULA - 1
    tem.DemandCurrentDeposits =
      (tem?.FromBanks1 || 0) - 0 + ((tem?.Fromothers1 || 0) - 0);
    //Write FORMULAS - 2 to n
    setFormData({...tem});
  }
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
            {fields?.map((ele, ind) => {
              return (
                <TableRow>
                  {ele?.map((col) => {
                    let style = col.style || {};
                    const {type} = col;
                    return (
                      <TableCell style={{...style}}>
                        {type == 'text' ? (
                          <TextField
                            fullWidth
                            size='small'
                            name={col.name}
                            disabled={col.disabled}
                            value={formData[col.name]}
                            onInput={(e) => {
                              updateData(e?.target?.value, col.name);
                            }}
                          />
                        ) : (
                          col.title
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

export default Sch3_4_5;
