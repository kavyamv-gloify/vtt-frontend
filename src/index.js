import {createRoot} from 'react-dom/client';
import App from './App';
import '@crema/services';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
