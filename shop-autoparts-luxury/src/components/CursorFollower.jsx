import { useEffect, useRef } from 'react'

function CursorFollower({ label = 'ВЫБЕРИТЕ УЗЕЛ' }) {
  const followerRef = useRef(null)

  useEffect(() => {
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let currentX = mouseX
    let currentY = mouseY
    let animationFrameId

    function handleMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function animate() {
      // Lerp (Linear interpolation for smooth lagging ring)
      currentX += (mouseX - currentX) * 0.15
      currentY += (mouseY - currentY) * 0.15

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div ref={followerRef} className="choeur-cursor-follower" aria-hidden="true">
      <span className="cursor-ring" />
      <span className="cursor-text">{label}</span>
    </div>
  )
}

export default CursorFollower
