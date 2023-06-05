import express from "express";
import router from "./routes/router.js";
import "./lib/connect_db.js";

const app = express();

app.use(express.json()); // body parser enables access to req.body

app.use("/", router);

app.use((err, req, res, next) => {
   console.log(err);
   const statusCode = err.statusCode || 500;
   res.status(statusCode).send(err.message);
});
