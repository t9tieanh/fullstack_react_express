import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;

  comparePassword(candidate: string): Promise<boolean>;
  setPassword(newPass: string): Promise<void>;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:  { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 6 }
}, { timestamps: true });

/**
 * 🔒 Helper để hash password
 */
async function hashPasswordIfNeeded(update: any) {
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
}

/**
 * Middleware khi save (create/update qua .save())
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  // @ts-ignore
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Middleware cho updateOne và findOneAndUpdate
 */
async function preUpdateHook(this: any, next: Function) {
  const update = this.getUpdate();
  if (update) {
    await hashPasswordIfNeeded(update);
    this.setUpdate(update);
  }
  next();
}

UserSchema.pre('updateOne', preUpdateHook);
UserSchema.pre('findOneAndUpdate', preUpdateHook);

/**
 * Methods
 */
UserSchema.methods.comparePassword = function (candidate: string) {
  // @ts-ignore
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.setPassword = async function (newPass: string) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(newPass, salt);
};

export default mongoose.model<IUser>('User', UserSchema);
