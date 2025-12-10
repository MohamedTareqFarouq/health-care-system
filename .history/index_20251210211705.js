import express from "express";
import bodyParser from 'body-parser'
import path from "path";
import { config } from "dotenv";
import dbConnection from "./db/dbConnection.js";

<<<<<<< HEAD

import appointmentRouter from "./routes/appointmentRoutes.js";
import authRouter from "./routes/auth.js";
=======
import appointmentRouter from "./routes/appointmentRoutes.js";
>>>>>>> 8d40e6cca70f7cd630eaf5246e16c29ef2114770


config();



const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(process.cwd(), "public")));


app.use(appointmentRouter);
app.use(authRouter);

app.use(bodyParser.json())




dbConnection();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server up and running on port ${port}`));
