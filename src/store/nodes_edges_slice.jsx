import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedNode: null,
  dragEndDetails: null,
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
  canUpdate: false,
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
      state.selectedNode = action.payload;
      state.canUpdate = !state.canUpdate;
    },
    selectNode: (state, action) => {
      const node =
        action.payload == null || action.payload.id === state.selectedNode?.id
          ? null
          : action.payload;
      state.selectedNode = node;
    },
    addNode: (state, action) => {
      state.nodes = [...state.nodes, action.payload];
    },
    addEdge: (state, action) => {
      state.edges = [...state.edges, action.payload];
    },
    updateDragEndData: (state, action) => {
      state.dragEndDetails = action.payload;
    },
  },
});

export const {
  setNodes,
  setEdges,
  updateNodes,
  updateEdges,
  updateNode,
  selectNode,
  addNode,
  addEdge,
  updateDragEndData,
} = nodeEdgesSlice.actions;

export default nodeEdgesSlice.reducer;
