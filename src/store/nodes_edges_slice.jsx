import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [
    {
      id: "1",
      type: "sendMessageNode", // custom node
      data: {
        title: "Send Message",
        content: "",
      },
      position: { x: 250, y: 100 },
    },
  ],
  edges: [],
};

const nodeEdgesSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    updateNodes: (state, action) => {
      state.nodes = state.nodes.map((node) =>
        node.id === action.payload.id ? action.payload : node
      );
    },
    updateEdges: (state, action) => {
      state.edges = state.edges.map((edge) =>
        edge.id === action.payload.id ? action.payload : edge
      );
    },
    updateNode: (state, action) => {
      state.nodes = state.nodes.map((node) => {
        if (node.id === action.payload.id) {
          node = action.payload;
        }
        return node;
      });
    },
  },
});

export const { setNodes, setEdges, updateNodes, updateEdges, updateNode } =
  nodeEdgesSlice.actions;

export default nodeEdgesSlice.reducer;
