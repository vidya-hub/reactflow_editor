import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "reactflow";
import SendMessageNode from "../../utils/send_message_node";
import DirectionalEdge from "../../utils/custom_edge";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  setEdges,
  setNodes,
  selectNode,
  addNode,
} from "../../store/nodes_edges_slice";
const nodeTypes = {
  sendMessageNode: SendMessageNode,
};
const edgeTypes = {
  customEdge: DirectionalEdge,
};

export default function EditorPanel() {
  const reactFlowWrapper = useRef(null);
  const dispatch = useDispatch();
  // Get the required data from the store
  const { nodes, edges, canUpdate, selectedNode } = useSelector(
    (state) => state.flow
  );

  // initialize necessary hooks for react flow to handle node and edge changes

  const [reactFlowNodes, setReactFlowNodes, onNodesChange] =
    useNodesState(nodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] =
    useEdgesState(edges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // this will be triggered to retrieve and display the saved nodes and edges
  useEffect(() => {
    const edges = JSON.parse(localStorage.getItem("edges"));
    const nodes = JSON.parse(localStorage.getItem("nodes"));
    if (edges) {
      dispatch(setEdges(edges));
      setReactFlowEdges(edges);
    }
    if (nodes) {
      dispatch(setNodes(nodes));
      setReactFlowNodes(nodes);
    }
    return () => {};
  }, [dispatch, setReactFlowEdges, setReactFlowNodes]);

  // on changing the message content this use effect will trigger
  // check the updateNode action in nodes_edges_slice.jsx
  useEffect(() => {
    updateSelectedNode();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUpdate]);
  function updateSelectedNode() {
    setReactFlowNodes((nodes) => {
      if (!reactFlowNodes) {
        return nodes;
      }
      const newNodes = nodes.map((node) => {
        if (selectedNode && node.id === selectedNode.id) {
          return { ...node, ...selectedNode };
        }
        return node;
      });
      return newNodes;
    });
    dispatch(selectNode(null));
  }

  // handleEdgesChange and handleNodesChange will be triggered whenever draggable changes are happened in nodes and edges
  const handleEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
      setReactFlowEdges((eds) => {
        return eds;
      });
      dispatch(setEdges(reactFlowEdges));
    },
    [dispatch, onEdgesChange, reactFlowEdges, setReactFlowEdges]
  );
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      dispatch(setNodes(reactFlowNodes));
    },
    [dispatch, onNodesChange, reactFlowNodes]
  );
  // this is the target method will be triggered while dragging the message node to editing panel
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  // Event handler while any drop target came inside reactflowinstance
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) {
        return;
      }
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - 100,
        y: event.clientY - 50,
      });

      const id = Math.floor(Math.random() * 100);
      const newNode = {
        id: `${id}`,
        type: "sendMessageNode",
        position,
        data: {
          title: `Send Message`,
          content: "",
        },
      };

      setReactFlowNodes((nds) => nds.concat(newNode));
      dispatch(addNode(newNode));
    },
    [dispatch, reactFlowInstance, setReactFlowNodes]
  );
  //
  // on connecting two nodes onEdgesConnect will be triggered to update state in locally and in Store
  const onEdgesConnect = useCallback(
    (connection) => {
      const canConnect =
        reactFlowEdges.filter((edge) => edge.source === connection.source)
          .length === 0;
      console.log(edges);
      if (!canConnect) {
        toast.error("Only one output connection per node is allowed!");
        return;
      }
      connection.markerEnd = { type: MarkerType.ArrowClosed };
      setReactFlowEdges((eds) => addEdge(connection, eds));
    },
    [edges, reactFlowEdges, setReactFlowEdges]
  );
  const onNodeClick = useCallback(
    (_, node) => {
      if (node) {
        dispatch(selectNode(node));
      }
    },
    [dispatch]
  );
  // handler for saving the nodes and edges data
  function saveNodesEdges() {
    const nodeIds = [...new Set(reactFlowNodes.map((item) => item.id))];
    const canSave = nodeIds.map((nodeId) => {
      return reactFlowEdges.some(
        (edge) => edge.target === nodeId || edge.source === nodeId
      );
    });
    if (canSave.indexOf(false) !== -1) {
      // TODO: show an error if there are more than one Nodes and more than one Node has empty target handles
      toast.error("Can't save changes");
      return;
    }
    localStorage.setItem("edges", JSON.stringify(reactFlowEdges));
    localStorage.setItem("nodes", JSON.stringify(reactFlowNodes));
    toast.success("Saved successfully");
  }

  return (
    <div className="w-4/6 relative">
      <ReactFlowProvider>
        <div
          className="reactflow-wrapper flex-grow h-full"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            onNodesChange={handleNodesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            style={{ width: "100%", height: "90%" }}
            snapToGrid={true}
            snapGrid={[15, 15]}
            elementsSelectable={false}
            nodes={reactFlowNodes}
            edges={reactFlowEdges}
            onEdgesChange={handleEdgesChange}
            onConnect={onEdgesConnect}
            onDrop={onDrop}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
          >
            <Background color="green" gap={16} />
          </ReactFlow>
        </div>
        <div className="absolute top-3 right-3">
          <button
            className="hover:bg-blue-600 bg-white text-blue-600 hover:text-white border border-blue-700  font-bold py-2 px-4 rounded cursor-auto"
            onClick={() => saveNodesEdges()}
          >
            Save Changes
          </button>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
