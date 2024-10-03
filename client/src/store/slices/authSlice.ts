import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthSliceProps } from "../../types";

const initialState: AuthSliceProps = {
  id: null,
  username: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<AuthSliceProps>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
    },
    signOut: (state) => {
      state.id = null;
      state.username = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
