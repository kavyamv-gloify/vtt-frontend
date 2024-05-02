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
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Sch1_file2 = ({}) => {
  const [myTemData, setMyTemData] = useState({});

  const [IssuedArr, setIssuedArr] = useState([0]);
  const [IssuedCapital, setIssuedCapital] = useState({});

  const [SubscribedArr, setSubscribedArr] = useState([0]);
  const [SubscribedCapital, setSubscribedCapital] = useState({});

  const [AddForfeitedArr, setAddForfeitedArr] = useState([0]);
  const [AddForfeitedShares, setAddForfeitedShares] = useState({});

  const [LessCallsArr, setLessCallsArr] = useState([0]);
  const [LessCallsUnpaid, setLessCallsUnpaid] = useState({});

  const [CalledUpArr, setCalledUpArr] = useState([0]);
  const [CalledUpCapital, setCalledUpCapital] = useState({});

  useEffect(() => {
    setMyTemData({
      CalledUpCapital: CalledUpCapital,
      LessCallsUnpaid: LessCallsUnpaid,
      AddForfeitedShares: AddForfeitedShares,
      SubscribedCapital: SubscribedCapital,
      IssuedCapital: IssuedCapital,
    });
  }, [
    CalledUpCapital,
    LessCallsUnpaid,
    AddForfeitedShares,
    SubscribedCapital,
    IssuedCapital,
  ]);
  useEffect(() => {
    console.log(myTemData, 'MYTEMDATAMYTEMDATAMYTEMDATA');
  }, [myTemData]);
  function getCellCalc(d1, d2) {
    d1 = (d1 || 0) - 0;
    d2 = (d2 || 0) - 0;
    let tem = (d1 * d2) / 100000;
    return tem?.toFixed(2);
  }
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
  return (
    <div>
      <TableContainer sx={{mb: 8}}>
        <Table aria-label='sticky table' style={{border: '1px solid #e0e0e0'}}>
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={2}
                key={'left-head'}
                align={'left'}
                style={{fontWeight: 600}}
              >
                For Indian Banks
              </TableCell>
              <TableCell
                key={'right-head'}
                colSpan={2}
                align={'right'}
                style={{fontWeight: 600}}
              >
                Amount in Rs. Lakhs
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
            <TableRow>
              <TableCell key={'left-head1'}></TableCell>
              <TableCell
                key={'left-head2'}
                align={'center'}
                style={{fontWeight: 600}}
              >
                No. of Shares
              </TableCell>
              <TableCell
                key={'right-head1'}
                align={'center'}
                style={{fontWeight: 600}}
              >
                Amount of Each Share
              </TableCell>
              <TableCell
                key={'right-head2'}
                align={'center'}
                style={{fontWeight: 600}}
              >
                Total
              </TableCell>
              <TableCell align='center' style={{fontWeight: 600}}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow key={'row__2_1'}>
              <TableCell>Authorised Capital</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell align='center'></TableCell>
            </TableRow>
            <TableRow key={'row__2_1'}>
              <TableCell>Issued Capital</TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell align='center'>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => {
                    let tem = IssuedArr;
                    if (tem.length) tem.push(tem[tem?.length - 1] + 1);
                    else tem.push(0);
                    console.log(tem, ';;;;;;;;;');
                    setIssuedArr([...tem]);
                  }}
                >
                  + Add More
                </Button>
              </TableCell>
            </TableRow>
            {IssuedArr?.map((el, ind) => {
              return (
                <TableRow key={'fasdf' + el}>
                  <TableCell align='left'>{ind + 1}</TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={IssuedCapital[el]?.NoOfShare}
                      onInput={(e) => {
                        let temOb = IssuedCapital;
                        let temD = temOb[el] || {};
                        temD.NoOfShare = getValue(
                          e?.target?.value,
                          temD.NoOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setIssuedCapital({...IssuedCapital, [el]: temD});
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={IssuedCapital[el]?.AmtOfShare}
                      onInput={(e) => {
                        let temOb = IssuedCapital;
                        let temD = temOb[el] || {};
                        temD.AmtOfShare = getValue(
                          e?.target?.value,
                          temD.AmtOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setIssuedCapital({...IssuedCapital, [el]: temD});
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={IssuedCapital[el]?.total}
                      disabled={true}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <HighlightOffIcon
                      sx={{color: '#e53835'}}
                      onClick={() => {
                        let tem = IssuedArr;
                        tem.splice(ind, 1);
                        let temOb = IssuedCapital;
                        delete temOb[el];
                        setIssuedCapital({...temOb});
                        setIssuedArr([...tem]);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow key={'row__2_1'}>
              <TableCell>Subscribed Capital</TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell align='center'>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => {
                    let tem = IssuedArr;
                    if (tem.length) tem.push(tem[tem?.length - 1] + 1);
                    else tem.push(0);
                    setSubscribedArr([...tem]);
                  }}
                >
                  + Add More
                </Button>
              </TableCell>
            </TableRow>
            {SubscribedArr?.map((el, ind) => {
              return (
                <TableRow key={'fasdf' + el}>
                  <TableCell align='left'>{ind + 1}</TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={SubscribedCapital[el]?.NoOfShare}
                      onInput={(e) => {
                        let temOb = SubscribedCapital;
                        let temD = temOb[el] || {};
                        temD.NoOfShare = getValue(
                          e?.target?.value,
                          temD.NoOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setSubscribedCapital({
                          ...SubscribedCapital,
                          [el]: temD,
                        });
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={SubscribedCapital[el]?.AmtOfShare}
                      onInput={(e) => {
                        let temOb = SubscribedCapital;
                        let temD = temOb[el] || {};
                        temD.AmtOfShare = getValue(
                          e?.target?.value,
                          temD.AmtOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setSubscribedCapital({
                          ...SubscribedCapital,
                          [el]: temD,
                        });
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={SubscribedCapital[el]?.total}
                      disabled={true}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <HighlightOffIcon
                      sx={{color: '#e53835'}}
                      onClick={() => {
                        let tem = SubscribedArr;
                        tem.splice(ind, 1);
                        let temOb = SubscribedCapital;
                        delete temOb[el];
                        setIssuedCapital({...temOb});
                        setSubscribedArr([...tem]);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow key={'row__2_1'}>
              <TableCell>Called Up Capital</TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell align='center'>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => {
                    let tem = CalledUpArr;
                    if (tem.length) tem.push(tem[tem?.length - 1] + 1);
                    else tem.push(0);
                    setCalledUpArr([...tem]);
                  }}
                >
                  + Add More
                </Button>
              </TableCell>
            </TableRow>
            {CalledUpArr?.map((el, ind) => {
              return (
                <TableRow key={'fasdf' + el}>
                  <TableCell align='left'>{ind + 1}</TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={CalledUpCapital[el]?.NoOfShare}
                      onInput={(e) => {
                        let temOb = CalledUpCapital;
                        let temD = temOb[el] || {};
                        temD.NoOfShare = getValue(
                          e?.target?.value,
                          temD.NoOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setCalledUpCapital({
                          ...CalledUpCapital,
                          [el]: temD,
                        });
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={CalledUpCapital[el]?.AmtOfShare}
                      onInput={(e) => {
                        let temOb = CalledUpCapital;
                        let temD = temOb[el] || {};
                        temD.AmtOfShare = getValue(
                          e?.target?.value,
                          temD.AmtOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setCalledUpCapital({
                          ...CalledUpCapital,
                          [el]: temD,
                        });
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={CalledUpCapital[el]?.total}
                      disabled={true}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <HighlightOffIcon
                      sx={{color: '#e53835'}}
                      onClick={() => {
                        let tem = CalledUpArr;
                        tem.splice(ind, 1);
                        let temOb = CalledUpCapital;
                        delete temOb[el];
                        setCalledUpCapital({...temOb});
                        setCalledUpArr([...tem]);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow key={'row__2_1'}>
              <TableCell>Less: Calls Unpaid</TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell align='center'>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => {
                    let tem = LessCallsArr;
                    if (tem.length) tem.push(tem[tem?.length - 1] + 1);
                    else tem.push(0);
                    setLessCallsArr([...tem]);
                  }}
                >
                  + Add More
                </Button>
              </TableCell>
            </TableRow>
            {LessCallsArr?.map((el, ind) => {
              return (
                <TableRow key={'fasdf' + el}>
                  <TableCell align='left'>{ind + 1}</TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={LessCallsUnpaid[el]?.NoOfShare}
                      onInput={(e) => {
                        let temOb = LessCallsUnpaid;
                        let temD = temOb[el] || {};
                        temD.NoOfShare = getValue(
                          e?.target?.value,
                          temD.NoOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setLessCallsUnpaid({
                          ...LessCallsUnpaid,
                          [el]: temD,
                        });
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={LessCallsUnpaid[el]?.AmtOfShare}
                      onInput={(e) => {
                        let temOb = LessCallsUnpaid;
                        let temD = temOb[el] || {};
                        temD.AmtOfShare = getValue(
                          e?.target?.value,
                          temD.AmtOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setLessCallsUnpaid({
                          ...LessCallsUnpaid,
                          [el]: temD,
                        });
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={LessCallsUnpaid[el]?.total}
                      disabled={true}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <HighlightOffIcon
                      sx={{color: '#e53835'}}
                      onClick={() => {
                        let tem = LessCallsArr;
                        tem.splice(ind, 1);
                        let temOb = LessCallsUnpaid;
                        delete temOb[el];
                        setLessCallsUnpaid({...temOb});
                        setLessCallsArr([...tem]);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            <TableRow key={'row__2_1'}>
              <TableCell>Add: Forfeited Shares</TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell>
                <TextField size='small' fullWidth disabled={true} />
              </TableCell>
              <TableCell align='center'>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => {
                    let tem = AddForfeitedArr;
                    if (tem.length) tem.push(tem[tem?.length - 1] + 1);
                    else tem.push(0);
                    setAddForfeitedArr([...tem]);
                  }}
                >
                  + Add More
                </Button>
              </TableCell>
            </TableRow>
            {AddForfeitedArr?.map((el, ind) => {
              return (
                <TableRow key={'fasdf' + el}>
                  <TableCell align='left'>{ind + 1}</TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={AddForfeitedShares[el]?.NoOfShare}
                      onInput={(e) => {
                        let temOb = AddForfeitedShares;
                        let temD = temOb[el] || {};
                        temD.NoOfShare = getValue(
                          e?.target?.value,
                          temD.NoOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setAddForfeitedShares({
                          ...AddForfeitedShares,
                          [el]: temD,
                        });
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={AddForfeitedShares[el]?.AmtOfShare}
                      onInput={(e) => {
                        let temOb = AddForfeitedShares;
                        let temD = temOb[el] || {};
                        temD.AmtOfShare = getValue(
                          e?.target?.value,
                          temD.AmtOfShare,
                          {isNumber: true, maxVal: 100000},
                        );
                        temD.total = getCellCalc(
                          temD.NoOfShare,
                          temD.AmtOfShare,
                        );
                        setAddForfeitedShares({
                          ...AddForfeitedShares,
                          [el]: temD,
                        });
                      }}
                      disabled={false}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      fullWidth
                      value={AddForfeitedShares[el]?.total}
                      disabled={true}
                    />
                  </TableCell>
                  <TableCell align='center'>
                    <HighlightOffIcon
                      sx={{color: '#e53835'}}
                      onClick={() => {
                        let tem = AddForfeitedArr;
                        tem.splice(ind, 1);
                        let temOb = AddForfeitedShares;
                        delete temOb[el];
                        setAddForfeitedShares({...temOb});
                        setAddForfeitedArr([...tem]);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Sch1_file2;
