import { nanoid } from "nanoid";
import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    sourceUrl: {
      type: String,
      required: true,
    },
    destinationUrl: {
      type: String,
      required: true,
    },
    customId: {
      type: String,
      required: true,
      default: () => nanoid(6),
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);
export default Url;
