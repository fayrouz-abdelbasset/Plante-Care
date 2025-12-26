import express from "express";
import bootstrap  from "./src/Utils/app.controller.js";
import dotenv from "dotenv"
dotenv.config({path:"./src/config/.env.dev"})
const app = express();

await bootstrap(app,express);
const  port =Number(process.env.PORT) || 4000;

app.listen(port, () => console.log(`Server running on port number : ${port}🚀`));
