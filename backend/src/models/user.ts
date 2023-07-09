import mongoose, { Document, Model, Schema } from "mongoose";
import * as bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  phone: string;
  profilePicture: string;
  clientInfo?: {
    firstName: string;
    lastName: string;
  };
  agencyInfo?: {
    agencyName: string;
    country: string;
    city: string;
    street: string;
    registrationNumber: string;
    description: string;
  };
  userType: string;
  resetToken?: {
    token: string;
    expires: number;
  };
  registered: boolean;
  deleted?: boolean;
}

export interface IUserModel extends Model<IUser> {
  getUserById(id: string): Promise<IUser>;
  getUserByUsername(username: string): Promise<IUser>;
  getRegistrationRequest(username: string): Promise<IUser>;
  getUserByEmail(email: string): Promise<IUser>;
  getUserByResetToken(email: string): Promise<IUser>;
  addUser(newUser: IUser): Promise<void>;
  comparePasswords(
    password: string,
    candidatePassword: string
  ): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
    default: "uploads\\default-profile-picture.jpg",
  },
  clientInfo: {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
  },
  agencyInfo: {
    agencyName: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    registrationNumber: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  userType: {
    type: String,
    required: true,
  },
  resetToken: {
    token: {
      type: String,
      required: false,
    },
    expires: {
      type: Number,
      required: false,
    },
  },
  registered: {
    type: Boolean,
    required: true,
  },
  deleted: {
    type: Boolean,
    required: false,
  },
});

UserSchema.statics.getUserById = function (id: string) {
  return this.findById(id);
};

UserSchema.statics.getUserByUsername = async function (username: string) {
  const query = { username: username, registered: true };
  return this.findOne(query);
};

UserSchema.statics.getRegistrationRequest = async function (username: string) {
  const query = { username: username, registered: false };
  return this.findOne(query);
};

UserSchema.statics.getUserByEmail = async function (email: string) {
  const query = { email: email, registered: true };
  return this.findOne(query);
};

UserSchema.statics.getUserByResetToken = async function (token: string) {
  const query = { "resetToken.token": token, registered: true };
  return this.findOne(query);
};

UserSchema.statics.addUser = async function (newUser: IUser) {
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(newUser.password, salt);
  newUser.password = hash;
  await newUser.save();
};

UserSchema.statics.comparePasswords = async function (
  candidatePassword: string,
  hash: string
) {
  return bcrypt.compare(candidatePassword, hash);
};

const User: IUserModel = mongoose.model<IUser, IUserModel>(
  "User",
  UserSchema,
  "users"
);

export default User;
