import React from "react";
import { Handle, Position } from "reactflow";
import { FaWhatsapp } from "react-icons/fa";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import classNames from "classnames";
const SendMessageNode = ({ id, data }) => {
  const selectedNode = useSelector(function (state) {
    return state.flow.selectedNode;
  });
  return (
    <div
      className={classNames(
        "bg-white rounded-md shadow-md shadow-gray-400 w-80",
        {
          "border-2  border-gray-400 shadow-sm shadow-messageBorder":
            selectedNode && selectedNode.id === id,
        }
      )}
    >
      <div className="bg-cardTitle rounded-t-md h-30 flex items-center justify-start p-2">
        <BiMessageRoundedDetail className="mr-2" />
        <span className="text-sm font-bold text-gray-800 flex-grow text-center">
          {data.title}
        </span>
        <FaWhatsapp className="ml-2" />
      </div>
      <div className="p-3">{data.content ? data.content : "No message"}</div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
        id="target"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
        id="source"
      />
    </div>
  );
};

export default SendMessageNode;
