import Assinatura from '../Model/Assinatura';
import { Request, Response } from 'express';

export default {
    async getAssinatura(req: Request, res: Response) {
       
    },
    async postAssinatura(req: Request, res: Response) {
        const assinatura: Assinatura = {
            email: req.body.email,
            nome: req.body.nome
        }
        res.json(assinatura);
    }
}