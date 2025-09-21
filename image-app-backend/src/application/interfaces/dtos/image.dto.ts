export interface UploadImageDTO {
  ownerId: string;
  title: string;
  file?: Express.Multer.File;
  
}

export interface EditImageDTO {
  id: string;
  title?: string;
  file?: string
}

export interface ReorderImagesDTO {
  userId: string;
  images: { id: string; order: number }[];
}
