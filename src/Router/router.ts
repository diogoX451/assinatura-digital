import Router from "express";
const Assinatura = require ("../Controller/Assinatura");
const router = Router();
router.post("/teste", Assinatura.postAssinatura);
export default router;
