/* eslint-disable */
import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TableHead from '@mui/material/TableHead';
import {useFieldArray} from 'react-hook-form';
import Fields from './Fields';
import {useEffect} from 'react';

let renderCount = 0;

export default function FieldArray({
  path,
  name,
  watch,
  control,
  register,
  setError,
  clearErrors,
  SecretFunc,
  setValue,
  getValues,
  subFields,
  disabled,
  defaultValues,
  errors,
  layout,
  onChange,
  onBlur,
  arrLayout,
  columns,
}) {
  const {fields, append, remove, insert, prepend} = useFieldArray({
    control,
    name: path,
  });

  renderCount++;
  const xsv = (column) => {
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
  const spacing = (space) => {
    return space || 2;
  };
  const size = (sz) => {
    return sz || '';
  };

  useEffect(() => {
    if (!fields.length || fields.length < 1) {
      append();
    }
  }, [fields]);
  // console.log('subFields', subFields);
  return (
    <>
      <Grid item xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          id='btnMui123'
          type='button'
          onClick={() => {
            append();
          }}
          variant='contained'
          color='primary'
          size='small'
        >
          add more
        </Button>
      </Grid>
      <Table stickyHeader className='min-w-xl' aria-labelledby='tableTitle'>
        {columns && columns && (
          <TableHead>
            <TableRow className='h-64'>
              {columns &&
                columns.map((row, i) => {
                  return (
                    <TableCell
                      className='p-4 md:p-16 height'
                      key={i}
                      align='center'
                      padding={'none'}
                    >
                      {row}
                    </TableCell>
                  );
                }, this)}
              <TableCell
                className='p-4 md:p-16'
                align='center'
                padding={'none'}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
        )}
        {fields.map((item, index) => {
          return (
            <TableRow>
              <Fields
                {...{
                  path: `${path}.${index}`,
                  register,
                  myInd: index,
                  errors,
                  watch,
                  SecretFunc,
                  control,
                  setError,
                  clearErrors,
                  setValue,
                  onChange,
                  onBlur,
                  getValues,
                  disabled,
                  defaultValues,
                  fields: subFields,
                  layout: {
                    xsv: xsv(arrLayout && arrLayout.column),
                    spacing: spacing(arrLayout && arrLayout.spacing),
                    size: size(arrLayout && arrLayout.size),
                    label: arrLayout && arrLayout.label,
                    type: arrLayout && arrLayout.type,
                  },
                }}
              />
              <TableCell
                className='p-4 md:p-16'
                align='center'
                padding={'none'}
              >
                {fields.length > 1 && (
                  <IconButton
                    color='primary'
                    aria-label='upload picture'
                    component='span'
                    size='small'
                    onClick={() => remove(index)}
                  >
                    <HighlightOffIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </>
  );
}
