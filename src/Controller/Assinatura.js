import { DocSignService } from "../Services/DocSignService";

let postAssinatura = async (req, res) => {
  let docusign = new DocSignService();
  let requisicao = req.body;
  let assinantesPrincipais = [
    {
      nome: "Diogo dos Reis Almeida",
      email: "diogo.almeida@produzindocerto.com.br",
    },
  ];
  let assinantes = requisicao.concat(assinantesPrincipais);

  let { document } = docusign;

  assinantes.map((assinante) => {
    let signer = docusign.recipients.addSigner();
    signer.name = assinante.nome;
    signer.email = assinante.email;
    let signHere = signer.addSignHere();

    signHere.anchorString = "/sn" + assinantes.length++ + "/";
    console.log(signHere.anchorString);
    signHere.anchorUnits = "pixels";
    signHere.anchorXOffset = "20";
    signHere.anchorYOffset = "10";
  });
  document = docusign.addDocument();
  document.documentBase64 = requisicao[0].document;
  document.name = "Documento teste 1";
  document.fileExtension = "docx";

  let carbonCopy = docusign.recipients.addCarbonCopy();
  carbonCopy.name = "Diogo dos Reis Almeida";
  carbonCopy.email = "diogosgn@gmail.com";
  docusign.send();
  res.send("ok");
};
exports.postAssinatura = postAssinatura;
