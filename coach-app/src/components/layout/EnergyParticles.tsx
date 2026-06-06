"use client";

import React, { useEffect, useRef } from "react";

export default function EnergyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 45; // Densidad ideal para flotar
    
    // Colores brillantes espirituales
    const colors = [
      "rgba(167, 139, 250, 0.85)", // Violeta
      "rgba(244, 114, 182, 0.85)", // Rosa
      "rgba(251, 191, 36, 0.9)",   // Dorado
      "rgba(56, 189, 248, 0.85)",  // Turquesa
    ];

    let mouse = { x: -1000, y: -1000, radius: 130 };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      angle: number;
      type: "light" | "currency" | "sparkle";
      symbol: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        
        // Movimiento de deriva flotante normal
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = -(Math.random() * 0.4 + 0.15); // Lento ascenso
        this.type = Math.random() > 0.85 ? "currency" : (Math.random() > 0.70 ? "sparkle" : "light");
        this.size = Math.random() * 4 + 2;
        this.alpha = Math.random() * 0.4 + 0.45;

        this.color = this.type === "currency" || this.type === "sparkle"
          ? "rgba(251, 191, 36, 0.9)" // Oro
          : colors[Math.floor(Math.random() * colors.length)];
          
        this.pulseSpeed = Math.random() * 0.03 + 0.015;
        this.angle = Math.random() * Math.PI * 2;
        this.symbol = this.type === "currency" 
          ? (Math.random() > 0.5 ? "$" : "∞") 
          : "✦";
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reaparecer abajo
        if (this.y < -30 || this.x < -30 || this.x > canvas!.width + 30) {
          this.y = canvas!.height + Math.random() * 30;
          this.x = Math.random() * canvas!.width;
          this.alpha = Math.random() * 0.4 + 0.45;
        }

        // Empuje del cursor
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x += (dx / distance) * force * 2.5;
          this.y += (dy / distance) * force * 2.5;
        }

        // Latido
        this.angle += this.pulseSpeed;
        this.alpha = 0.5 + Math.sin(this.angle) * 0.35;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        
        if (this.type === "light") {
          // Luz espiritual clásica
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 3.5, 0, Math.PI * 2);
          
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * 3.5
          );
          gradient.addColorStop(0, this.color);
          gradient.addColorStop(0.2, this.color.replace("0.85", "0.3").replace("0.9", "0.3"));
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(this.x, this.y, Math.max(1.0, this.size * 0.35), 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        } else if (this.type === "currency") {
          // Moneda dorada o infinito flotante
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle * 0.25);
          
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(251, 191, 36, 0.2)"; // Fondo oro transparente
          ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "rgba(251, 191, 36, 0.9)";
          ctx.shadowBlur = 5;
          ctx.font = `bold ${this.size * 1.1}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(this.symbol, 0, 0);
        } else if (this.type === "sparkle") {
          // Destello / Estrella de 4 puntas dorada
          ctx.translate(this.x, this.y);
          ctx.rotate(this.angle * 0.4);
          
          ctx.beginPath();
          const cx = 0;
          const cy = 0;
          const spikes = 4;
          const outerRadius = this.size * 1.6;
          const innerRadius = this.size * 0.4;
          
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

    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      canvas.width = parent ? parent.offsetWidth : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      init();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
