import React, { useCallback, useRef, useState } from "react";
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
import MessageNode from "../../utils/message_node";
import { useDispatch } from "react-redux";
import { selectNode } from "../../store/node_slice";
const nodeTypes = {
  sendMessageNode: SendMessageNode,
  messageNode: MessageNode,
};
const edgeTypes = {
  customEdge: DirectionalEdge,
};

export default function EditorPanel() {
  const initialElements = [
    {
      id: "1",
      type: "sendMessageNode", // custom node
      data: {
        title: "Send Message",
        content: Math.floor(Math.random() * 100),
      },
      position: { x: 250, y: 100 },
    },
  ];
  const initialEdges = [];
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialElements);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const dispatch = useDispatch();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const id = Math.floor(Math.random() * 100);
      const newNode = {
        id: `${id}`,
        type,
        position,
        data: {
          title: `Send Message ${id}`,
          content: "",
        },
      };
      setNodes((nds) => {
        console.log(newNode);
        return nds.concat(newNode);
      });
    },
    [reactFlowInstance, setNodes]
  );

  const onConnect = useCallback(
    (connection) => {
      const canConnect =
        edges.filter((edge) => edge.source === connection.source).length === 0;
      console.log(edges);
      if (!canConnect) {
        alert("You can't connect the source node");
        return;
      }
      connection.markerEnd = { type: MarkerType.ArrowClosed };
      return setEdges((edges) => addEdge(connection, edges));
    },
    [setEdges, edges]
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
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            style={{ width: "100%", height: "90%" }}
            snapToGrid={true}
            snapGrid={[15, 15]}
            elementsSelectable={false}
            nodes={nodes}
            edges={edges}
            onEdgesChange={onEdgesChange}
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
