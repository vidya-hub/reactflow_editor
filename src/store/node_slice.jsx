import { createSlice } from "@reduxjs/toolkit";
const nodeSlice = createSlice({
  name: "nodeSlice",
  initialState: {
    selectedNode: null,
  },

  reducers: {
    selectNode(state, action) {
      const node =
        action.payload == null || action.payload.id === state.selectedNode?.id
          ? null
          : action.payload;
      state.selectedNode = node;
    },
  },
});
export const { selectNode } = nodeSlice.actions;
export default nodeSlice.reducer;
