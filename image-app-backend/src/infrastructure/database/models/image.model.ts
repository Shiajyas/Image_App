import { Schema, model } from "mongoose";

const ImageSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, default: 0 },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default model("Image", ImageSchema);
