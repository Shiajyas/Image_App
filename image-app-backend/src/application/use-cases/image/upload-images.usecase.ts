import { inject, injectable } from "tsyringe";
import { IImageRepository } from "../../interfaces/repositories/IImageRepository";
import { UploadImageDTO } from "../../interfaces/dtos/image.dto";
import { ImageMapper } from "../../mappers/image.mapper";

@injectable()
export class UploadImagesUseCase {
  constructor(
    @inject("ImageRepository") private imageRepo: IImageRepository
  ) {}

  async execute(files: Express.MulterS3.File[], titles: string[], ownerId: string) {
    if (!files || files.length === 0) {
      throw new Error("No files uploaded");
    }

    if (files.length !== titles.length) {
      throw new Error("Mismatch between files and titles count");
    }

    const uploadedImages = await Promise.all(
      files.map((file, index) => {
        const dto: UploadImageDTO = { title: titles[index], ownerId };
        const imageEntity = ImageMapper.fromUploadDTO(dto, file.location);
        return this.imageRepo.create(imageEntity);
      })
    );

    return uploadedImages.map(ImageMapper.toResponse);
  }
}
