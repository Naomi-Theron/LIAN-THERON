import { useEffect, useRef } from "react";

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle Resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track Mouse
    const handleMouseMove = (e: MouseEvent) => {
      const cx = width / 2;
      const cy = height / 2;
      // Normalized mouse coordinates (-1 to 1)
      mouseRef.current.targetX = (e.clientX - cx) / cx;
      mouseRef.current.targetY = (e.clientY - cy) / cy;

      if (mouseRef.current.isDown) {
        const dx = e.clientX - mouseRef.current.lastX;
        const dy = e.clientY - mouseRef.current.lastY;
        dragRotation.y += dx * 0.005;
        dragRotation.x += dy * 0.005;
      }
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isDown = true;
      mouseRef.current.lastX = e.clientX;
      mouseRef.current.lastY = e.clientY;
    };

    const handleMouseUp = () => {
      mouseRef.current.isDown = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Star Class (3D space)
    interface Star {
      x: number;
      y: number;
      z: number;
      color: string;
      size: number;
    }

    const stars: Star[] = [];
    const maxStars = 120;
    for (let i = 0; i < maxStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        color: Math.random() > 0.4 ? "#34d399" : "#06b6d4", // Emerald or Cyan
        size: Math.random() * 2 + 1,
      });
    }

    // Floating Geometric Mesh Nodes
    interface MeshNode {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
    }
    const nodes: MeshNode[] = [];
    const maxNodes = 25;
    for (let i = 0; i < maxNodes; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        z: (Math.random() - 0.5) * 800,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
      });
    }

    // Projection variables
    const fov = 400; // Field of View
    let dragRotation = { x: 0, y: 0 };
    let currentRotation = { x: 0, y: 0 };

    // 3D Perspective Grid Scrolling
    let gridOffset = 0;

    // Animation Loop
    const animate = () => {
      ctx.fillStyle = "rgba(8, 10, 15, 0.15)"; // Soft trails for glowing effect
      ctx.fillRect(0, 0, width, height);

      // Damp mouse input
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Base auto-rotation + Drag Rotation + Mouse Parallax
      currentRotation.y = dragRotation.y + Date.now() * 0.0001 + mouseRef.current.x * 0.15;
      currentRotation.x = dragRotation.x + Date.now() * 0.00005 + mouseRef.current.y * 0.15;

      const cosY = Math.cos(currentRotation.y);
      const sinY = Math.sin(currentRotation.y);
      const cosX = Math.cos(currentRotation.x);
      const sinX = Math.sin(currentRotation.x);

      const cx = width / 2;
      const cy = height / 2;

      // ---- 1. Render Scrolling Perspective Grid (Bottom) ----
      ctx.strokeStyle = "rgba(52, 211, 153, 0.06)"; // Ultra subtle neon green
      ctx.lineWidth = 1;

      gridOffset = (gridOffset + 0.8) % 40; // Forward scroll speed

      const gridY = height * 0.65; // Grid horizon line
      const gridZStart = 40;
      const gridZEnd = 400;
      const gridSpacing = 40;

      // Horizontal lines projected in 3D
      for (let z = gridZStart - (gridOffset % gridSpacing); z < gridZEnd; z += gridSpacing) {
        const py = gridY + (fov * 200) / z;
        if (py > height) continue;
        const opacity = Math.max(0, 1 - z / gridZEnd) * 0.15;
        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
      }

      // Vertical perspective lines originating from a vanishing point on the horizon
      const numLines = 26;
      for (let i = -numLines / 2; i <= numLines / 2; i++) {
        const xOffset = i * 140;
        ctx.beginPath();
        // horizon origin
        const startX = cx + (xOffset * fov) / gridZEnd;
        const startY = gridY + (fov * 200) / gridZEnd;
        // screen bottom edge
        const endX = cx + (xOffset * fov) / gridZStart;
        const endY = gridY + (fov * 200) / gridZStart;

        ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * (1 - Math.abs(i) / (numLines / 2))})`;
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // ---- 2. Render and Update Stars (Space Fly-Through) ----
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        // Fly towards camera
        star.z -= 1.5;
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 2000;
        }

        // Apply mouse movement to star positions as well
        const sx = star.x - mouseRef.current.x * 200;
        const sy = star.y - mouseRef.current.y * 200;

        // Projection
        const scale = fov / (star.z + fov);
        const px = sx * scale + cx;
        const py = sy * scale + cy;

        if (px >= 0 && px < width && py >= 0 && py < height) {
          const alpha = Math.min(1, (2000 - star.z) / 500) * 0.45;
          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(px, py, star.size * scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;

      // ---- 3. Render 3D Constellation Cluster ----
      const projectedNodes: Array<{ x: number; y: number; z: number }> = [];

      nodes.forEach((node) => {
        // Move nodes inside bounding volume
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Bounce
        const limit = 400;
        if (Math.abs(node.x) > limit) node.vx *= -1;
        if (Math.abs(node.y) > limit) node.vy *= -1;
        if (Math.abs(node.z) > limit) node.vz *= -1;

        // 3D Rotations (Y-axis, then X-axis)
        // Y-Rotation
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // X-Rotation
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX;

        // Add depth parallax from mouse coordinate
        z2 += fov;

        // Projection
        const scale = fov / z2;
        const px = x1 * scale + cx;
        const py = y2 * scale + cy;

        projectedNodes.push({ x: px, y: py, z: z2 });

        // Draw node
        if (px >= 0 && px < width && py >= 0 && py < height) {
          const opacity = Math.min(1, (800 - z2) / 400) * 0.6;
          ctx.fillStyle = "rgba(52, 211, 153, " + opacity + ")";
          ctx.beginPath();
          ctx.arc(px, py, 3.5 * scale, 0, Math.PI * 2);
          ctx.fill();
          
          // Outer glow for key nodes
          if (z2 < fov + 100) {
            ctx.strokeStyle = "rgba(52, 211, 153, " + opacity * 0.3 + ")";
            ctx.beginPath();
            ctx.arc(px, py, 8 * scale, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      // Draw connection lines
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          
          // Distance in screen space
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const zAvg = (n1.z + n2.z) / 2;
            const opacity = (1 - dist / 120) * Math.min(1, (800 - zAvg) / 400) * 0.25;
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <canvas
      id="3d-ambient-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 bg-[#080a0f] select-none touch-none pointer-events-none"
    />
  );
}
