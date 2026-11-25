import { useEffect, useRef, useState } from 'react'
import './Lasul.css'

type ParticleColor = { h: number; s: number; l: number }
type Particle = {
  x: number; y: number; vx: number; vy: number; angle: number; angleSpeed: number
  noiseT: number; size: number; alpha: number; colorIndex: number; wanderStrength: number
}

const presets = [
  { hue: 190, name: 'Ocean', color: '#00d9ff' },
  { hue: 265, name: 'Violet', color: '#9147ff' },
  { hue: 330, name: 'Rose', color: '#ff3e9d' },
  { hue: 145, name: 'Emerald', color: '#00e69a' },
  { hue: 35, name: 'Sunset', color: '#ff9d36' },
]

function colorsFor(hue: number): ParticleColor[] {
  return [
    { h: hue, s: 100, l: 62 },
    { h: (hue + 20) % 360, s: 100, l: 65 },
    { h: (hue + 65) % 360, s: 90, l: 68 },
    { h: (hue + 140) % 360, s: 90, l: 68 },
  ]
}

function hueFromHex(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min
  let hue = 0
  if (delta) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6)
    else if (max === g) hue = 60 * ((b - r) / delta + 2)
    else hue = 60 * ((r - g) / delta + 4)
  }
  return (hue + 360) % 360
}

export function Lasul() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hue, setHue] = useState(190)
  const [customColor, setCustomColor] = useState('#00d9ff')

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const config = {
      count: 220, linkDistance: 110, trailFade: 0.25, friction: 0.965,
      hoverPull: 0.28, hoverRadius: 280, hoverSwirl: 0.42, hoverCore: 85, hoverRepel: 1.6,
      holdPull: 0.85, holdRadius: 460, holdSwirl: 0.34, holdCore: 55, holdRepel: 2.6,
      maxSpeed: 3.4, maxSpeedHold: 7.5,
    }
    const pointer = { x: 0, y: 0, active: false, pressed: false }
    let width = 0, height = 0, frame = 0
    let colors = colorsFor(hue)
    let particles: Particle[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const spawn = (): Particle => {
      const depth = Math.random(), choice = Math.random()
      return {
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
        angle: Math.random() * Math.PI * 2, angleSpeed: (Math.random() - 0.5) * 0.012,
        noiseT: Math.random() * 1000, size: 0.9 + depth * 1.8,
        alpha: 0.35 + depth * 0.55,
        colorIndex: choice < 0.55 ? 0 : choice < 0.85 ? 1 : choice < 0.97 ? 2 : 3,
        wanderStrength: 0.028 + Math.random() * 0.034,
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#03050d'
      ctx.fillRect(0, 0, width, height)
      particles = Array.from({ length: config.count }, spawn)
    }

    const update = (p: Particle) => {
      p.noiseT += 0.006
      p.angle += p.angleSpeed + Math.sin(p.noiseT) * 0.01
      p.vx += Math.cos(p.angle) * p.wanderStrength
      p.vy += Math.sin(p.angle) * p.wanderStrength
      if (pointer.active) {
        const dx = pointer.x - p.x, dy = pointer.y - p.y
        const distance = Math.hypot(dx, dy) || 0.0001
        const nx = dx / distance, ny = dy / distance
        const pull = pointer.pressed ? config.holdPull : config.hoverPull
        const radius = pointer.pressed ? config.holdRadius : config.hoverRadius
        const swirl = pointer.pressed ? config.holdSwirl : config.hoverSwirl
        const core = pointer.pressed ? config.holdCore : config.hoverCore
        const repel = pointer.pressed ? config.holdRepel : config.hoverRepel
        if (distance < radius) {
          const force = (1 - distance / radius) * pull
          p.vx += nx * force - ny * force * swirl
          p.vy += ny * force + nx * force * swirl
        } else {
          p.vx += nx * pull * 0.14
          p.vy += ny * pull * 0.14
        }
        if (distance < core) {
          const force = (1 - distance / core) * repel
          p.vx -= nx * force
          p.vy -= ny * force
        }
      }
      p.vx *= config.friction
      p.vy *= config.friction
      const speed = Math.hypot(p.vx, p.vy)
      const max = pointer.pressed ? config.maxSpeedHold : config.maxSpeed
      if (speed > max) { p.vx = p.vx / speed * max; p.vy = p.vy / speed * max }
      p.x += p.vx
      p.y += p.vy
      const pad = 40
      if (p.x < -pad) p.x = width + pad
      else if (p.x > width + pad) p.x = -pad
      if (p.y < -pad) p.y = height + pad
      else if (p.y > height + pad) p.y = -pad
    }

    const drawParticle = (p: Particle) => {
      const color = colors[p.colorIndex] || colors[0]
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${p.alpha * 0.14})`
      ctx.fill()
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${color.h}, ${color.s}%, ${color.l}%, ${p.alpha})`
      ctx.fill()
    }

    const draw = () => {
      ctx.fillStyle = `rgba(3, 5, 13, ${config.trailFade})`
      ctx.fillRect(0, 0, width, height)
      const maxDistance = config.linkDistance, maxDistanceSquared = maxDistance * maxDistance
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j], dx = a.x - b.x, dy = a.y - b.y
          const distanceSquared = dx * dx + dy * dy
          if (distanceSquared < maxDistanceSquared) {
            const alpha = (1 - Math.sqrt(distanceSquared) / maxDistance) * 0.22
            ctx.strokeStyle = `hsla(${colors[0].h}, 100%, 65%, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const particle of particles) { update(particle); drawParticle(particle) }
      if (pointer.active) {
        ctx.beginPath()
        ctx.arc(pointer.x, pointer.y, pointer.pressed ? 40 : 20, 0, Math.PI * 2)
        ctx.strokeStyle = pointer.pressed
          ? `hsla(${colors[0].h}, 100%, 70%, 0.75)`
          : `hsla(${colors[0].h}, 100%, 65%, 0.30)`
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
      frame = window.requestAnimationFrame(draw)
    }

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }
    const down = (event: PointerEvent) => {
      move(event)
      if (event.pointerType !== 'mouse') canvas.setPointerCapture?.(event.pointerId)
      pointer.pressed = true
    }
    const up = () => {
      if (pointer.pressed && pointer.active) {
        for (const p of particles) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y, distance = Math.hypot(dx, dy) || 0.0001
          if (distance < 320) {
            const force = (1 - distance / 320) * 7.5
            p.vx += dx / distance * force
            p.vy += dy / distance * force
          }
        }
      }
      pointer.pressed = false
    }
    const leave = () => { pointer.active = false; pointer.pressed = false }

    resize()
    frame = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    canvas.addEventListener('pointerleave', leave)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointerleave', leave)
    }
  }, [hue])

  const changeHue = (nextHue: number) => {
    setHue(nextHue)
    setCustomColor(`#${Math.round(nextHue).toString(16).padStart(2, '0')}00ff`)
  }

  return (
    <main className="lasul" aria-label="LASUL interactive particle experience">
      <canvas ref={canvasRef} className="lasul-canvas" aria-hidden="true" />
      <header className="lasul-hud">
        <h1>LASUL</h1>
        <p className="lasul-hint">
          <span><b>Move</b> · attract</span>
          <span><b>Hold</b> · gather</span>
          <span><b>Release</b> · burst</span>
        </p>
      </header>
      <section className="lasul-color-panel" aria-label="Particle color controls">
        <span className="lasul-panel-label">PARTICLE COLORS</span>
        <div className="lasul-color-options">
          {presets.map((preset) => (
            <button
              key={preset.name}
              className={`lasul-color-btn${hue === preset.hue ? ' active' : ''}`}
              style={{ '--swatch': preset.color } as React.CSSProperties}
              aria-label={`${preset.name} particle color`}
              aria-pressed={hue === preset.hue}
              onClick={() => changeHue(preset.hue)}
            />
          ))}
          <label className="lasul-custom-color" title="Choose custom particle color">
            <span aria-hidden="true">+</span>
            <input
              type="color"
              aria-label="Custom particle color"
              value={customColor}
              onChange={(event) => {
                setCustomColor(event.target.value)
                setHue(hueFromHex(event.target.value))
              }}
            />
          </label>
        </div>
      </section>
    </main>
  )
}
