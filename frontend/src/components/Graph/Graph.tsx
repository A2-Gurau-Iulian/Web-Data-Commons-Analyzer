import React, { useRef, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

function Graph({ graphData }) {
  const graphRef = useRef();

  useEffect(() => {
    console.log("Graph data:", graphData);
  }, [graphData]);

  const nodeColor = (node) => (node.type === "subject" ? "blue" : "green");

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeId="id"
        nodeLabel={(node) => `${node.id}`}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkLabel={(link) => link.predicate}
        nodeAutoColorBy="type"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = nodeColor(node);
          ctx.beginPath();
          ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "black";
          ctx.fillText(label, node.x, node.y + 12);
        }}
      />
    </div>
  );
}

export default Graph;
