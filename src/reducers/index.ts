import { CreateSliceOptions, createSlice } from "@reduxjs/toolkit"
const x: CreateSliceOptions = {
    name: 'auth',
    initialState: {email: ''},
    reducers: {
        initUser(_,{payload}) {
            return payload;
        },
        clearUser(_,{payload}) {
            return payload;
        }
    }
}
const authReducer = createSlice(x)
const {initUser,clearUser} = authReducer.actions
export {initUser,clearUser}
export default authReducer.reducer
  