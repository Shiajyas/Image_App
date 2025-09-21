import { useEffect, useState } from "react";
import { useImageStore } from "../store/imageStore";
import { ImageService } from "../services/imageService";
import toast from "react-hot-toast";
import Gallery from "../components/Gallery";
import EditModal from "../components/EditModal";
import { useUserStore } from "../store/userStore";

export default function Dashboard() {
  const { images, setImages, removeImage } = useImageStore();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id: string; title: string; url?: string } | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const user = useUserStore();
  const userId = user?.auth?.user?.id;

  const fetchImages = async (pageNum = 1, append = false) => {
    try {
      const res = await ImageService.getAll(userId!, pageNum, 8);
      const data = res.data.images;

      setImages((prev: any) => {
        const combined = append ? [...prev, ...data] : data;
        const unique = Array.from(new Map(combined.map((img: any) => [img.id, img])).values());
        return unique;
      });

      setHasMore(data.length === 8);
    } catch {
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (userId) fetchImages(1);
  }, [userId]);

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchImages(nextPage, true);
  };

  const handleDelete = async (id: string) => {
    removeImage(id);
    toast.success("Deleted");
    try {
      await ImageService.delete(id);
    } catch {}
  };

  const handleEdit = async (data: { id: string; title: string; file?: File }) => {
    if (!data.title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      const res = await ImageService.update(data);
      setImages((prev) =>
        prev.map((img) => (img.id === data.id ? res.data : img))
      );
      setEditing(null);
      toast.success("Updated successfully!");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleReorder = async (newOrder: { id: string; order: number }[]) => {
    try {
      setImages((prev) =>
        newOrder.map((ord) => prev.find((img) => img.id === ord.id)!)
      );

      await ImageService.reorder(newOrder);
      toast.success("Reordered");
    } catch {
      toast.error("Reorder failed");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-80">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Gallery
        images={images}
        onDelete={handleDelete}
        onEdit={(img) => setEditing({ id: img.id, title: img.title, url: img.url })}
        onReorder={handleReorder}
      />

      {hasMore ? (
        <div className="flex justify-center py-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      ) : (
        <div className="flex justify-center py-4 text-gray-400">No more images</div>
      )}

      {editing && (
        <EditModal
          editing={editing}
          setEditing={setEditing}
          onClose={() => setEditing(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
}
