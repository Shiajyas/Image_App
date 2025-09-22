  import { IImageRepository } from "../../application/interfaces/repositories/IImageRepository";
  import { Image } from "../../domain/entities/Image";
  import ImageModel from "../database/models/image.model";

  export class ImageRepository implements IImageRepository {
    // Create new image record
  async create(image: Image): Promise<Image> {
    try {
      // ✅ Increment order of all existing images to push them down
      await ImageModel.updateMany({ ownerId: image.ownerId }, { $inc: { order: 1 } });

      // ✅ New image gets order = 1 (top)
      const created = await ImageModel.create({
        title: image.title,
        url: image.url,
        order: 1,
        ownerId: image.ownerId,
      });

      image.id = created._id.toString();
      image.order = 1;

      return image;
    } catch (error) {
      console.error("ImageRepository.create() error:", error);
      throw new Error("Failed to create image.");
    }
  }

    // Get all images for a specific user, sorted by 'order'
  async findByUser(userId: string, skip = 0, limit = 12): Promise<Image[]> {
      try {
        const images = await ImageModel.find({ ownerId: userId })
          .sort({ order: 1 }) // or createdAt if you prefer
          .skip(skip)
          .limit(limit)
          .lean();

          // console.log(images,"images");
        return images.map(
          (img) =>
            new Image(
              img._id.toString(),
              img.title,
              img.url,
              img.order,
              img.ownerId.toString()
            )
        );
      } catch (error) {
        console.error("ImageRepository.findByUser() error:", error);
        throw new Error("Failed to fetch user images.");
      }
    }

    async countByUser(userId: string): Promise<number> {
      try {
        return await ImageModel.countDocuments({ ownerId: userId });
      } catch (error) {
        console.error("ImageRepository.countByUser() error:", error);
        throw new Error("Failed to count user images.");
      }
    }

    // Update image details
  async update(id: string, title: string, file?: string): Promise<Image | null> {
    console.log(file,"file");
    try {
      // Prepare the update object
      const updateData: any = { title };
      if (file) {
        updateData.url = file// depending on multer storage (S3 or local)
      }

      // Update the document
      const updated = await ImageModel.findByIdAndUpdate(id, { $set: updateData }, { new: true });

      console.log("Updated Image:", updated);

      if (!updated) return null;

      return new Image(
        updated._id.toString(),
        updated.title,
        updated.url,
        updated.order,
        updated.ownerId.toString()
      );
    } catch (error) {
      console.error("ImageRepository.update() error:", error);
      throw new Error("Failed to update image.");
    }
  }



    // Delete an image
  async delete(id: string): Promise<boolean> {
    try {
      await ImageModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error("ImageRepository.delete() error:", error);
      throw new Error("Failed to delete image.");
    }
  }

    // Reorder images
  async reorder(
    userId: string,
    images: { id: string; order: number }[]
  ): Promise<void> {
    try {
      // console.log(images,"images");
      const bulkOps = images.map((img) => ({
        updateOne: {
          filter: { _id: img.id, ownerId: userId },
          update: { $set: { order: img.order } }, // ✅ safer to use $set
        },
      }));

      if (bulkOps.length > 0) {
        await ImageModel.bulkWrite(bulkOps);
      }
    } catch (error) {
      console.error("ImageRepository.reorder() error:", error);
      throw new Error("Failed to reorder images.");
    }
  }


  }
