import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
export default makeStyles(() => ({
  stepper: {
    padding: useTheme().spacing(3, 0, 5)
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    marginTop: useTheme().spacing(3),
    marginLeft: useTheme().spacing(1)
  },
  wrapper: {
    margin: useTheme().spacing(1),
    position: 'relative'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  box:{
      background: '#fff',
      paddingBottom: '20px',
      paddingLeft: '20px',
      paddingRight: '20px',
      borderRadius: '16px',
      boxShadow: '0px 10px 10px 4px rgb(0 0 0 / 4%)'
  }
}));
