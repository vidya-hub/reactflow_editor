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
import { selectNode } from "../../store/selected_node_slice";
import { toast } from "react-toastify";
import { setEdges, setNodes } from "../../store/nodes_edges_slice";
const nodeTypes = {
  sendMessageNode: SendMessageNode,
};
const edgeTypes = {
  customEdge: DirectionalEdge,
};

export default function EditorPanel() {
  const reactFlowWrapper = useRef(null);
  const nodes = useSelector((state) => state.flow.nodes);
  const edges = useSelector((state) => state.flow.edges);
  const dispatch = useDispatch();

  const [reactFlowNodes, setReactFlowNodes, onNodesChange] =
    useNodesState(nodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] =
    useEdgesState(edges);
  const handleNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
      setReactFlowNodes((nds) => {
        return nds;
      });
      dispatch(setNodes(reactFlowNodes));
    },
    [dispatch, onNodesChange, reactFlowNodes, setReactFlowNodes]
  );

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

  useEffect(() => {
    console.log(reactFlowNodes, nodes);
    dispatch(setNodes(reactFlowNodes));
  }, [reactFlowNodes, nodes, dispatch]);

  useEffect(() => {
    dispatch(setEdges(reactFlowEdges));
  }, [reactFlowEdges, dispatch]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
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
    },
    [reactFlowInstance, setReactFlowNodes]
  );
  const onConnect = useCallback(
    (connection) => {
      const canConnect =
        edges.filter((edge) => edge.source === connection.source).length === 0;
      console.log(edges);
      if (!canConnect) {
        toast.error("Only one output connection per node is allowed!");
        return;
      }
      connection.markerEnd = { type: MarkerType.ArrowClosed };
      setReactFlowEdges((eds) => addEdge(connection, eds));
    },
    [edges, setReactFlowEdges]
  );
  const onNodeClick = useCallback(
    (event, node) => {
      if (node) {
        dispatch(selectNode(node));
      }
    },
    [dispatch]
  );

  return (
    <div className="w-4/6">
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
            nodes={nodes}
            edges={edges}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
          >
            <Background color="green" gap={16} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
}
