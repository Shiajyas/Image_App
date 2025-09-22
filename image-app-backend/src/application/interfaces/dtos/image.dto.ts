export interface UploadImageDTO {
  ownerId: string;
  title: string;
  file?: Express.Multer.File;
  
}

export interface EditImageDTO {
  url: string | undefined;
  id: string;
  title?: string;
  file?: string
}

export interface ReorderImagesDTO {
  userId: string;
  images: { id: string; order: number }[];
}
