import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import SmartForm from '@smart-form';
import CloseIcon from '@mui/icons-material/Close';

const FilterPop = ({ open, handleClose, cnfMsg, header, template, title, filter }) => {

  return (
    <div>
      <Dialog
        className='yourClassName'
        // fullWidth
        open={open}
        onClose={() => { handleClose("NO") }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ background: '#ededed', color: "#343434" }}>
          <h1>{title}</h1>
          <div style={{ cursor: "pointer", position: "absolute", top: "12px", right: "14px" }} onClick={() => { handleClose("NO") }}><CloseIcon /></div>
        </DialogTitle>
        <DialogContent style={{ padding: "0px 40px 15px 40px" }}>
          <DialogContentText id="alert-dialog-description" style={{ display: "flex" }}>
            <SmartForm
              template={template}
              onSubmit={handleClose}
              defaultValues={filter || {}}
              buttons={['apply', 'cancel']}
              filterbtnStyle={{ background: '#31bc7b', borderRadius: '20px', width: '113px' }}
              clearStyle={{ background: 'white', border: '1px solid #ff9800', color:'#ff9800', borderRadius: '20px', width: '113px' }}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FilterPop