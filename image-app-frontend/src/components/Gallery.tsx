import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ImageItem {
  id: string;
  url: string;
  title: string;
}

interface GalleryProps {
  images: ImageItem[];
  onDelete: (id: string) => void;
  onEdit: (img: {
    url: string | undefined; id: string; title: string 
}) => void;
  onReorder: (newOrder: { id: string; order: number }[]) => void;
}

const SortableItem = React.memo(function SortableItem({
  id,
  url,
  title,
  onDelete,
  onEdit,
  onClick,
}: ImageItem & { onDelete: any; onEdit: any; onClick: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white dark:bg-gray-800 p-2 rounded shadow"
    >
      {/* Image (fullscreen trigger) */}
      <img
        src={url}
        alt={title}
        className="rounded w-full h-32 object-cover mb-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClick({ id, url, title }); // ✅ opens fullscreen
        }}
      />

      {/* Drag handle */}
      <div
        className="cursor-move text-gray-400 text-xs text-center mb-1"
        {...listeners}
      >
        ⇅ drag
      </div>

      <p className="font-semibold text-sm truncate">{title}</p>

      <div className="flex justify-between mt-2 text-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit({ id, title });
          }}
          className="bg-yellow-500 px-2 py-1 rounded text-white"
        >
          Edit
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this image?")) {
              onDelete(id);
            }
          }}
          className="bg-red-500 px-2 py-1 rounded text-white"
        >
          Delete
        </button>
      </div>
    </div>
  );
});

// 🔹 Main Gallery Component
export default function Gallery({
  images,
  onDelete,
  onEdit,
  onReorder,
}: GalleryProps) {
  const [localImages, setLocalImages] = useState<ImageItem[]>(images);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);

  // Keep local state in sync with parent
  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    const oldIndex = localImages.findIndex((i) => i.id === active.id);
    const newIndex = localImages.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(localImages, oldIndex, newIndex);

    setLocalImages(
      reordered.map((img, index) => ({ ...img, order: index + 1 }))
    );
    onReorder(
      reordered.map((img, index) => ({ id: img.id, order: index + 1 }))
    );
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(e) => setActiveId(e.active.id as string)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext items={localImages} strategy={rectSortingStrategy}>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {localImages.map((img) => (
              <SortableItem
                key={img.id}
                id={img.id}
                url={img.url}
                title={img.title}
                onDelete={onDelete}
                onEdit={onEdit}
                onClick={setPreviewImage}
              />
            ))}
          </div>
        </SortableContext>

        {/* DragOverlay */}
        <DragOverlay>
          {activeId ? (
            <div className="bg-white dark:bg-gray-800 p-2 rounded shadow cursor-grabbing opacity-80">
              {(() => {
                const item = localImages.find((i) => i.id === activeId);
                if (!item) return null;
                return (
                  <>
                    <img
                      src={item.url}
                      alt={item.title}
                      className="rounded w-full h-32 object-cover mb-2"
                    />
                    <p className="font-semibold text-sm truncate">
                      {item.title}
                    </p>
                  </>
                );
              })()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 🔹 Fullscreen Modal */}
{previewImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
    onClick={() => setPreviewImage(null)} // close when clicking backdrop
  >
    <div
      className="relative w-full h-full flex flex-col items-center justify-center"
      onClick={(e) => e.stopPropagation()} // prevent modal close on click
    >
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
        onClick={() => setPreviewImage(null)}
      >
        ✕
      </button>

      {/* Fullscreen Image */}
      <img
        src={previewImage.url}
        alt={previewImage.title}
        className="max-h-[95vh] max-w-[95vw] object-contain rounded-lg"
      />

      {/* Caption */}
      <p className="text-center text-white mt-4 text-lg">
        {previewImage.title}
      </p>
    </div>
  </div>
)}


    </>
  );
}
