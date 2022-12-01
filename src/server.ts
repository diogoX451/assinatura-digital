import bodyParser from "body-parser";
import express from "express";

import router from "./Router/router";
const app = express();
const port = 3333;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
