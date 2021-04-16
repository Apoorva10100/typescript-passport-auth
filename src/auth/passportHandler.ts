import passport from "passport";
import passportLocal from "passport-local";
import passportJwt from "passport-jwt";
import { User } from "../model/user";
import { JWT_SECRET } from "../utils/secret";


const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;


// passport.use("login", new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
//   await User.findOne({ username }, (err: any, user: any) => {
//     if (err) { return done(err); }
//     if (!user) {
//       return done(undefined, false, { message: `username ${username} not found.` });
//     }
//     // tslint:disable-next-line: no-shadowed-variable
//     user.comparePassword(password, (err: Error, isMatch: boolean) => {
//       console.log("yayy");
//       if (err) { return done(err); }
//       if (isMatch) {
//         return done(undefined, user);
//       }
//       return done(undefined, false, { message: "Invalid username or password." });
//     });
//   });
// }));

passport.use("jwt", new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
  }, async (jwtToken, done) => {
    await User.findOne({ username: jwtToken.username }, (err: any, user: any) => {
      if (err) { return done(err, false); }
      if (user) {
        return done(undefined, user , jwtToken);
      } else {
        return done(undefined, false);
      }
    });
  }));


