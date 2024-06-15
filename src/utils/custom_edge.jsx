import React from "react";
import { getBezierPath, BaseEdge, useStore } from "reactflow";

export const getSpecialPath = (
  { sourceX, sourceY, targetX, targetY },
  offset
) => {
  const centerX = (sourceX + targetX) / 2;
  const centerY = (sourceY + targetY) / 2;

  return `M ${sourceX} ${sourceY} Q ${centerX} ${
    centerY + offset
  } ${targetX} ${targetY}`;
};

export default function DirectionalEdge({
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}) {
  const isBiDirectionEdge = useStore((s) => {
    const edgeExists = s.edges.some(
      (e) =>
        (e.source === target && e.target === source) ||
        (e.target === source && e.source === target)
    );

    return edgeExists;
  });

  const edgePathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  let path = "";

  if (isBiDirectionEdge) {
    path = getSpecialPath(edgePathParams, sourceX < targetX ? 25 : -25);
  } else {
    [path] = getBezierPath(edgePathParams);
  }

  return <BaseEdge path={path} markerEnd={markerEnd} />;
}
