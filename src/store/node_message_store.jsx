import { configureStore } from "@reduxjs/toolkit";
import selectedNodeSlice from "./selected_node_slice";
import nodeEdgesSlice from "./nodes_edges_slice";

const store = configureStore({
  reducer: {
    node: selectedNodeSlice,
    flow: nodeEdgesSlice,
  },
});

export default store;
