import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react'
import './CertificateFileTree.css'

export default function ContentFileTree({ groups, ariaLabel, onPreview, expandedIds, onExpandedChange }) {
  const toggleGroup = (groupId) => {
    const next = new Set(expandedIds)
    if (next.has(groupId)) next.delete(groupId)
    else next.add(groupId)
    onExpandedChange(next)
  }

  return (
    <div className="certificate-tree content-file-tree" role="tree" aria-label={ariaLabel}>
      {groups.map((group) => {
        const isExpanded = expandedIds.has(group.id)

        return (
          <div className="certificate-tree__group certificate-tree__group--content" key={group.id}>
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
                {group.items.map((item, index) => {
                  const content = (
                    <>
                      <span
                        className={`certificate-tree__connector${index === group.items.length - 1 ? ' is-last' : ''}`}
                        aria-hidden="true"
                      />
                      <File size={15} aria-hidden="true" />
                      <span className="certificate-tree__file-name">{item.label}</span>
                      <span className="certificate-tree__file-meta">{item.meta}</span>
                    </>
                  )

                  if (item.preview) {
                    return (
                      <button
                        className="certificate-tree__file"
                        type="button"
                        role="treeitem"
                        key={item.id}
                        onClick={(event) => onPreview(item, event.currentTarget)}
                      >
                        {content}
                      </button>
                    )
                  }

                  return (
                    <a
                      className="certificate-tree__file"
                      role="treeitem"
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                      key={item.id}
                    >
                      {content}
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
