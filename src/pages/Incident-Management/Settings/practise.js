import React, {useEffect, useState} from 'react';
import {Autocomplete, TextField} from '@mui/material';
const Practise = () => {
  const [selectedItem, setSelectedItem] = useState([]);
  const [actionList, setActionList] = useState([
    {title: 'Option 1', value: '1'},
    {title: 'Option 2', value: '2'},
    {title: 'Option 3', value: '3'},
    {title: 'Option 4', value: '4'},
    {title: 'Option 5', value: '5'},
  ]);
  const [newaction, setNewAction] = useState();
  useEffect(() => {
    setNewAction(actionList);
  }, [actionList]);

  function newarray() {
    let temp = [];
    for (let [key, value] of Object.entries(selectedItem)) {
      temp.push(value);
    }

    temp = temp.filter(function (element) {
      return element !== undefined;
    });
    console.log('temp', temp);
    let temparray = [];
    actionList?.map((el) => {
      console.log('el', el);
      if (temp.includes(el?.value)) {
        return;
      } else {
        temparray.push(el);
      }
    });
    console.log('temparray', temparray);
    setNewAction(temparray);
  }
  useEffect(() => {
    newarray();
  }, [selectedItem, actionList]);
  return (
    <div style={{width: '50%'}}>
      <Autocomplete
        disablePortal
        id='actions'
        size='small'
        options={newaction}
        getOptionLabel={(option) => option.title}
        onChange={(e, option, v) => {
          setSelectedItem({...selectedItem, level1: option?.value});
        }}
        sx={{width: '100%', m: 2}}
        renderInput={(params) => <TextField {...params} label='Actions' />}
      />
      <Autocomplete
        disablePortal
        id='actions'
        size='small'
        options={newaction}
        getOptionLabel={(option) => option.title}
        onChange={(e, option, v) => {
          setSelectedItem({...selectedItem, level2: option?.value});
        }}
        sx={{width: '100%', m: 2}}
        renderInput={(params) => <TextField {...params} label='Actions' />}
      />
      <Autocomplete
        disablePortal
        id='actions'
        size='small'
        options={newaction}
        getOptionLabel={(option) => option.title}
        onChange={(e, option, v) => {
          setSelectedItem({...selectedItem, level3: option?.value});
        }}
        sx={{width: '100%', m: 2}}
        renderInput={(params) => <TextField {...params} label='Actions' />}
      />
    </div>
  );
};

export default Practise;
{/* <div style={{display: 'flex', justifyContent: 'space-between'}}>
<h4>Level 2 : </h4>
<Autocomplete
  disablePortal
  id='actions'
  size='small'
  options={newaction}
  getOptionLabel={(option) => option.title}
  onChange={(e, option, v) => {
    setSelectedItem({...selectedItem, level2: option?.value});
  }}
  sx={{width: '100%', m: 2}}
  renderInput={(params) => (
    <TextField {...params} label='Actions' />
  )}
/>
</div> */}