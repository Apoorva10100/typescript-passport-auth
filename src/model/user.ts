import { Document, Schema, Model, model, Error, ObjectId } from "mongoose";
import bcrypt from "bcrypt-nodejs";


export interface IUser extends Document {
  username: string;
  password: string;

  comparePassword(candidatePassword: string): boolean;
}

export const userSchema: Schema = new Schema({
  username: { type: String, unique: true, sparse: true, required: true },
  password: {type: String, required: true},
});


userSchema.pre<IUser>("save", function save(next) {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    // tslint:disable-next-line: no-shadowed-variable
    bcrypt.hash(this.password, salt, null, (err: Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (this: any, candidatePassword: string, callback: any) {
  bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
    console.log(isMatch);
    return isMatch;
  });
};

export const User: Model<IUser> = model<IUser>("User", userSchema);
