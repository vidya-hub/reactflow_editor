import React, { useRef, useEffect, useCallback, useState } from "react";
import { BiArrowBack, BiMessageRoundedDetail } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  updateNode,
  selectNode,
  updateDragEndData,
} from "../../store/nodes_edges_slice";
import Draggable from "react-draggable";

export default function SettingsPanel() {
  const dispatch = useDispatch();
  const textRef = useRef(null);
  const selectedNode = useSelector(function (state) {
    return state.flow.selectedNode;
  });
  // const [position, updatePosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (textRef.current) {
      if (selectedNode.data && selectedNode.data.content) {
        textRef.current.value = selectedNode.data.content;
      } else {
        textRef.current.value = null;
      }
    }
    return () => {};
  }, [selectedNode]);

  const onSubmit = useCallback(() => {
    if (selectedNode == null) {
      return;
    }
    if (textRef.current.value.length <= 0) {
      // Fixed the condition to check for empty value
      toast.error("Message value shouldn't be empty");
      return;
    }
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        content: textRef.current.value,
      },
    };
    dispatch(updateNode(updatedNode));
  }, [dispatch, selectedNode, textRef]);
  function onDragStart() {}

  function onDragStop(_, data) {
    // updatePosition({ x: data.x, y: data.y });
    dispatch(updateDragEndData({ x: data.x, y: data.y }));
  }
  const dragHandlers = { onStart: onDragStart, onStop: onDragStop };
  return (
    <div className=" w-2/6 border-l-2 border-t-2">
      <div className="bg-white border-b-2 h-30 flex items-center justify-start p-2 ">
        <button
          onClick={() => {
            dispatch(selectNode(null));
          }}
          className={classNames(selectedNode == null ? "hidden" : "block")}
        >
          <BiArrowBack></BiArrowBack>
        </button>
        <span className="w-full flex-grow text-center align-middle">
          {selectedNode != null ? "Message" : "Nodes"}
        </span>
      </div>
      <aside>
        {selectedNode != null ? (
          <>
            <div className="bg-white rounded-md shadow-md shadow-gray-400 w-80 m-2 p-1">
              <div className="bg-cardTitle rounded-t-md h-30 flex items-center justify-start p-2">
                <BiMessageRoundedDetail className="mr-2" />
                <span className="text-sm font-bold text-gray-800 flex-grow text-center">
                  {selectedNode.data.title}
                </span>
                <FaWhatsapp className="ml-2" />
              </div>
              <textarea
                ref={textRef}
                style={{ caretColor: "black" }}
                className="p-2 outline-none text-sm rounded-lg block w-full h-20 my-2  border-2 flex-grow "
                placeholder="Enter Message"
                autoComplete="off"
                required
              />
              <div className="flex space-x-4 mx-4 my-2">
                <button
                  onClick={() => onSubmit()}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold  py-2 px-4 rounded"
                >
                  Submit
                </button>
                <button
                  onClick={() => {
                    dispatch(selectNode(null));
                  }}
                  className="border border-red-600 hover:bg-red-500 hover:text-white text-black  font-bold  py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <Draggable {...dragHandlers} position={{ x: 0, y: 0 }}>
            <div className="bg-white m-3 py-5 rounded-md shadow-md border-2 border-messageBorder w-40 cursor-grab">
              <div className="h-30 flex items-center justify-center p-2">
                <div>
                  <BiMessageRoundedDetail className="w-full flex-grow justify-center items-center text-messageBorder" />
                  <span className="align-middle text-messageBorder">
                    Message
                  </span>
                </div>
              </div>
            </div>
          </Draggable>
        )}
      </aside>
    </div>
  );
}
