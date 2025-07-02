import React, { useEffect, useRef } from "react";

const ChartConnectorCanvas5D = ({ chartData, activeImgTab }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData.length) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fine-tuned positioning to match your table layout exactly
    const rowHeight = 48; // Height of each table row
    const cellWidth = 17; // Width of each number circle (16px + 1px spacing)
    const offsetLeft = 175; // Left offset to align with the number section
    const centerY = 24; // Center Y position within each row
    const centerX = 8; // Center X offset for each circle (half of 16px)

    ctx.strokeStyle = "#ef4444"; // Red color for the connecting lines
    ctx.lineWidth = 2;

    for (let i = 0; i < chartData.length - 1; i++) {
      // For 5D lottery, get the value for the selected position (A, B, C, D, E, or SUM)
      const current = chartData[i]?.result?.[activeImgTab];
      const next = chartData[i + 1]?.result?.[activeImgTab];

      if (current == null || next == null) continue;

      // Calculate positions for current and next points
      const x1 = offsetLeft + current * cellWidth + centerX;
      const y1 = i * rowHeight + centerY + 40; // +40 to account for header height and padding
      const x2 = offsetLeft + next * cellWidth + centerX;
      const y2 = (i + 1) * rowHeight + centerY + 40;

      // Draw the connecting line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }, [chartData, activeImgTab]); // Added activeImgTab as dependency

  return (
    <canvas
      ref={canvasRef}
      width={400} // Reduced width to match table
      height={chartData.length * 48 + 64} // Account for header and row heights
      className="absolute top-0 left-0 pointer-events-none z-10"
      style={{ opacity: 0.8 }}
    />
  );
};

export default ChartConnectorCanvas5D;