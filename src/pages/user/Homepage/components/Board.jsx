/* Board.jsx */
import { useState } from "react";
import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import mockData from '../mockData';
import Column from "./Column";

export default function Board() {
  const { board } = mockData;
  const [columns, setColumns] = useState(board.columns);

  // Helper to find which column a card belongs to
  const findColumn = (id) => {
    return columns.find((col) => col.cards.some((card) => card.id === id))?.id || 
           columns.find((col) => col.id === id)?.id;
  };

  // 1. HANDLE DRAGGING OVER (Moving between columns)
  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the containers
    const activeColumnId = findColumn(activeId);
    const overColumnId = findColumn(overId);

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;

    setColumns((prev) => {
      const activeColIndex = prev.findIndex((col) => col.id === activeColumnId);
      const overColIndex = prev.findIndex((col) => col.id === overColumnId);

      const newColumns = [...prev];
      
      // Create new references for the cards arrays to avoid direct mutation issues
      newColumns[activeColIndex] = { ...newColumns[activeColIndex], cards: [...newColumns[activeColIndex].cards] };
      newColumns[overColIndex] = { ...newColumns[overColIndex], cards: [...newColumns[overColIndex].cards] };

      const activeCards = newColumns[activeColIndex].cards;
      const overCards = newColumns[overColIndex].cards;

      const activeIndex = activeCards.findIndex((c) => c.id === activeId);
      const overIndex = overCards.findIndex((c) => c.id === overId);

      let newIndex;
      if (overCards.some((c) => c.id === overId)) {
        newIndex = overIndex >= 0 ? overIndex + (activeId > overId ? 1 : 0) : overCards.length + 1;
      } else {
        newIndex = overCards.length + 1;
      }

      // --- MISSING CODE START ---
      // Remove card from the old column
      const [movedCard] = activeCards.splice(activeIndex, 1);
      
      // Add card to the new column
      overCards.splice(newIndex, 0, movedCard);
      // --- MISSING CODE END ---

      return newColumns;
    });
  };

  // 2. HANDLE DROP (Reordering within the same column)
  // Board.jsx

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over.id;

    if (!over) return;

    const activeColumnId = findColumn(activeId);
    const overColumnId = findColumn(overId);

    if (activeColumnId === overColumnId) {
      const columnIndex = columns.findIndex((col) => col.id === activeColumnId);
      const column = columns[columnIndex];
      
      // 1. Check if we dropped strictly over a CARD (not the column container)
      // If we dropped over the column container, the card is already 
      // in the correct place thanks to handleDragOver, so we skip reordering.
      const isOverColumnContainer = overId === activeColumnId;
      if (isOverColumnContainer) {
          return; 
      }

      // 2. Normal reordering logic (Card vs Card)
      const oldIndex = column.cards.findIndex((c) => c.id === activeId);
      const newIndex = column.cards.findIndex((c) => c.id === overId);

      if (oldIndex !== newIndex) {
        const newCards = arrayMove(column.cards, oldIndex, newIndex);

        setColumns((prev) => {
          const newCols = [...prev];
          newCols[columnIndex] = { ...column, cards: newCards };
          return newCols;
        });
      }
    }
  };

  return (
    <div className="board-wrapper">
      <h1 className="board-title">{board.title}</h1>

      <DndContext
          collisionDetection={closestCorners}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
      <div className="board">
        
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
      </DndContext>
    </div>
  );
}
