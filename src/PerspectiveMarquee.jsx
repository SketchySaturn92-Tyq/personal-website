import { useEffect, useRef } from 'react'

const DEFAULT_ITEMS = ['Software', 'AI', 'Gaming', 'Research', 'Design']

function PerspectiveMarquee({
  items = DEFAULT_ITEMS,
  className = '',
  duration = 18,
  rotateY = -24,
  rotateX = 8,
}) {
  const trackRef = useRef(null)
  const groupRef = useRef(null)
  const itemGroups = [items, items]

  useEffect(() => {
    const track = trackRef.current
    const group = groupRef.current
    if (!track || !group) return undefined

    let groupWidth = group.offsetWidth
    let animationFrame = 0
    let startTime = performance.now()

    const updateWidth = () => {
      groupWidth = group.offsetWidth
    }

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(group)

    const animate = (time) => {
      if (groupWidth > 0) {
        const progress = ((time - startTime) / 1000 / duration) % 1
        const offset = progress * groupWidth
        track.style.transform = `translate3d(${-offset}px, 0, 0)`
      } else {
        startTime = time
      }

      animationFrame = window.requestAnimationFrame(animate)
    }

    animationFrame = window.requestAnimationFrame(animate)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
    }
  }, [duration, items])

  return (
    <div
      className={`perspective-marquee ${className}`}
      style={{
        '--marquee-duration': `${duration}s`,
        '--marquee-rotate-y': `${rotateY}deg`,
        '--marquee-rotate-x': `${rotateX}deg`,
      }}
      aria-label={items.join(', ')}
    >
      <div className="perspective-marquee-stage">
        <div className="perspective-marquee-track" ref={trackRef}>
          {itemGroups.map((group, groupIndex) => (
            <div
              className="perspective-marquee-group"
              aria-hidden={groupIndex > 0}
              key={`group-${groupIndex}`}
              ref={groupIndex === 0 ? groupRef : null}
            >
              {group.map((item, itemIndex) => (
                <span data-marquee-index={itemIndex} key={`${item}-${groupIndex}`}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PerspectiveMarquee
