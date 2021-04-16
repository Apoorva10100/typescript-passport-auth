import bcrypt from "bcrypt-nodejs";
import { NextFunction, Request, Response } from "express";
import { constants } from "node:http2";
import '../auth/passportHandler';
import { User } from "../model/user";
import { getAccessToken, getRefreshToken, refreshTokens }from "./tokenController";

export class UserController {

  public async registerUser(req: Request, res: Response): Promise<void> {
    const hashedPassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    const user = await new User({
      username: req.body.username,
      password: hashedPassword,
    })
    if (await User.findOne({ username: user.username })) {
      res.status(401).json({ status: 'error', code: 'existing user' });
    } else {
      User.create(user);
      console.log("REGISTERED SUCCESSFULLY!");
      res.json({ user });
    }
  }

  public async loginUser(req: Request, res: Response, next: NextFunction) {
    await User.findOne({ "username": req.body.username }, (err: any, user: any) => {
      if (err) { return res.json(err); }
      if (!user) {
        return res.json({ message: `username ${req.body.username} not found.` });
      }
      // tslint:disable-next-line: no-shadowed-variable
      user.comparePassword(req.body.password, (err: Error, isMatch: boolean) => {
        console.log("yayy");
        if (err) { return res.json(err); }
        if (isMatch) {
          return user;
        }
        return res.json({ message: "Invalid username or password." });
      });
      // tslint:disable-next-line: no-shadowed-variable
      req.login(user, { session: false }, (err) => {
        if (err) {
          res.json(err);
        }
        // generate a signed son web token with the contents of user object and return it in the response
        const refreshToken = getRefreshToken(user);
        const accessToken = getAccessToken(user);
        res.json({ user, accessToken, refreshToken });
        console.log("LOGGED IN SUCCESSFULLY!");
      });
    });
  }

  public async logoutUser(req: Request, res: Response, next: NextFunction) {
    req.logOut();
    res.redirect('/home');
  }

  public async newRefreshToken(req: Request, res: Response, next: NextFunction) {
    const username = req.body.username;
    const refreshToken = req.body.refreshToken;
    if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] === username)) {
      delete refreshTokens[refreshToken];
    }
    const newRefTok = getRefreshToken({ username });
    refreshTokens[newRefTok] = username;
    console.log(refreshTokens);
    res.json({username, "refreshToken": newRefTok});
  }
}




