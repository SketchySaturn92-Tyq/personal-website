import { useState, useCallback, useEffect } from 'react'
import './LineSidebar.css'

const DEFAULT_ITEMS = [
  'Overview',
  'Components',
  'Animations',
  'Backgrounds',
  'Showcase',
  'Playground',
  'Templates',
  'Changelog',
  'Community',
  'Resources',
  'Documentation',
  'Support',
]

const LineSidebar = ({
  items = DEFAULT_ITEMS,
  accentColor = '#A855F7',
  textColor = '#c4c4c4',
  markerColor = '#6c6c6c',
  showIndex = true,
  showMarker = true,
  maxShift = 30,
  markerLength = 60,
  markerGap = 0,
  tickScale = 0.5,
  scaleTick = true,
  itemGap = 20,
  fontSize = 1.1,
  smoothing = 100,
  defaultActive = null,
  onItemClick,
  className = '',
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultActive)

  const handleClick = useCallback(
    (index, label) => {
      setActiveIndex(index)
      onItemClick?.(index, label)
    },
    [onItemClick],
  )

  useEffect(() => {
    setActiveIndex(defaultActive)
  }, [defaultActive])

  return (
    <nav
      className={`line-sidebar${showMarker ? ' line-sidebar--markers' : ''}${scaleTick ? ' line-sidebar--scale-tick' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--accent-color': accentColor,
        '--text-color': textColor,
        '--marker-color': markerColor,
        '--marker-length': `${markerLength}px`,
        '--marker-gap': `${markerGap}px`,
        '--tick-scale': tickScale,
        '--max-shift': `${maxShift}px`,
        '--item-gap': `${itemGap}px`,
        '--font-size': `${fontSize}rem`,
        '--smoothing': `${smoothing}ms`,
      }}
    >
      <ul className="line-sidebar__list">
        {items.map((label, index) => (
          <li
            key={`${label}-${index}`}
            className={`line-sidebar__item line-sidebar__item--${
              activeIndex === index ? 'current' : activeIndex != null && index < activeIndex ? 'complete' : 'pending'
            }`}
            aria-current={activeIndex === index ? 'true' : undefined}
            data-sidebar-index={index}
            data-sidebar-state={
              activeIndex === index ? 'current' : activeIndex != null && index < activeIndex ? 'complete' : 'pending'
            }
          >
            <button type="button" className="line-sidebar__button" onClick={() => handleClick(index, label)}>
              {showMarker && <span className="line-sidebar__marker" aria-hidden="true" />}
              <span className="line-sidebar__label">
                {showIndex && <span className="line-sidebar__index">{String(index + 1).padStart(2, '0')}</span>}
                <span className="line-sidebar__text">{label}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default LineSidebar
