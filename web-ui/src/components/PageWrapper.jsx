import LightPillar from './LightPillar';

/**
 * PageWrapper Component
 * Applies the same premium design (LightPillar background, gradient overlay)
 * to all pages for consistency with the Home page design
 */
export default function PageWrapper({ children }) {
    return (
        <div className="min-h-screen relative">
            {/* LightPillar Background - Fixed */}
            <div style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                backgroundColor: '#0B0E14',
            }}>
                <LightPillar
                    topColor="#5B5DFF"
                    bottomColor="#C6C4CA"
                    intensity={0.5}
                    rotationSpeed={0.4}
                    glowAmount={0.008}
                    pillarWidth={2.5}
                    pillarHeight={0.4}
                    noiseIntensity={0}
                    pillarRotation={222}
                    mixBlendMode="normal"
                    quality="medium"
                />
            </div>

            {/* Subtle dark overlay for text readability */}
            <div
                className="fixed inset-0"
                style={{
                    zIndex: 1,
                    background: 'radial-gradient(ellipse at 50% 30%, transparent 0%, rgba(8, 11, 16, 0.5) 80%)',
                    pointerEvents: 'none',
                }}
            />

            {/* Page Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}

