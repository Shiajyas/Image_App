import { inject, injectable } from "tsyringe";
import { IImageRepository } from "../../interfaces/repositories/IImageRepository";
import { EditImageDTO } from "../../interfaces/dtos/image.dto";
import { ImageMapper } from "../../mappers/image.mapper";

@injectable()
export class EditImageUseCase {
  constructor(
    @inject("ImageRepository") private imageRepo: IImageRepository
  ) {}

  async execute(dto: EditImageDTO) {
    console.log("EditImageUseCase execute", dto.url); 
    if (!dto.title) {
      throw new Error("Title is required");
    }

    const partialEntity = ImageMapper.fromEditDTO(dto, dto?.url);

    const updated = await this.imageRepo.update(
      partialEntity.id!,
      partialEntity.title!,
      dto.url // repo expects file object for upload
    );

    if (!updated) throw new Error("Image not found or update failed");

    return ImageMapper.toResponse(updated);
  }
}
