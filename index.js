import express from "express";
import bootstrap  from "./src/Utils/app.controller.js";

const app = express();

 await bootstrap(app,express);
 let port =process.env.PORT || 4000;

app.listen(port, () => console.log(`Server running on port number : ${port}🚀`));
