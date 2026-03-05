import { useEffect, useRef } from 'react'

export default function EidParticles() {
  const canvasRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    const colors = ['#6A47ED', '#8B6CF7', '#C6F806', '#A78BFA']
    
    class Particle {
      constructor() {
        this.reset()
      }
      
      reset() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + Math.random() * 100
        this.size = Math.random() * 3 + 1
        this.speedY = Math.random() * 0.5 + 0.2
        this.speedX = Math.random() * 0.4 - 0.2
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = Math.random() * 0.5 + 0.2
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
      }
      
      update() {
        this.y -= this.speedY
        this.x += this.speedX
        this.rotation += this.rotationSpeed
        
        if (this.y < -20) {
          this.reset()
        }
      }
      
      draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        
        // Draw crescent shape
        ctx.beginPath()
        ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()
      }
    }
    
    // Create particles
    for (let i = 0; i < 25; i++) {
      const p = new Particle()
      p.y = Math.random() * canvas.height
      particles.push(p)
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.update()
        p.draw()
      })
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}
