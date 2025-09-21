import api from "../api/axios";

export const ImageService = {
  upload: (data: FormData) => api.post("/images/upload", data),

  // Pagination support
  getAll: (userId: string, page = 1, limit = 12) =>
    api.get("/images", { params: { userId, page, limit } }),

  // Unified update: either title or file or both
  update: (data: { id: string; title: string; file?: File }) => {
    console.log(data, "data");
    if (data.file) {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("title", data.title);
      formData.append("image", data.file);
      return api.put("/images/change-title", formData);
    } else {
      return api.put("/images/change-title", { id: data.id, title: data.title });
    }
  },

  delete: (id: string) => api.delete(`/images/delete-image/${id}`),

  reorder: (images: { id: string; order: number }[]) =>
    api.post("/images/reorder", { images }),
};
