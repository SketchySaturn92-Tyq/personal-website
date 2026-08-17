import { useEffect, useState } from 'react'
import './Folder.css'

const darkenColor = (hex, percent) => {
  const normalized = hex.replace('#', '').padEnd(6, '0').slice(0, 6)
  const value = Number.parseInt(normalized, 16)
  const channel = (shift) => Math.max(0, Math.floor(((value >> shift) & 0xff) * (1 - percent)))
  return `#${[channel(16), channel(8), channel(0)].map((item) => item.toString(16).padStart(2, '0')).join('')}`
}

function Folder({
  color = '#5227FF',
  size = 1,
  items = [],
  label,
  countLabel,
  open = false,
  onSelect,
  onItemSelect,
  className = '',
}) {
  const papers = items.slice(0, 4)

  const [paperOffsets, setPaperOffsets] = useState(Array.from({ length: 4 }, () => ({ x: 0, y: 0 })))

  useEffect(() => {
    if (!open) setPaperOffsets(Array.from({ length: 4 }, () => ({ x: 0, y: 0 })))
  }, [open])

  const handlePaperMove = (event, index) => {
    if (!open) return
    const rect = event.currentTarget.getBoundingClientRect()
    const offset = {
      x: (event.clientX - (rect.left + rect.width / 2)) * 0.09,
      y: (event.clientY - (rect.top + rect.height / 2)) * 0.09,
    }
    setPaperOffsets((current) => current.map((item, itemIndex) => (itemIndex === index ? offset : item)))
  }

  const resetPaper = (index) => {
    setPaperOffsets((current) => current.map((item, itemIndex) => (itemIndex === index ? { x: 0, y: 0 } : item)))
  }

  return (
    <div
      className={`certificate-folder-button${open ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--folder-color': color,
        '--folder-back-color': darkenColor(color, 0.16),
        '--folder-scale': size,
      }}
    >
      <div className="folder-visual">
        <div className={`folder${open ? ' open' : ''}`} data-paper-count={papers.length}>
          <span className="folder__back">
            {papers.map((item, index) => (
              <button
                type="button"
                className={`folder-paper folder-paper-${index + 1}`}
                key={item.id}
                tabIndex={open ? 0 : -1}
                aria-hidden={!open}
                aria-label={item.quickLookLabel || item.title}
                onClick={(event) => {
                  event.stopPropagation()
                  onItemSelect?.(item, event.currentTarget)
                }}
                onMouseMove={(event) => handlePaperMove(event, index)}
                onMouseLeave={() => resetPaper(index)}
                style={{
                  '--magnet-x': `${paperOffsets[index].x}px`,
                  '--magnet-y': `${paperOffsets[index].y}px`,
                }}
              >
                <img src={item.image} alt="" />
              </button>
            ))}
            <span className="folder__front" />
          </span>
        </div>
      </div>
      <span className="folder-caption">
        <strong>{label}</strong>
        <small>{countLabel}</small>
      </span>
      <button
        type="button"
        className="folder-toggle"
        aria-label={`${label} · ${countLabel}`}
        aria-pressed={open}
        onClick={onSelect}
      />
    </div>
  )
}

export default Folder
