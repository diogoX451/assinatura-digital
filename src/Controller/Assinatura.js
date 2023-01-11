import { DocSignService } from "../Services/DocSignService";
const path = require("path");
const demoDocsPath = path.resolve(__dirname, "../../demo_documents");
const fs = require("fs");
const doc2File = "World_Wide_Corp_Battle_Plan_Trafalgar.docx";
const doc3File = "testDocusign.docx";

let postAssinatura = async (req, res) => {
  let docusign = new DocSignService();
  let assinantes = req.body;
  let { document } = docusign;
  assinantes.map((assinante) => {
    let signer = docusign.recipients.addSigner();
    signer.name = assinante.nome;
    signer.email = assinante.email;
    let signHere = signer.addSignHere();

    signHere.anchorString = "/sn" + signer.recipientId + 1 + "/";
    signHere.anchorUnits = "pixels";
    signHere.anchorXOffset = "20";
    signHere.anchorYOffset = "10";
  });
  let carbonCopy = docusign.recipients.addCarbonCopy();
  carbonCopy.name = "DIOGO";
  carbonCopy.email = "diogo.almeida@produzindocerto.com.br";
  // const documentBase64 = Buffer.from(
  //   fs.readFileSync(path.resolve(demoDocsPath, doc2File))
  // ).toString("base64");
  // const name = "World_Wide_Corp_Battle_Plan_Trafalgar";
  // const fileExtension = "docx";

  document = docusign.addDocument();
  document.documentBase64 = Buffer.from(
    fs.readFileSync(path.resolve(demoDocsPath, doc3File))
  ).toString("base64");
  document.name = "testDocusign";
  document.fileExtension = "docx";

  docusign.send();
  res.send("ok");
};
exports.postAssinatura = postAssinatura;
