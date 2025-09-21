import { inject, injectable } from "tsyringe";
import { IImageRepository } from "../../interfaces/repositories/IImageRepository";
import { ImageMapper } from "../../mappers/image.mapper";

@injectable()
export class GetImagesUseCase {
  constructor(
    @inject("ImageRepository") private imageRepo: IImageRepository
  ) {}

  async execute(ownerId: string, page = 1, limit = 12) {
    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      this.imageRepo.findByUser(ownerId, skip, limit),
      this.imageRepo.countByUser(ownerId),
    ]);

    return {
      images: images.map(ImageMapper.toResponse),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
