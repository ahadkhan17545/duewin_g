import React, { useEffect, useRef } from "react";

const ChartConnectorCanvas = ({ chartData, containerRef,activeImage = null }) => {
  const canvasRef = useRef(null);

  const drawCanvas = () => {

    const canvas = canvasRef?.current;
    if (!canvas || !chartData.length || !containerRef?.current) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const containerRect = containerRef.current.getBoundingClientRect();

    const highlightedPoints = Array.from(
      containerRef?.current.querySelectorAll(".highlight")
    ).map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      };
    });

    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;

    for (let i = 0; i < highlightedPoints.length - 1; i++) {
      const p1 = highlightedPoints[i];
      const p2 = highlightedPoints[i + 1];
      if (!p1 || !p2) continue;

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  };

    useEffect(() => {
    if (!containerRef?.current) return;
  }, [chartData, containerRef]);
  useEffect(() => {
    drawCanvas();

    const handleResize = () => {
      drawCanvas(); // Redraw on screen resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [chartData, containerRef,activeImage]);

  return (
    <canvas
      ref={canvasRef}
      width={containerRef?.current?.offsetWidth || 400}
      height={chartData.length * 48 + 64}
      className="absolute top-0 left-0 pointer-events-none z-10"
      style={{ opacity: 0.8 }}
    />
  );
};

export default ChartConnectorCanvas;
