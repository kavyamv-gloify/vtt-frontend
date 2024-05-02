import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import {Button, TextField} from '@mui/material';
import Heading from './nh1-heading';
import _, {indexOf} from 'lodash';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {makeStyles} from '@mui/styles';
const useStyles = makeStyles({
  table: {
    borderTop: '1px solid rgba(224, 224, 224, 1)',
    minWidth: 650,
    '& .MuiTableCell-root': {
      borderLeft: '1px solid rgba(224, 224, 224, 1)',
      fontWeight: 600,
    },
  },
});
export default function StickyHeadTable() {
  const classes = useStyles();
  const [inputData, setInputData] = React.useState({});
  const minRows = 5;
  const [noOfRows, setNoOfRows] = React.useState([0, 1, 2, 3, 4]);
  const [inputError, setInputError] = React.useState({});
  let fields = [
    {fieldName: 'fields1', minVal: 0, maxVal: 100000, isNumber: false},
    {fieldName: 'fields2', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields3', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields4', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields5', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields6', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields7', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields8', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields9', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields10', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields11', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields12', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields13', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields14', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields15', minVal: 0, maxVal: 100000, isNumber: true},
    {fieldName: 'fields16', minVal: 0, maxVal: 100000, isNumber: true},
  ];

  function getValue(val, nm, elm) {
    if (!val || (elm.isNumber && _.isNaN(Number(val)))) {
      return nm || '';
    } else {
      return val;
    }
  }
  return (
    <form>
      <Paper sx={{width: '100%', overflow: 'hidden'}}>
        <div style={{width: '100%', padding: '10px', textAlign: 'right'}}>
          <Button
            variant='contained'
            size='small'
            onClick={() => {
              let tem = noOfRows[noOfRows.length - 1];
              setNoOfRows([...noOfRows, tem + 1]);
            }}
          >
            Add New
          </Button>
        </div>
        <TableContainer>
          {/* sx={{maxHeight: 550}} stickyHeader*/}
          <Table aria-label='sticky table' className={classes.table}>
            <Heading />
            <TableBody>
              {noOfRows.map((i, el) => (
                <TableRow key={'Row ' + i}>
                  <TableCell align='center'>{el + 1}</TableCell>
                  {fields?.map((ele, ind) => (
                    <TableCell>
                      <TextField
                        size='small'
                        value={
                          inputData[i] && inputData[i][ele.fieldName]
                            ? inputData[i][ele.fieldName]
                            : ''
                        }
                        onInput={(e) => {
                          let myVal = getValue(
                            e.target.value,
                            inputData[i] && inputData[i][ele.fieldName]
                              ? inputData[i][ele.fieldName]
                              : '',
                            ele,
                          );
                          let tempo = inputData;
                          tempo[i] = {
                            ...(tempo[i] || {}),
                            [ele.fieldName]: myVal,
                          };
                          setInputData({...tempo});
                          console.log(tempo, ':::::', myVal);
                        }}
                        key={'KEY' + ele.fieldName + ' - ' + i}
                        name={'NAME' + ele.fieldName + ' - ' + i}
                        fullWidth
                      />
                    </TableCell>
                  ))}
                  <TableCell align='center'>
                    {noOfRows.length > minRows && (
                      <HighlightOffIcon
                        onClick={() => {
                          let tem = noOfRows;
                          tem.splice(tem.indexOf(i), 1);
                          setNoOfRows([...tem]);
                        }}
                        sx={{color: 'red'}}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{width: '100%', padding: '10px', textAlign: 'center'}}>
          <Button
            variant='contained'
            size='small'
            onClick={() => {
              console.log(inputData);
              Object.keys(inputData)?.map((el) => {
                console.log(el);
              });
            }}
          >
            Submit
          </Button>
        </div>
      </Paper>
    </form>
  );
}
