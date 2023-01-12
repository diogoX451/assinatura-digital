import Router from "express";
const Assinatura = require ("../Controller/Assinatura");
const router = Router();
router.post("/assinatura", Assinatura.postAssinatura);
export default router;
