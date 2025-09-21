import { create } from "zustand";

interface Image {
  id: string;
  title: string;
  url: string;
}

interface ImageStore {
  images: Image[];
  setImages: (images: Image[] | ((prev: Image[]) => Image[])) => void;
  addImage: (img: Image) => void;
  updateImage: (img: Image) => void;
  removeImage: (id: string) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  setImages: (images) =>
    set((state) => ({
      images: typeof images === "function" ? images(state.images) : images,
    })),
  addImage: (img) => set((state) => ({ images: [...state.images, img] })),
  updateImage: (img) =>
    set((state) => ({
      images: state.images.map((i) => (i.id === img.id ? img : i)),
    })),
  removeImage: (id) =>
    set((state) => ({ images: state.images.filter((i) => i.id !== id) })),
}));
