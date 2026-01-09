import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Card({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card">
      {card.labels && card.labels.length > 0 && (
        <div className="card-labels">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="card-label"
              style={{ backgroundColor: label.color }}
            >
              {label.text}
            </span>
          ))}
        </div>
      )}

      <div className="card-title">{card.title}</div>

      {card.description && (
        <div className="card-description">{card.description}</div>
      )}

      {card.assignee && (
        <div className="card-footer">
          <div className="card-avatar" title={card.assignee.name}>
            {card.assignee.initials}
          </div>
        </div>
      )}
    </div>
  );
}
