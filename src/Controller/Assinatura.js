import { DocSignService } from "../Services/DocSignService";

let postAssinatura = async (req, res) => {
  let docusign = new DocSignService();
  let assinantes = req.body;
  let { document } = docusign;

  assinantes.map((assinante) => {
    let count = 0;
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

  let carbonCopy = docusign.recipients.addCarbonCopy();
  carbonCopy.name = "DIOGO";
  carbonCopy.email = "diogo.almeida@produzindocerto.com.br";

  document = docusign.addDocument();
  document.documentBase64 = assinantes[0].data;
  document.name = "testDocusign";
  document.fileExtension = "docx";

  docusign.send();
  res.send("ok");
};
exports.postAssinatura = postAssinatura;
