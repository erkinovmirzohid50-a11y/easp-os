import './animated-background.css'

export function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="animated-background fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      <div className="background-velvet" />
      <div className="background-ribs" />
      <div className="background-undertones" />
      <div className="background-light" />
      <svg className="background-grain" xmlns="http://www.w3.org/2000/svg">
        <filter id="fabric-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#fabric-grain)" />
      </svg>
    </div>
  )
}
