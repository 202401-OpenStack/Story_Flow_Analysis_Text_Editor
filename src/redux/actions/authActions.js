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
    const res = await axios.get('http://20.41.113.158/api/auth/check');
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
    const res = await axios.post('http://20.41.113.158/api/accounts/login', { username, password });

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
      await axios.post('http://20.41.113.158/api/accounts/logout');
      dispatch({
          type: LOGOUT,
      });
      // 주의: 여기서 직접적인 네비게이션을 처리하는 대신, 로그아웃 후의 리다이렉션은 컴포넌트 또는 미들웨어를 통해 처리하는 것이 좋습니다.
  } catch (err) {
      console.log('Logout error:', err);
  }
};

export const clearErrors = () => ({
  type: CLEAR_ERRORS,
});