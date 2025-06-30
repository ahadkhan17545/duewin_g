import React, { useEffect, useRef } from "react";

const ChartConnectorCanvas = ({ chartData }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData.length) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rowHeight = 48;
    const cellWidth = 24;
    const offsetLeft = 148;
    const centerY = 70;
    const centerX = -6;

    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;

    for (let i = 0; i < chartData.length ; i++) {
      const current = chartData[i]?.number;
      const next = chartData[i + 1]?.number;

      if (current == null || next == null) continue;

      const x1 = offsetLeft + current * cellWidth + centerX;
      const y1 = i * rowHeight + centerY;
      const x2 = offsetLeft + next * cellWidth + centerX;
      const y2 = (i + 1) * rowHeight + centerY;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, [chartData]);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={chartData.length * 50}
      className="absolute top-0 left-0 pointer-events-none z-0"
    />
  );
};

export default ChartConnectorCanvas;
