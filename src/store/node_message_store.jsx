import { configureStore } from "@reduxjs/toolkit";
import nodeSlice from "./node_slice";

const store = configureStore({
  reducer: {
    node: nodeSlice,
  },
});

export default store;
