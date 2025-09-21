import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";
import { useUserStore } from "../store/userStore";
import { ImageService } from "../services/imageService";

export default function UploadSection() {
  const [files, setFiles] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [errors, setErrors] = useState<boolean[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const user = useUserStore();

  const currentUserId = user?.auth?.user?.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...fileArray]);
      setTitles((prev) => [...prev, ...fileArray.map(() => "")]);
      setErrors((prev) => [...prev, ...fileArray.map(() => false)]);
    }
  };

  const handleTitleChange = (index: number, value: string) => {
    const newTitles = [...titles];
    newTitles[index] = value;
    setTitles(newTitles);

    const newErrors = [...errors];
    newErrors[index] = value.trim() === "";
    setErrors(newErrors);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newTitles = [...titles];
    const newErrors = [...errors];
    newFiles.splice(index, 1);
    newTitles.splice(index, 1);
    newErrors.splice(index, 1);
    setFiles(newFiles);
    setTitles(newTitles);
    setErrors(newErrors);
  };

  const handleUpload = async () => {
    if (!files.length) {
      toast.error("No images selected");
      return;
    }

    const invalidIndexes = titles.map((t) => t.trim() === "");
    if (invalidIndexes.includes(true)) {
      setErrors(invalidIndexes);
      toast.error("Please provide a title for all images");
      return;
    }

    const formData = new FormData();

    files.forEach((file, idx) => {
      formData.append("images", file);
      formData.append("titles[]", titles[idx]);
    });

    if (currentUserId) {
      formData.append("ownerId", currentUserId);
    }

    try {
      await ImageService.upload(formData);
      toast.success("Uploaded successfully!");
      setFiles([]);
      setTitles([]);
      setErrors([]);
    } catch (err) {
      toast.error("Upload failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Upload Images</h3>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
          >
            <Plus size={16} /> Add Images
          </button>
        </div>

        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {files.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="relative border rounded p-2 bg-gray-50 dark:bg-gray-700"
              >
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={14} />
                </button>

                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-32 object-cover rounded mb-2"
                />

                <input
                  type="text"
                  placeholder="Enter title"
                  value={titles[idx]}
                  onChange={(e) => handleTitleChange(idx, e.target.value)}
                  className={`w-full p-1 border rounded text-sm dark:bg-gray-600 dark:text-white ${
                    errors[idx] ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors[idx] && (
                  <p className="text-red-500 text-xs mt-1">Title is required</p>
                )}
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && titles.every((t) => t.trim() !== "") && (
          <button
            onClick={handleUpload}
            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
          >
            Upload {files.length} Image{files.length > 1 ? "s" : ""}
          </button>
        )}
      </div>
    </div>
  );
}
