import DocSignService  from "../Services/DocSignService";
import { Key } from '../Model/Key';
import crypto from 'crypto';
import OAuth from "oauth-1.0a";
import { IAxios } from '../repository/IAxios';
import axios from 'axios';
import pdfToBase64 from 'pdf-to-base64';
require("dotenv").config();


export default class SignerController {
  constructor(private readonly Key: Key) {
    this.Key = Key;
  }

  async postAssinatura(req: Request, res: Response) {
    const auth = async (url: string) => {
      const oauth = new OAuth({
      consumer: { key: process.env.CONSUMER_KEY, secret: process.env.CONSUMER_SECRET },
      signature_method: "HMAC-SHA1",
      hash_function(base_string, key) {
        return crypto
          .createHmac("sha1", key)
          .update(base_string)
          .digest("base64");
      }
      }); 
      
    const authorizationHeader = oauth.toHeader(oauth.authorize({ url: url, method: 'GET' },
      { key: process.env.TOKEN, secret: process.env.TOKEN_SECRET }));
    
    const options: IAxios = {
      method: 'GET',
      url: url,
      headers: { Authorization: authorizationHeader.Authorization },
    }
      try {
        const response = await axios(options);
        const data = await pdfToBase64(response.data.content);
        return data;
      } catch (error: any) {
        return console.log(error.message);
      }
    }
    let documentSigner = req.body.documento;
    let docusign = new DocSignService();
    let assinantes = req.body.assinantes;
    let assinantesPrincipais = [
      {
        nome: "Thiago Brasil",
        email: "thiago@produzindocerto.com.br",
      },
    ];
    let signers = assinantesPrincipais.concat(assinantes);
    console.log(signers);
    let { document } = docusign;

    let count = 0;
    signers?.map((assinante: string) => {
      let signer = docusign.recipients.addSigner();
      signer.name = assinante.nome;
      signer.email = assinante.email;
      let signHere = signer.addSignHere();
      
      signHere.anchorString = "/sn" + count++ + "/";
      console.log(signHere.anchorString);
      signHere.anchorUnits = "pixels";
      signHere.anchorXOffset = "20";
      signHere.anchorYOffset = "10";
    });
    
    document = docusign.addDocument();
    document.documentBase64 = await auth(documentSigner);
    document.name = "Documento teste 1";
    document.fileExtension = "pdf";

    let carbonCopy = docusign.recipients.addCarbonCopy();
    carbonCopy.name = "Diogo dos Reis Almeida";
    carbonCopy.email = "diogosgn@gmail.com";
    docusign.send();
  };
}

