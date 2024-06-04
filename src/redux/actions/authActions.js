import axios from 'axios';
import {
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  AUTH_ERROR,
  NOT_AUTHENTICATED,
} from './ActionTypes';

export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get('https://story-flow-analysis.kro.kr/api/auth/check');
    if (res.data.data.authenticated) {
      dispatch({
        type: USER_LOADED,
        payload: res.data.data.username,
      });
    } else {
      dispatch({
        type: NOT_AUTHENTICATED,
      });
    }
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//

export const login = (username, password) => async (dispatch) => {
  try {
    const res = await axios.post('https://story-flow-analysis.kro.kr/api/accounts/login', { username, password });

    if (res.data.data.username) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.data.username,
      });
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: 'No username returned from server'
      });
    }
  } catch (err) {
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response?.data?.message || 'Login failed',
    });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.post('https://story-flow-analysis.kro.kr/api/accounts/logout', {}, {
      withCredentials: true  // 쿠키를 전송하도록 설정
    });
    dispatch({
      type: LOGOUT,
    });
  } catch (err) {
    console.log('Logout error:', err);
  }
};

export const clearErrors = () => ({
  type: CLEAR_ERRORS,
});