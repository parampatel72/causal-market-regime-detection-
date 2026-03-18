import { useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * AnimatedBackground Component
 * Beams-style animated background with hover reactivity
 * Subtle, professional aesthetic for quant research platform
 */
export default function AnimatedBackground() {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const location = useLocation();

    // Disable on charts-heavy pages
    const disabledRoutes = ['/explorer', '/simulations'];
    const isEnabled = !disabledRoutes.includes(location.pathname);

    // Beam configuration matching React Bits spec
    const config = useMemo(() => ({
        beamWidth: 1.5,
        beamHeight: 21,
        beamNumber: 19,
        lightColor: '#001eff',
        speed: 2,
        noiseIntensity: 1.75,
        scale: 0.2,
    }), []);

    useEffect(() => {
        // if (!isEnabled) return; // REMOVED: Keep context alive even when hidden

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resize();
        window.addEventListener('resize', resize);

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Simplex-like noise function
        const noise = (x, y, t) => {
            const sin1 = Math.sin(x * 0.01 + t) * config.noiseIntensity;
            const sin2 = Math.sin(y * 0.01 + t * 0.7) * config.noiseIntensity;
            const sin3 = Math.sin((x + y) * 0.005 + t * 0.5) * config.noiseIntensity;
            return (sin1 + sin2 + sin3) / 3;
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.005 * config.speed;

            // Draw beams
            for (let i = 0; i < config.beamNumber; i++) {
                const baseX = (canvas.width / (config.beamNumber + 1)) * (i + 1);
                const noiseOffset = noise(baseX, 0, time + i * 0.5) * 50;
                const x = baseX + noiseOffset;

                // Mouse reactivity - subtle push effect
                const dx = mouseRef.current.x - x;
                const dy = mouseRef.current.y - canvas.height / 2;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const influence = Math.max(0, 1 - dist / 300) * 30;
                const offsetX = dx > 0 ? -influence : influence;

                // Create beam gradient
                const gradient = ctx.createLinearGradient(
                    x + offsetX, 0,
                    x + offsetX, canvas.height
                );

                const alpha = 0.08 + Math.sin(time + i) * 0.03;
                gradient.addColorStop(0, 'transparent');
                gradient.addColorStop(0.3, `rgba(0, 30, 255, ${alpha * 0.5})`);
                gradient.addColorStop(0.5, `rgba(56, 189, 248, ${alpha})`);
                gradient.addColorStop(0.7, `rgba(129, 140, 248, ${alpha * 0.5})`);
                gradient.addColorStop(1, 'transparent');

                ctx.beginPath();
                ctx.moveTo(x + offsetX - config.beamWidth, 0);

                // Wave path
                for (let y = 0; y < canvas.height; y += config.beamHeight) {
                    const waveOffset = noise(x, y, time) * 10 * config.scale;
                    ctx.lineTo(x + offsetX + waveOffset, y);
                }

                ctx.lineTo(x + offsetX + config.beamWidth, canvas.height);
                ctx.lineTo(x + offsetX - config.beamWidth, canvas.height);
                ctx.closePath();

                ctx.fillStyle = gradient;
                ctx.fill();
            }

            // Subtle ambient glow at top
            const ambientGradient = ctx.createRadialGradient(
                canvas.width / 2, 0, 0,
                canvas.width / 2, 0, canvas.width * 0.6
            );
            ambientGradient.addColorStop(0, 'rgba(0, 30, 255, 0.03)');
            ambientGradient.addColorStop(0.5, 'rgba(56, 189, 248, 0.01)');
            ambientGradient.addColorStop(1, 'transparent');
            ctx.fillStyle = ambientGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, [config]);

    return (
        <>
            {/* WebGL Background - Always mounted, fades out when disabled */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
                style={{
                    zIndex: 0,
                    opacity: isEnabled ? 0.7 : 0
                }}
            />

            {/* Static Fallback - Always mounted, fades in when disabled */}
            <div
                className="fixed inset-0 pointer-events-none transition-opacity duration-700 ease-in-out"
                style={{
                    zIndex: 0,
                    background: 'radial-gradient(ellipse at 30% 20%, rgba(56, 189, 248, 0.03) 0%, transparent 50%)',
                    opacity: isEnabled ? 0 : 1
                }}
            />
        </>
    );
}
