import { createSlice } from "@reduxjs/toolkit";
const selectedNodeSlice = createSlice({
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
export const { selectNode } = selectedNodeSlice.actions;
export default selectedNodeSlice.reducer;
