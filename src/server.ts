import bodyParser from "body-parser";
import express from "express";
import router from "./Router/router";
const app = express();
const port = 8080 || process.env.PORT;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
