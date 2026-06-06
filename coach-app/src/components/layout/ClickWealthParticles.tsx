"use client";

import React, { useEffect, useRef } from "react";

export default function ClickWealthParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let explosionParticles: Particle[] = [];
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      angle: number;
      type: "currency" | "sparkle";
      symbol: string;

      constructor(startX: number, startY: number) {
        this.x = startX;
        this.y = startY;
        
        // Dirección radial de explosión
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 2.0; 
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 1.2; // Salida inclinada hacia arriba
        
        this.type = Math.random() > 0.4 ? "currency" : "sparkle";
        this.size = Math.random() * 6 + 4; // Tamaño óptimo (4px a 10px)
        this.alpha = 1.0;
        this.angle = Math.random() * Math.PI * 2;
        this.symbol = this.type === "currency" 
          ? (Math.random() > 0.5 ? "$" : "∞") 
          : "✦";
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.12; // Gravedad
        this.speedX *= 0.97; // Resistencia del aire
        this.alpha -= 0.016; // Desvanecimiento gradual
        this.angle += 0.08; // Rotación al caer
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        
        if (this.type === "currency") {
          // Moneda dorada con $ o ∞
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle);
          
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(251, 191, 36, 0.22)"; // Oro traslúcido
          ctx.strokeStyle = "rgba(251, 191, 36, 0.9)";
          ctx.lineWidth = 1.3;
          ctx.stroke();
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "rgba(251, 191, 36, 0.95)";
          ctx.shadowBlur = 6;
          ctx.font = `bold ${this.size * 1.15}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(this.symbol, 0, 0);
        } else if (this.type === "sparkle") {
          // Estrella destellante de 4 puntas
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle);
          
          ctx.beginPath();
          const cx = 0;
          const cy = 0;
          const spikes = 4;
          const outerRadius = this.size * 1.5;
          const innerRadius = this.size * 0.45;
          
          let rot = Math.PI / 2 * 3;
          let x = cx;
          let y = cy;
          const step = Math.PI / spikes;

          ctx.moveTo(cx, cy - outerRadius);
          for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
          }
          ctx.lineTo(cx, cy - outerRadius);
          ctx.closePath();
          
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "rgba(251, 191, 36, 0.95)";
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let active = false;

      for (let i = explosionParticles.length - 1; i >= 0; i--) {
        const ep = explosionParticles[i];
        ep.update();
        if (ep.alpha <= 0.015 || ep.y > canvas.height + 20) {
          explosionParticles.splice(i, 1);
        } else {
          ep.draw();
          active = true;
        }
      }

      if (active) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        animationFrameId = null;
      }
    };

    const handleWindowClick = (e: MouseEvent) => {
      const clickX = e.clientX;
      const clickY = e.clientY;
      
      for (let i = 0; i < 10; i++) {
        explosionParticles.push(new Particle(clickX, clickY));
      }

      if (animationFrameId === null) {
        animate();
      }
    };

    const handleWindowTouch = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        for (let i = 0; i < 8; i++) {
          explosionParticles.push(new Particle(touchX, touchY));
        }

        if (animationFrameId === null) {
          animate();
        }
      }
    };

    window.addEventListener("click", handleWindowClick);
    window.addEventListener("touchstart", handleWindowTouch);

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleWindowClick);
      window.removeEventListener("touchstart", handleWindowTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[9999]"
    />
  );
}
