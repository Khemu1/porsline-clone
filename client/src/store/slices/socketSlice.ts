// socketSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SocketState {
  socketId: string | null;
}

const initialState: SocketState = {
  socketId: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocketId: (state, action: PayloadAction<string | null>) => {
      state.socketId = action.payload;
    },
  },
});

export const { setSocketId } = socketSlice.actions;
export default socketSlice.reducer;
