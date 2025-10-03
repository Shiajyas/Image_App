import { useState, useEffect } from "react";

interface EditModalProps {
  editing: { id: string; title: string; url?: string };
  onClose: () => void;
  onSave: (data: { id: string; title: string; file?: File }) => Promise<void>;
  setEditing: React.Dispatch<
    React.SetStateAction<{ id: string; title: string; url?: string } | null>
  >;
}

export default function EditModal({ editing, onClose, onSave, setEditing }: EditModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(editing.url || null);
  const [loading, setLoading] = useState(false); // new loading state

  useEffect(() => {
    setPreview(editing.url || null);
  }, [editing.url]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    if (!editing.title.trim()) {
      alert("Title cannot be empty");
      return;
    }

    setLoading(true); // start loading
    try {
      await onSave({ id: editing.id, title: editing.title, file: file || undefined });
      onClose(); // close modal after successful save
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h3 className="font-bold mb-4">Edit Image</h3>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full h-40 object-cover rounded mb-4"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-600 dark:text-gray-300"
          disabled={loading} // disable file input while saving
        />

        <input
          type="text"
          value={editing.title}
          onChange={(e) =>
            setEditing((prev) => (prev ? { ...prev, title: e.target.value } : null))
          }
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          placeholder="Enter title"
          disabled={loading} // disable text input while saving
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-500 text-white rounded"
            disabled={loading} // disable cancel while saving
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`px-3 py-1 bg-green-600 text-white rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading} // disable save while saving
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
