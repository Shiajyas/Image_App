import { Image } from "../../domain/entities/Image";
import {
  UploadImageDTO,
  EditImageDTO,
  ReorderImagesDTO,
} from "../interfaces/dtos/image.dto";

export class ImageMapper {
  // Domain -> Response DTO
  static toResponse(image: Image) {
    return {
      id: image.id,
      ownerId: image.ownerId,
      title: image.title,
      url: image.url,
      order: image.order,
    };
  }

  // Upload DTO -> Domain
  static fromUploadDTO(dto: UploadImageDTO, fileUrl: string): Image {
    return new Image(
      "", // id will be set by DB
      dto.title,
      fileUrl, // resolved by FileStorageService
      0,
      dto.ownerId
    );
  }

  // Edit DTO -> Partial domain
  static fromEditDTO(dto: EditImageDTO, fileUrl?: string): Partial<Image> {
    return {
      id: dto.id,
      title: dto.title,
      url: fileUrl,
    };

  }

  // Reorder DTO -> array of Partial domains
// Reorder DTO -> userId + array of partial domains
static fromReorderDTO(dto: ReorderImagesDTO): {
  userId: string;
  images: Partial<Image>[];
} {
  return {
    userId: dto.userId,
    images: dto.images.map(
      (img) =>
        ({
          id: img.id,
          order: img.order,
        } as Partial<Image>)
    ),
  };
}

}
