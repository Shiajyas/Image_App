import { Request, Response } from "express";
import { container } from "../../di/container";
import { UploadImagesUseCase } from "../../application/use-cases/image/upload-images.usecase";
import { ReorderImagesUseCase } from "../../application/use-cases/image/reorder-images.usecase";
import { GetImagesUseCase } from "../../application/use-cases/image/get-images-usecase";
import { EditImageUseCase } from "../../application/use-cases/image/edit-image.usecase";
import { DeleteImageUseCase } from "../../application/use-cases/image/delete-image-usecase";
import { HTTP_STATUS, MESSAGES } from "../../infrastructure/utils/constants";

export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

export class ImageController {
  async upload(req: Request, res: Response) {
    try {
      const files = req.files as Express.MulterS3.File[];
      const titles = req.body.titles as string[];
      const ownerId = req.body.ownerId as string;

      const usecase = container.resolve(UploadImagesUseCase);
      const result = await usecase.execute(files, titles, ownerId);

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: MESSAGES.IMAGE.UPLOAD_SUCCESS,
        data: result,
      });
    } catch (err) {
      console.error("ImageController.upload error:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.SERVER,
        error: err,
      });
    }
  }

  async reorder(req: AuthRequest, res: Response) {
    try {
      const usecase = container.resolve(ReorderImagesUseCase);

      const dto = {
        userId: req.user.id,
        images: req.body.images,
      };

      const result = await usecase.execute(dto);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.IMAGE.REORDER_SUCCESS,
        data: result,
      });
    } catch (err) {
      console.error("ImageController.reorder error:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.SERVER,
        error: err,
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const ownerId = req.query.userId as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;

      const usecase = container.resolve(GetImagesUseCase);
      const result = await usecase.execute(ownerId, page, limit);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.IMAGE.FETCH_SUCCESS,
        data: result,
      });
    } catch (err) {
      console.error("ImageController.getAll error:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.SERVER,
        error: err,
      });
    }
  }

  async changeTittle(req: Request, res: Response) {
    try {
      const file = req.file as Express.MulterS3.File | undefined;
      const usecase = container.resolve(EditImageUseCase);

      const result = await usecase.execute({
        ...req.body,
        url: file?.location,
      });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.IMAGE.UPDATE_SUCCESS,
        data: result,
      });
    } catch (err) {
      console.error("ImageController.changeTittle error:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.ERROR.SERVER,
        error: err,
      });
    }
  }

  async deleteImage(req: Request, res: Response) {
    try {
      const imageId = req.params.id?.toString() || "";
      const usecase = container.resolve(DeleteImageUseCase);
      const result = await usecase.execute(imageId);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: MESSAGES.IMAGE.DELETE_SUCCESS,
        data: result,
      });
    } catch (err) {
      console.error("ImageController.deleteImage error:", err);
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: MESSAGES.IMAGE.DELETE_FAILED,
        error: err,
      });
    }
  }
}
