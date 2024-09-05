import { configureStore } from "@reduxjs/toolkit";
import { useSelector as rawUseSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from "../reducers"
const store = configureStore({
    reducer: {
        authReducer
    }
})
export default store;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;