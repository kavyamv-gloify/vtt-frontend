import React, {useState} from 'react';
import InputLabel from '@mui/material/InputLabel';
import IntlMessages from '@crema/utility/IntlMessages';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import {useDispatch, useSelector} from 'react-redux';
import {onUpdateSelectedTask} from 'redux/actions';
import PropTypes from 'prop-types';
import {MenuItem} from '@mui/material';

const TaskPriority = ({selectedTask}) => {
  const dispatch = useDispatch();
  const priorityList = useSelector(({todoApp}) => todoApp.priorityList);

  const [priority, setPriority] = useState(selectedTask.priority.type);

  const onChangePriority = (event) => {
    setPriority(event.target.value);
    const priority = priorityList.find(
      (data) => data.type.toString() === event.target.value.toString(),
    );

    const task = selectedTask;
    task.priority = priority;
    dispatch(onUpdateSelectedTask(task));
  };

  return (
    <FormControl variant='outlined'>
      <InputLabel id='priority-select-outlined-label'>
        <IntlMessages id='common.priority' />
      </InputLabel>
      <Select
        labelId='priority-select-outlined-label'
        label={<IntlMessages id='common.priority' />}
        name='priority'
        value={priority}
        onChange={(event) => onChangePriority(event)}
        sx={{
          cursor: 'pointer',
          '& .MuiOutlinedInput-input': {
            paddingBottom: 2.5,
            paddingTop: 2.5,
          },
        }}
      >
        {priorityList.map((priority) => {
          return (
            <MenuItem
              key={priority.id}
              value={priority.type}
              sx={{
                padding: 2,
                cursor: 'pointer',
              }}
            >
              {priority.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default TaskPriority;

TaskPriority.propTypes = {
  selectedTask: PropTypes.object.isRequired,
};
