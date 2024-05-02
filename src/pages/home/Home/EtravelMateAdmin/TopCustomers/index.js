import React, {useState} from 'react';
import AppCard from '@crema/core/AppCard';
import PatientsTable from './PatientsTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const RecentPatients = ({
  recentPatients,
  topHeader,
  title,
  onTabChange,
  loading,
}) => {
  const [value, setValue] = useState('one');

  const handleSelectionType = (data) => {
    setValue(data);
    onTabChange(data);
  };

  return (
    <>
      <AppCard
        contentStyle={{px: 0}}
        title={
          topHeader === true ? (
            <Tabs
              value={value}
              textColor='secondary'
              indicatorColor='secondary'
              aria-label='secondary tabs example'
            >
              <Tab
                value='one'
                label='Top Customers'
                onClick={() => handleSelectionType('one')}
              />
              <Tab
                value='two'
                label='Top Vendors'
                onClick={() => handleSelectionType('two')}
              />
              <Tab
                value='three'
                label='Top Drivers'
                onClick={() => handleSelectionType('three')}
              />
            </Tabs>
          ) : (
            title
          )
        }
      >
        {loading ? (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height='100px'
          >
            <div>Loading...</div>
          </Box>
        ) : (
          <PatientsTable
            recentPatients={recentPatients}
            tab={value}
            loading={loading}
          />
        )}
      </AppCard>
    </>
  );
};

export default RecentPatients;
