import { combineReducers } from '@reduxjs/toolkit';
import auth from './authSlice';

const appReducer = combineReducers({
    auth ,
})

const rootReducer = (state, action) => {
    if (action.type === 'auth/logout') {
        return appReducer(undefined, action);
    }
    return appReducer(state, action)
}


export default rootReducer