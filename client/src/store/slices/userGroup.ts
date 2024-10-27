import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GroupModel, UserGroupModel } from "../../types";

const initialState: GroupModel = {
  id: 0,
  maker: 0,
  name: "",
  description: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  members: [],
};

const groupSlice = createSlice({
  name: "userGroup",
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<GroupModel>) => {
      return { ...state, ...action.payload };
    },

    addMember: (state, action: PayloadAction<UserGroupModel>) => {
      state.members.push(action.payload);
    },

    deleteMember: (state, action: PayloadAction<number>) => {
      console.log("bfeore", state.members.length);
      console.log("in", action.payload);
      state.members = state.members.filter(
        (member) => +member.userId !== +action.payload
      );
      console.log("after", state.members.length);
    },
  },
});

export const { setGroup, addMember, deleteMember } = groupSlice.actions;

export default groupSlice.reducer;
