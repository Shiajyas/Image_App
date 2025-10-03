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
import { MoreHorizontal } from "lucide-react";

interface ImageItem {
  id: string;
  url: string;
  title: string;
  createdAt?: string;
}

interface GalleryProps {
  images: ImageItem[];
  onDelete: (id: string) => void;
  onEdit: (img: { id: string; title: string; url?: string }) => void;
  onReorder: (newOrder: { id: string; order: number }[]) => void;
}

const SortableItem = React.memo(function SortableItem({
  id,
  url,
  title,
  createdAt,
  onDelete,
  onEdit,
  onClick,
}: ImageItem & { onDelete: any; onEdit: any; onClick: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [menuOpen, setMenuOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white dark:bg-gray-800 p-2 rounded shadow relative"
    >
      {/* Image preview */}
      <img
        src={url}
        alt={title}
        className="rounded w-full h-32 object-cover mb-2 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClick({ id, url, title });
        }}
      />

      {/* Drag handle */}
      <div
        className="cursor-move text-gray-400 text-xs text-center mb-1"
        {...listeners}
      >
        ⇅ drag
      </div>

      {/* Title */}
      <p className="font-semibold text-sm truncate">{title}</p>

      {/* Date & Time */}
      {createdAt && (
        <p className="text-xs text-gray-500 mt-1">
        UploadedAt :  {new Date(createdAt).toLocaleString()}
        </p>
      )}

      {/* 3-dot menu */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1 w-24 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                onEdit({ id, title, url });
              }}
              className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
                if (window.confirm("Are you sure you want to delete this image?")) {
                  onDelete(id);
                }
              }}
              className="block w-full text-left px-3 py-1 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Delete
            </button>
          </div>
        )}
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

  // Sync local state with parent
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
                createdAt={img.createdAt}
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
                    <p className="font-semibold text-sm truncate">{item.title}</p>
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
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>

            <img
              src={previewImage.url}
              alt={previewImage.title}
              className="max-h-[95vh] max-w-[95vw] object-contain rounded-lg"
            />

            <p className="text-center text-white mt-4 text-lg">
              {previewImage.title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
