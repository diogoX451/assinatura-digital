import Router from "express";
import SignerController from "../Controller/Assinatura";
const signer = new SignerController();
const router = Router();
router.post("/assinatura", signer.postAssinatura);
router.get("/teste", (req, res) => {
    res.send("Hello World!");
});
export default router;
