import express from "express";
import router from "./Router/router";
import bodyParser from "body-parser";
const app = express();
const port = 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);
app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
