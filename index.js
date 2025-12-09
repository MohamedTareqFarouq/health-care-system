import express from "express";
import bodyParser from 'body-parser'
import path from "path";
import session from "express-session";
import mongoSession from "connect-mongodb-session";
import { config } from "dotenv";
import dbConnection from "./src/db/dbConnection.js";


import registerRouter from "./src/modules/register/routes.js";
import loginRouter from "./src/modules/login/routes.js";
import logoutRouter from "./src/modules/logout/routes.js";



config();



const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const MongoDBStore = mongoSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_ATLAS_URI,
  collection: "sessions",
});

app.use(express.static(path.join(process.cwd(), "public")));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store,
  })
);

app.use(registerRouter);

app.use(loginRouter);
app.use(logoutRouter);


app.use(bodyParser.json())




dbConnection();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server up and running on port ${port}`));
