import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux'
import store from './store'
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "react-datetime/css/react-datetime.css";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);

reportWebVitals();
