import express from "express";
import mongoose from "mongoose";
import homeRoute from './routes/home_route';
import { MONGODB_URI } from "./utils/secret";
import { UserRoutes } from "./routes/user_route";
import passport from "passport";

const mongoUrl = MONGODB_URI!; // we are sure that the uri is not none, cuz its checked in secret.ts, so using non-null assertion operator is fine here.

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => {
        console.log('Connected to DB');
    }
).catch(err => {
    console.log(`Mongo connection error: ${err}`);
});

// const swaggerOptions = {
//   definition: {
//       openapi: "3.0.0",
//       info: {
//           title: "Kakashi - Course Service",
//           version: "0.1.0",
//           description: "The course service for innovation courses portal"
//       },
//       tags: [
//           {
//               name: "Courses",
//               description: "Endpoints for courses."
//           }
//       ]
//   },
// }
// const swaggerSpecs = swaggerJsdoc(swaggerOptions);

const app = express();

// configuration
app.set("port", process.env.PORT || 3000);

// swagger
// if (process.env.NODE_ENV !== "production")
//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

// middleware

app.use(express.json());

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/home', homeRoute);
app.use('/auth', new UserRoutes().router);
// add routers

export default app;