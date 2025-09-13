"use client"

import { useEffect, useRef } from "react"

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  pulsePhase: number
}

export function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize orbs
    const orbCount = 8
    orbsRef.current = Array.from({ length: orbCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 60 + 20,
      opacity: Math.random() * 0.3 + 0.1,
      hue: Math.random() * 60 + 260, // Purple to blue range
      pulsePhase: Math.random() * Math.PI * 2,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      orbsRef.current.forEach((orb, index) => {
        // Update position
        orb.x += orb.vx
        orb.y += orb.vy

        // Wrap around edges
        if (orb.x < -orb.size) orb.x = canvas.width + orb.size
        if (orb.x > canvas.width + orb.size) orb.x = -orb.size
        if (orb.y < -orb.size) orb.y = canvas.height + orb.size
        if (orb.y > canvas.height + orb.size) orb.y = -orb.size

        // Update pulse phase
        orb.pulsePhase += 0.02

        // Pulsing size and opacity
        const pulseMultiplier = 0.8 + Math.sin(orb.pulsePhase) * 0.2
        const currentSize = orb.size * pulseMultiplier
        const currentOpacity = orb.opacity * (0.5 + Math.sin(orb.pulsePhase * 0.7) * 0.3)

        // Create gradient
        const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentSize)
        gradient.addColorStop(0, `hsla(${orb.hue}, 70%, 60%, ${currentOpacity})`)
        gradient.addColorStop(0.4, `hsla(${orb.hue}, 70%, 50%, ${currentOpacity * 0.6})`)
        gradient.addColorStop(1, `hsla(${orb.hue}, 70%, 40%, 0)`)

        // Draw orb
        ctx.beginPath()
        ctx.arc(orb.x, orb.y, currentSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Add inner glow
        const innerGradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, currentSize * 0.3)
        innerGradient.addColorStop(0, `hsla(${orb.hue + 20}, 80%, 80%, ${currentOpacity * 0.8})`)
        innerGradient.addColorStop(1, `hsla(${orb.hue + 20}, 80%, 70%, 0)`)

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, currentSize * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = innerGradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
