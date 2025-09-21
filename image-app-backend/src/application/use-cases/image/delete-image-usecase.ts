import { inject, injectable } from "tsyringe";
import { IImageRepository } from "../../interfaces/repositories/IImageRepository";

@injectable()
export class DeleteImageUseCase {
  constructor(
    @inject("ImageRepository") private imageRepo: IImageRepository
  ) {}

  async execute(imageId: string): Promise<{ success: boolean; message: string }> {
    const result = await this.imageRepo.delete(imageId);

    if (!result) {
      throw new Error("Failed to delete image");
    }

    return { success: true, message: "Image deleted successfully" };
  }
}
