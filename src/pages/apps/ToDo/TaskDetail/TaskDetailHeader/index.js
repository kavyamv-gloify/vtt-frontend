import React from 'react';
import {useDispatch} from 'react-redux';
import {onUpdateSelectedTask} from 'redux/actions';
import {useNavigate} from 'react-router-dom';
import IntlMessages from '@crema/utility/IntlMessages';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import AppsStarredIcon from '@crema/core/AppsStarredIcon';
import StatusToggleButton from './StatusToggleButton';
import AppsDeleteIcon from '@crema/core/AppsDeleteIcon';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppTooltip from '@crema/core/AppTooltip';

const TaskDetailHeader = (props) => {
  const {selectedTask} = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const onClickBackButton = () => {
    navigate(-1);
  };

  const onChangeStarred = (checked) => {
    const task = selectedTask;
    task.isStarred = checked;
    dispatch(onUpdateSelectedTask(task));
  };

  const onDeleteTask = () => {
    const task = selectedTask;
    task.folderValue = 126;
    dispatch(onUpdateSelectedTask(task));
    navigate(-1);
  };

  return (
    <>
      <Box
        sx={{
          cursor: 'pointer',
        }}
        component='span'
        mr={{xs: 2, sm: 4}}
        onClick={onClickBackButton}
      >
        <AppTooltip title={<IntlMessages id='common.back' />}>
          <ArrowBackIcon
            sx={{
              color: 'text.secondary',
            }}
          />
        </AppTooltip>
      </Box>

      <StatusToggleButton selectedTask={selectedTask} />

      <Box
        component='span'
        sx={{
          marginLeft: 'auto',
          display: {xs: 'none', sm: 'block'},
        }}
        onChange={onChangeStarred}
      >
        <AppsStarredIcon item={selectedTask} />
      </Box>

      <AppsDeleteIcon
        deleteAction={onDeleteTask}
        deleteTitle={<IntlMessages id='todo.deleteMessage' />}
        sx={{
          color: 'text.disabled',
        }}
      />
    </>
  );
};

export default TaskDetailHeader;

TaskDetailHeader.propTypes = {
  selectedTask: PropTypes.object.isRequired,
};
