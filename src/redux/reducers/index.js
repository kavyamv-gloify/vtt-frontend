import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import Settings from './Setting';
import Common from './Common';
import Dashboard from './Dashboard';
import ToDoApp from './ToDoApp';
import MailApp from './MailApp';
import ContactApp from './ContactApp';
import ScrumboardApp from './ScrumboardApp';
import OnboardTenent from './OnboardTenent';
import Ecommerce from './Ecommerce';
import ChatApp from './ChatApp';
import Wall from './Wall';
import UserList from './UserList';
import Snackbar from './Snackbar';

const reducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    snackbar: Snackbar,
    settings: Settings,
    dashboard: Dashboard,
    common: Common,
    todoApp: ToDoApp,
    mailApp: MailApp,
    userList: UserList,
    contactApp: ContactApp,
    scrumboardApp: ScrumboardApp,
    ecommerce: Ecommerce,
    chatApp: ChatApp,
    wall: Wall,
    OnboardTenent: OnboardTenent,
   
  });
export default reducers;
