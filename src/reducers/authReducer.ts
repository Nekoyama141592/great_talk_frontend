import { CreateSliceOptions, createSlice } from '@reduxjs/toolkit'
const initialState = { uid: '', firstLoaded: false }
const option: CreateSliceOptions = {
  name: 'auth',
  initialState: initialState,
  reducers: {
    initUser(_, { payload }) {
      return { ...payload, firstLoaded: true }
    },
    clearUser() {
      return { ...initialState, firstLoaded: true }
    },
  },
}
const slice = createSlice(option)
const { initUser, clearUser } = slice.actions
const authReducer = slice.reducer
export { initUser, clearUser }
export default authReducer
