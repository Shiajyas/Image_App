import { Router } from "express";
import { ImageController } from "../controllers/image.controller";
import { container } from "../../di/container"; // make sure container is initialized
import { FileStorageService } from "../../infrastructure/services/FileStorageService";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new ImageController();
const fileStorage = container.resolve(FileStorageService); // get multer instance

// Get all images
router.get("/",authMiddleware,  async (req, res) => {
  try {
    await controller.getAll(req, res);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Upload images
router.post(
  "/upload",
  fileStorage.upload.array("images"),authMiddleware, // use multer instance from FileStorageService
  async (req, res) => {
    try {
      await controller.upload(req, res);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  }
);

// Reorder images
router.post("/reorder",authMiddleware, async (req, res) => {
  try {
    await controller.reorder(req as any, res);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

router.put("/change-title",fileStorage.upload.single("image"),authMiddleware,async(req,res)=>{
    try {
        await controller.changeTittle(req,res)
    } catch (err) {
         res.status(500).json({ error: (err as Error).message });
    }
})

router.delete("/delete-image/:id",authMiddleware,async(req,res)=>{
      try {
        await controller.deleteImage(req,res)
    } catch (err) {
         res.status(500).json({ error: (err as Error).message });
    }
})

export default router;
