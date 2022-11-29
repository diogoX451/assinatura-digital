import Router from "express";
import Assinatura from "../Controller/Assinatura";
const router = Router();

router.get("/assinatura", Assinatura.getAssinatura);

router.post("/teste", Assinatura.postAssinatura);





export default router;