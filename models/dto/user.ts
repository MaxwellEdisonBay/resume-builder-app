import { IUser } from "@models/domain/IUser";
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: [true, "Email already exists!"],
  },
  username: {
    type: String,
    required: [true, "Username is required!"],
    match: [
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
    ],
  },
  image: {
    type: String
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  displayEmail: {
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
});

const User = models.User || model<IUser>("User", UserSchema)

export default User