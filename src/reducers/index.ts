import { CreateSliceOptions, createSlice } from "@reduxjs/toolkit"
const initialState = {email: '',uid: ''};
const x: CreateSliceOptions = {
    name: 'auth',
    initialState: initialState,
    reducers: {
        initUser(_,{payload}) {
            return payload;
        },
        clearUser(_,{}) {
            return initialState;
        }
    }
}
const authReducer = createSlice(x)
const {initUser,clearUser} = authReducer.actions
export {initUser,clearUser}
export default authReducer.reducer
  