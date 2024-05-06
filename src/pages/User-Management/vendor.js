import React, {useState} from 'react';
import PropTypes from 'prop-types';
import SmartTable from '@smart-table';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Autocomplete,
  TextField,
  Grid,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DeleteIcon from '@mui/icons-material/Delete';
import SmartForm from '@smart-form';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import _, {assign, values} from 'lodash';
import Confirm from '@confirmation-box';
import AppTooltip from '@crema/core/AppTooltip';

const Vendor = () => {
  // const [roleData, setRoleData] = useState([]);
  const [openDial, setopenDial] = useState(false);
  const [openEdit, setopenEdit] = useState(false);
  const [delClicked, setdelClicked] = useState(false);
  const [openAssociate, setopenAssociate] = useState(false);
  const [corpVal, setCorpVal] = React.useState([]);
  const [delText, setDelText] = useState('');

  function CustomTabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
      <div
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{p: 3}}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  const tableTemplate = {
    columns: [
      {
        title: 'Role Name',
        field: 'roleName',
      },
      {
        title: 'Description',
        field: 'description',
      },
      {
        title: 'Status',
        field: 'status',
      },
      {
        title: 'Created On',
        field: 'createdOn',
        type: 'datetime',
      },
    ],
  };

  let template = {
    layout: {
      column: 1,
      spacing: 2,
      size: 'medium',
      label: 'fixed',
      type: 'grid',
    },
    sections: [
      {
        layout: {column: 1, spacing: 2, size: 'small', label: 'fixed'},
        id: 'personal_information',
        fields: [
          {
            type: 'text',
            name: 'roleName',
            field: 'roleName',
            title: 'Role Name',
            validationProps: {
              required: 'This is a mandatory field',
            },
          },
          {
            type: 'text',
            name: 'description',
            field: 'description',
            title: 'Description',
            // validationProps: {
            //     required: 'This is a mandatory field'
            // }
          },
        ],
      },
    ],
  };

  function onSubmit(values) {
    console.log('values', values);
  }
  function onEdit(values) {
    console.log('edit', values);
  }

  return (
    <div>
      <Grid item style={{paddingTop: '1rem'}}>
        <Box display='flex' justifyContent='flex-end'>
          <div className='left-seperator'>
            <AppTooltip placement={'top'} title={'Add Role'}>
              <img
                src='/assets/images/title-icon/add-driver.svg'
                className='title-icons-mui'
                onClick={(e) => {
                  setopenDial(true);
                }}
              />
            </AppTooltip>
          </div>
        </Box>
      </Grid>
      <SmartTable
        components={{
          Toolbar: (props) => (
            <>
              <div
                style={{
                  height: '0px',
                }}
              ></div>
            </>
          ),
        }}
        title='Bank Detail'
        columns={tableTemplate.columns}
        // data={roleData}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          (rd) => ({
            icon: () => (
              <AssignmentTurnedInIcon
                color='primary'
                sx={{opacity: rd?.status == 'ACTIVE' ? '1' : '0.3'}}
              />
            ),
            tooltip: 'Assign',
            onClick: (event, rowData) => {
              if (rd?.status == 'ACTIVE') handleClick(rowData, 'ASSIGN');
            },
          }),
          (rd) => ({
            icon: () => (
              <EditIcon
                color='primary'
                sx={{opacity: rd?.status == 'ACTIVE' ? '1' : '0.3'}}
              />
            ),
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              if (rd?.status == 'ACTIVE') handleClick(rowData, 'EDIT');
            },
          }),
          (rd) => ({
            icon: () => (
              <DeleteIcon
                sx={{
                  color: '#bc0906',
                  opacity: rd?.status == 'ACTIVE' ? '1' : '0.3',
                }}
              />
            ),
            tooltip: 'Deactivate',
            onClick: (event, rowData) => {
              if (rd?.status == 'ACTIVE') handleClick(rowData, 'INACTIVE');
            },
          }),
          (rd) => ({
            icon: () => (
              <RestoreIcon
                color='primary'
                sx={{opacity: rd?.status == 'INACTIVE' ? '1' : '0.3'}}
              />
            ),
            tooltip: 'Reactivate',
            onClick: (event, rowData) => {
              if (rd?.status == 'INACTIVE') handleClick(rowData, 'ACTIVE');
            },
          }),
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: 'No records to display',
            filterRow: {
              filterTooltip: 'Filter',
              filterPlaceHolder: 'Filtaaer',
            },
          },
        }}
        style={{
          borderRadius: 16,
          boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)',
        }}
      />

      <Dialog
        open={openDial}
        onClose={() => {
          setopenDial(false);
        }}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Create Role</h1>
          <CloseIcon
            onClick={() => {
              setopenDial(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px', paddingTop: '0px'}}>
          <div>
            <SmartForm
              template={template}
              onSubmit={onSubmit}
              buttons={['submit']}
              //   success={success}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openEdit}
        onClose={() => {
          setopenEdit(false);
        }}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Update Role</h1>
          <CloseIcon
            onClick={() => {
              setopenEdit(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px', paddingTop: '0px'}}>
          <div>
            <SmartForm
              //   defaultValues={savedObj}
              template={template}
              onSubmit={onEdit}
              buttons={['update']}
              //   success={success}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openAssociate}
        onClose={() => {
          setopenAssociate(false);
        }}
        style={{borderRadius: '4rem'}}
        PaperProps={{
          sx: {
            width: '500px',
          },
        }}
      >
        <DialogTitle
          style={{
            background: '#f5f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>Associate Corporates</h1>
          <CloseIcon
            onClick={() => {
              setopenAssociate(false);
            }}
            style={{color: '#4f4f4f', fontWeight: 'bold'}}
          />
        </DialogTitle>
        <DialogContent style={{padding: '20px'}}>
          <div style={{width: '100%', textAlign: 'center'}}>
            <Autocomplete
              id='country-select-demo'
              sx={{width: '100%'}}
              //   options={corporateList || []}
              value={corpVal || []}
              multiple
              limitTags={1}
              autoHighlight
              onChange={(e, v, r) => {
                setCorpVal(v || []);
              }}
              getOptionLabel={(option) => option.title}
              renderOption={(props, option, ind) => (
                <Box
                  key={ind + '>>'}
                  component='li'
                  sx={{'& > img': {mr: 2, flexShrink: 0}}}
                  {...props}
                >
                  <img loading='lazy' width='20' src={option.imgsrc} alt='' />
                  {option.title2}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Select Corporate'
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            <Button
              id='btnMui123'
              disabled={!corpVal?.length}
              variant='contained'
              sx={{mt: 4}}
              onClick={() => {
                assignFunc();
              }}
            >
              Assign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Confirm
        open={delClicked}
        header={'Confirm to ' + delText}
        cnfMsg={'Are you sure, You want to ' + delText + ' it?'}
        handleClose={(d) => {
          if (d == 'YES') {
            onEdit({type: 'DELETE'});
          } else {
            setdelClicked(false);
            setDelText('');
          }
        }}
      />
    </div>
  );
};

export default Vendor;
