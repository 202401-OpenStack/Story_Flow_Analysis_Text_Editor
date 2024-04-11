const initialState = {
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null, // 에러 상태도 초기 상태에 포함시킬 수 있습니다.
};

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload, // 사용자 정보 업데이트
            };
        case 'NOT_AUTHENTICATED':
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload, // 여기에 user 정보를 업데이트하도록 추가
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAIL':
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload,
            };
        case 'CLEAR_ERRORS': // default 위로 옮김
            return {
                ...state,
                error: null,
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload || 'Authentication error',
            };
        default: // default를 마지막에 위치시킴
            return state;
    }
}
