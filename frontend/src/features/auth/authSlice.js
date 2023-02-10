
import { createSlice } from "@reduxjs/toolkit";


const initialState ={
    token: null,
}
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {

  setCredentials: (state, action)=>{
    state.token = action.payload.accessToken;

  },
  logout: (state, action)=>{

    state.token = null
  }
  }


})


export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;