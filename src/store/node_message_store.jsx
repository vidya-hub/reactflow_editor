import { configureStore } from "@reduxjs/toolkit";
import nodeEdgesSlice from "./nodes_edges_slice";

const store = configureStore({
  reducer: {
    flow: nodeEdgesSlice,
  },
});

export default store;
