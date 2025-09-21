import { inject, injectable } from "tsyringe";
import { IImageRepository } from "../../interfaces/repositories/IImageRepository";
import { ReorderImagesDTO } from "../../interfaces/dtos/image.dto";
import { ImageMapper } from "../../mappers/image.mapper";

@injectable()
export class ReorderImagesUseCase {
  constructor(
    @inject("ImageRepository") private imageRepo: IImageRepository
  ) {}

async execute(dto: ReorderImagesDTO): Promise<{ success: boolean }> {
  const reorderedEntities = ImageMapper.fromReorderDTO(dto);

  const reorderedImages = reorderedEntities.images.map((image) => ({
    id: image.id,
    order: image.order,
  }));

  await this.imageRepo.reorder(dto.userId, reorderedImages as { id: string; order: number }[]);

  return { success: true };
}
}
