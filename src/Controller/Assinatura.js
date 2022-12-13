import { DocSignService } from "../Services/DocSignService";
const path = require("path");
const demoDocsPath = path.resolve(__dirname, "../../demo_documents");
const fs = require("fs");
const doc2File = "World_Wide_Corp_Battle_Plan_Trafalgar.docx";
const doc3File = "World_Wide_Corp_lorem.pdf";
let postAssinatura = async (req, res) => {
  let docusign = new DocSignService();
  let document = docusign.addDocument();
  document.documentBase64 = Buffer.from(
    fs.readFileSync(path.resolve(demoDocsPath, doc2File))
  ).toString("base64");
  document.name = "World_Wide_Corp_Battle_Plan_Trafalgar";
  document.fileExtension = "docx";

  document = docusign.addDocument();
  document.documentBase64 = Buffer.from(
    fs.readFileSync(path.resolve(demoDocsPath, doc3File))
  ).toString("base64");
  document.name = "World_Wide_Corp_lorem";
  document.fileExtension = "pdf";

  let signer = docusign.recipients.addSigner();
  signer.name = "diogosgn";
  signer.email = "diogosgn@gmail.com";

  let signHere = signer.addSignHere();

  signHere.anchorString = "**signature_1**";
  signHere.anchorUnits = "pixels";
  signHere.anchorXOffset = "20";
  signHere.anchorYOffset = "10";

  let carbonCopy = docusign.recipients.addCarbonCopy();
  carbonCopy.name = "cleomar";
  carbonCopy.email = "cleojr11@hotmail.com";

  docusign.send();
};
exports.postAssinatura = postAssinatura;
