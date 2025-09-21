import { Image } from "../../../domain/entities/Image";

export interface IImageRepository {
  create(data: Partial<Image>): Promise<Image>;

  // 🔹 Updated to support pagination
  findByUser(ownerId: string, skip?: number, limit?: number): Promise<Image[]>;

  // 🔹 New method for total count (for pagination)
  countByUser(ownerId: string): Promise<number>;

  update(id: string, tiltle: string,   url?: string): Promise<Image | null>;
  delete(id: string): Promise<boolean>;
  reorder(userId: string, images: { id: string; order: number }[]): Promise<void>;
}
