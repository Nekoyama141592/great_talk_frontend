import { CreateSliceOptions, createSlice } from "@reduxjs/toolkit"
const initialState = {email: '',uid: '',firstLoaded: false};
const option: CreateSliceOptions = {
    name: 'auth',
    initialState: initialState,
    reducers: {
        initUser(_,{payload}) {
            return {...payload,firstLoaded: true};
        },
        clearUser(_,{}) {
            return {...initialState,firstLoaded: true};
        }
    }
}
const authReducer = createSlice(option)
const {initUser,clearUser} = authReducer.actions
export {initUser,clearUser}
export default authReducer.reducer
  