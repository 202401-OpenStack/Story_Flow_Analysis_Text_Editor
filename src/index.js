import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter } from 'react-router-dom'; // React Router를 위한 임포트 추가
import axios from 'axios';

axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* BrowserRouter 추가 */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);