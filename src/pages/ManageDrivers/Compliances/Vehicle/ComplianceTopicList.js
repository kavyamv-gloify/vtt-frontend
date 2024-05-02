import React, {useEffect, useState} from 'react';
import SmartTable from '@smart-table';
import api from '@api';
import axios from 'axios';
import NextWeekIcon from '@mui/icons-material/NextWeek';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import AssignForm from './AssignForm';

const DriverCompliance = ({driverId}) => {
  const [data, setData] = useState();
  const [openBox, setOpenBox] = useState(false);
  const [id, setId] = useState();
  const [title, setTitle] = useState();
  function getCompliance() {
    axios
      .get(api.baseUri + '/user-reg/compliance-topic/getAllByCorporateIdByRole')
      .then((res) => {
        let temp = [];
        res?.data?.data?.map((el) => {
          temp.push(el);
        });
        setData(temp);
      })
      .catch((err) => {
        setData([]);
      });
  }

  useEffect(() => {
    getCompliance();
  }, []);

  const tableTemplate = {
    columns: [
      {
        title: 'Topic',
        field: 'topicName',
      },
      {
        title: 'No. of compliance',
        field: 'compliances.length',
      },
      {
        title: 'Created By',
        field: 'createdBy',
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
      },
    ],
  };

  function handleClickAssignForm(rowData) {
    setTitle(rowData?.topicName);
    setId(rowData?.id);
    setOpenBox(true);
  }

  function handleClose() {
    setOpenBox(false);
  }

  return (
    <>
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
        title='Onboard Tenants List'
        columns={tableTemplate.columns}
        data={data}
        options={{
          search: false,
          showTitle: false,
          selection: false,

          sorting: true,
          actionsColumnIndex: -1,
          headerStyle: {position: 'sticky', top: 0},
        }}
        actions={[
          {
            icon: () => <NextWeekIcon color='primary' />,
            tooltip: 'Assign Compliance',
            onClick: (event, rowData) => handleClickAssignForm(rowData),
          },
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
        onClose={() => {
          setOpenBox(false);
        }}
        open={openBox}
        maxWidth='false'
        PaperProps={{
          sx: {
            width: '700px',
          },
        }}
        style={{borderRadius: '4rem'}}
      >
        <DialogTitle
          style={{
            background: '#f4f2f2',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <h1>{title}</h1>
          <CloseIcon onClick={() => setOpenBox(false)} />
        </DialogTitle>
        <DialogContent style={{padding: '20px'}}>
          <AssignForm id={id} driverId={driverId} close={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DriverCompliance;
