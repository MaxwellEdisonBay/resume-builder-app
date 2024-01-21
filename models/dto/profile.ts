import { Profile as IProfile } from "@models/domain/Profile";
import { Schema, model, models } from "mongoose";

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
        type: String,
        required: [true, "User ID is required!"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    linkedinUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    portfolioUrl: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const Profile = models.Profile || model<IProfile>("Profile", ProfileSchema);

export default Profile;
