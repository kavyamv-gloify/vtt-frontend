import React, {useState} from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Brand from './Brand';
import Category from './Category';
import VehicleType from './VehicleType';
import AddIcon from '@mui/icons-material/Add';
import AppTooltip from '@crema/core/AppTooltip';
import {Grid} from '@mui/material';
const MergedVehicleFile = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openType, setOpenType] = useState(false);
  function closeBrand() {
    setOpenForm(false);
    setOpenCategory(false);
    setOpenType(false);
  }
  return (
    <div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
          sx={{
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            },
          }}
        >
          <Typography sx={{fontWeight: '900'}}>Vehicle Brand</Typography>
          <div className='left-seperator'>
            <AppTooltip placement={'top'} title={'Add New Vehicle Brand'}>
              <AddIcon
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenForm(true);
                  setFlag('ADDNEW');
                }}
              />
            </AppTooltip>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Brand openForm={openForm} closeBrand={closeBrand} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
          sx={{
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            },
          }}
        >
          <Typography sx={{fontWeight: '900'}}>Vehicle Type</Typography>
          <div className='left-seperator'>
            <AppTooltip placement={'top'} title={'Add New Vehicle Type'}>
              <AddIcon
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenType(true);
                  setFlag('ADDNEW');
                }}
              />
            </AppTooltip>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <VehicleType openForm={openType} setOpenForm={setOpenType} closeBrand={closeBrand} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default MergedVehicleFile;
