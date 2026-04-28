import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

let _idSeq = 0;
function newId() {
  return `h-${++_idSeq}-${Date.now()}`;
}

export default function Step3Outline({ outline, onChange }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIdx = outline.findIndex((i) => i.id === active.id);
    const newIdx = outline.findIndex((i) => i.id === over.id);
    onChange(arrayMove(outline, oldIdx, newIdx));
  }

  function addItem(level) {
    onChange([...outline, { id: newId(), level, text: '' }]);
  }

  function removeItem(id) {
    onChange(outline.filter((i) => i.id !== id));
  }

  function updateText(id, text) {
    onChange(outline.map((i) => (i.id === id ? { ...i, text } : i)));
  }

  const activeItem = outline.find((i) => i.id === activeId);

  return (
    <section className="card-paper" style={{ padding: 28, marginBottom: 18 }}>
      <h2 style={{ fontSize: '1.4rem', marginBottom: 6 }}>Estructura del artículo</h2>
      <p style={{ color: 'var(--color-foreground-muted)', fontSize: 14, marginBottom: 24 }}>
        Define los H2 (secciones principales) y opcionalmente los H3 (subsecciones). El cuerpo lo escribirás luego en el editor MDX.
      </p>

      <div
        style={{
          padding: '14px 18px',
          borderRadius: 10,
          border: '1.5px solid var(--color-info)',
          background: 'color-mix(in oklab, var(--color-info) 8%, var(--color-paper))',
          fontSize: 13,
          marginBottom: 20,
        }}
      >
        <strong style={{ color: 'var(--color-handwritten)' }}>Recomendado:</strong> 5-8 H2 para un artículo de 1500-2000 palabras. La sección de FAQ va siempre al final como H2 con preguntas como H3.
      </div>

      {outline.length === 0 && (
        <p
          style={{
            textAlign: 'center',
            color: 'var(--color-foreground-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            padding: '24px 0',
          }}
        >
          Añade al menos 3 encabezados para continuar
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={outline.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {outline.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                onTextChange={(text) => updateText(item.id, text)}
                onRemove={() => removeItem(item.id)}
                isDragging={activeId === item.id}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem ? (
            <OutlineRow item={activeItem} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button
          type="button"
          onClick={() => addItem(2)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: '1.5px dashed var(--color-border-strong)',
            background: 'transparent',
            color: 'var(--color-foreground-muted)',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-alt)';
            e.currentTarget.style.color = 'var(--color-foreground)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-foreground-muted)';
          }}
        >
          + Añadir H2
        </button>
        <button
          type="button"
          onClick={() => addItem(3)}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: '1.5px dashed var(--color-border-strong)',
            background: 'transparent',
            color: 'var(--color-foreground-muted)',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-alt)';
            e.currentTarget.style.color = 'var(--color-foreground)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-foreground-muted)';
          }}
        >
          + Añadir H3
        </button>
      </div>

      <span
        style={{
          fontFamily: 'var(--font-hand)',
          color: 'var(--color-handwritten)',
          fontSize: 18,
          fontWeight: 600,
          transform: 'rotate(-1.5deg)',
          display: 'inline-block',
          marginTop: 8,
        }}
      >
        arrastra para reordenar →
      </span>
    </section>
  );
}

function SortableItem({ item, onTextChange, onRemove, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <OutlineRow
        item={item}
        onTextChange={onTextChange}
        onRemove={onRemove}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

function OutlineRow({ item, onTextChange, onRemove, dragHandleProps, isOverlay }) {
  const isH3 = item.level === 3;

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: 10,
        background: isOverlay ? 'var(--color-surface-alt)' : 'var(--color-paper)',
        border: `1px solid ${isOverlay ? 'var(--color-border-strong)' : 'var(--color-border)'}`,
        borderRadius: 10,
        marginLeft: isH3 ? 32 : 0,
        boxShadow: isOverlay ? '0 8px 24px rgba(26,31,44,.15)' : 'none',
      }}
    >
      {/* Drag handle — aria oculto porque @dnd-kit ya gestiona el teclado */}
      {dragHandleProps && (
        <button
          type="button"
          {...dragHandleProps}
          aria-label="Arrastrar para reordenar"
          style={{
            width: 28,
            height: 28,
            display: 'grid',
            placeItems: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'grab',
            color: 'var(--color-border-strong)',
            borderRadius: 6,
            flexShrink: 0,
            touchAction: 'none',
          }}
        >
          <GripVertical size={14} />
        </button>
      )}

      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          padding: '4px 8px',
          borderRadius: 6,
          flexShrink: 0,
          minWidth: 36,
          textAlign: 'center',
          fontWeight: 700,
          ...(isH3
            ? {
                background: 'var(--color-border-strong)',
                color: 'var(--color-on-brand)',
                paddingLeft: 14,
              }
            : {
                background: 'var(--color-handwritten)',
                color: 'var(--color-background)',
              }),
        }}
      >
        {isH3 ? 'H3' : 'H2'}
      </span>

      <input
        className="outline-input"
        type="text"
        value={item.text}
        onChange={(e) => onTextChange?.(e.target.value)}
        placeholder={isH3 ? 'Subsección…' : 'Sección principal…'}
        style={{
          flex: 1,
          minHeight: 36,
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          background: 'var(--color-paper)',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--color-foreground)',
        }}
      />

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Eliminar"
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: 'transparent',
            border: '1px solid var(--color-border)',
            color: 'var(--color-foreground-muted)',
            cursor: 'pointer',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'color-mix(in oklab, var(--color-energy) 12%, transparent)';
            e.currentTarget.style.color = 'var(--color-energy)';
            e.currentTarget.style.borderColor = 'var(--color-energy)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--color-foreground-muted)';
            e.currentTarget.style.borderColor = 'var(--color-border)';
          }}
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}
