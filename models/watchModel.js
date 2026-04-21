import mongoose from "mongoose";

const watchSchema = mongoose.connect(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    longDescription: {
      type: String,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
    },
    images: [{ type: String }],
  },
  {
    timestamps: true,
  },
);

const WatchModel = mongoose.model('WatchModel',watchSchema);

export default WatchModel;