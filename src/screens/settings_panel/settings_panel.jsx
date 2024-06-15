import React, { useRef, useEffect } from "react";
import { BiArrowBack, BiMessageRoundedDetail } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { selectNode } from "../../store/node_slice";

export default function SettingsPanel() {
  const dispatch = useDispatch();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
    console.log("Drag started");
  };
  const textRef = useRef(null);
  const selectedNode = useSelector(function (state) {
    return state.node.selectedNode;
  });
  useEffect(() => {
    if (textRef.current) {
      console.log(selectedNode);
      if (selectedNode.data && selectedNode.data.content) {
        textRef.current.value = selectedNode.data.content;
      } else {
        textRef.current.value = null;
      }
    }
    return () => {};
  }, [selectedNode]);

  return (
    <div className=" w-2/6 border-l-2 border-t-2">
      <div className="bg-white border-b-2 h-30 flex items-center justify-start p-2 ">
        <button
          onClick={() => {
            dispatch(selectNode(null));
          }}
          className="p-2 mx-2 hover:bg-slate-200 rounded-md"
        >
          <BiArrowBack></BiArrowBack>
        </button>
        <span className="w-full flex-grow text-center align-middle">
          {selectedNode != null ? "Message" : "Nodes"}
        </span>
      </div>
      <aside>
        {selectedNode != null ? (
          <textarea
            ref={textRef}
            style={{ caretColor: "white" }}
            className="mx-3 p-2 text-sm rounded-lg block w-80 h-20 my-3  border-2 flex-grow outline-none border-messageBorder"
            placeholder="Enter Message"
            autoComplete="off"
            required
          />
        ) : (
          <div className="bg-white m-3 py-5 rounded-md shadow-md border-2 border-messageBorder w-40 cursor-grab">
            <div className="h-30 flex items-center justify-center p-2">
              <div
                className="input"
                onDragStart={(event) => onDragStart(event, "messageNode")}
                draggable
              >
                <BiMessageRoundedDetail className="w-full flex-grow justify-center items-center text-messageBorder" />
                <span className="align-middle text-messageBorder">Message</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
