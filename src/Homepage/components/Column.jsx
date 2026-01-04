/* Column.jsx */
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card from './Card';

export default function Column({ column }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="column" ref={setNodeRef}>
      <div className="column-header">
        <span className="column-title">{column.title}</span>
        <span className="column-count">{column.cards.length}</span>
      </div>

      <SortableContext 
        id={column.id} 
        items={column.cards.map(c => c.id)} 
        strategy={verticalListSortingStrategy}
      >
      <div className="column-body">
        {column.cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
      </SortableContext>

      <div className="column-footer">
        <button className="add-card-btn">+ Add a card</button>
      </div>
    </div>
  );
}
