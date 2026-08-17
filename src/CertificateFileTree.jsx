import { useState } from 'react'
import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react'
import './CertificateFileTree.css'

export default function CertificateFileTree({ groups, ariaLabel, onItemSelect }) {
  const [expandedIds, setExpandedIds] = useState(() => new Set())

  const toggleGroup = (groupId) => {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  return (
    <div className="certificate-tree" role="tree" aria-label={ariaLabel}>
      {groups.map((group) => {
        const isExpanded = expandedIds.has(group.id)

        return (
          <div className={`certificate-tree__group certificate-tree__group--${group.id}`} key={group.id}>
            <button
              className="certificate-tree__group-trigger"
              type="button"
              role="treeitem"
              aria-expanded={isExpanded}
              onClick={() => toggleGroup(group.id)}
            >
              <ChevronRight className="certificate-tree__chevron" size={16} aria-hidden="true" />
              {isExpanded ? <FolderOpen size={18} aria-hidden="true" /> : <Folder size={18} aria-hidden="true" />}
              <span>{group.label}</span>
              <small>{group.countLabel}</small>
            </button>

            <div className={`certificate-tree__branch${isExpanded ? ' is-expanded' : ''}`}>
              <div className="certificate-tree__branch-inner" role="group">
                {group.cards.map((card, index) => (
                  <button
                    className="certificate-tree__file"
                    type="button"
                    role="treeitem"
                    key={card.id}
                    onClick={(event) => onItemSelect(card, event.currentTarget)}
                  >
                    <span
                      className={`certificate-tree__connector${index === group.cards.length - 1 ? ' is-last' : ''}`}
                      aria-hidden="true"
                    />
                    <File size={15} aria-hidden="true" />
                    <span className="certificate-tree__file-name">{card.title}</span>
                    <span className="certificate-tree__file-meta">{card.year}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
