import classNames from "classnames";
import React from "react";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { useSelector } from "react-redux";

const MessageNode = (data) => {
  const selectedNode = useSelector(function (state) {
    return state.node.selectedNode;
  });
  console.log(
    "message node",
    selectedNode != null && data != null && selectedNode.id === data.id
  );
  return (
    <div
      className={classNames(
        "bg-white rounded-md shadow-md border-2 border-messageBorder w-40 cursor-grab",
        {
          "shadow-md shadow-messageBorder":
            selectedNode != null && data != null && selectedNode.id === data.id,
        }
      )}
    >
      <div className="h-30 flex items-center justify-center p-2">
        <div draggable>
          <BiMessageRoundedDetail className="w-full flex-grow justify-center items-center text-messageBorder" />
          <span className="align-middle text-messageBorder">Message</span>
        </div>
      </div>
    </div>
  );
};

export default MessageNode;
