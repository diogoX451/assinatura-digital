const docusign = require("docusign-esign");
const fs = require("fs");
const path = require("path");
const jwtConsole = require("../config/jwtConsole");
const user = [];
exports.sendEnvelope = sendEnvelope;
module.exports = {
  async postAssinatura(req, res) {
    const document = req.body.document;
    // const auth = await jwtConsole.main();
    user.push({ email: req.body.email, name: req.body.name });
    let env = await makeEnvelope(document);
    res.json(env);
  },
};

async function sendEnvelope(args) {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
    results = null;
  let envelope = makeEnvelope(args.envelopeArgs);
  const code = "0cc91cf5-59ec-49d5-9ddf-c211e3048013";
  results = await envelopesApi.createEnvelope(code, {
    envelopeDefinition: envelope,
  });
  let envelopeId = results.envelopeId;

  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
  return { envelopeId: envelopeId };
}
let docPdf = path.resolve(__dirname, "../../demo_documents");
let docSingle = "World_Wide_Corp_lorem.pdf";
let doc = fs.readFileSync(path.resolve(docPdf, docSingle));

function makeEnvelope(args, documents) {
  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = "Please sign this document set";
  let doc1b64 = Buffer.from(doc).toString("base64");
  let doc1 = new docusign.Document.constructFromObject({
    documentBase64: doc1b64,
    name: "Lorem Ipsum",
    fileExtension: "pdf",
    documentId: "1",
  });

  // The order in the docs array determines the order in the envelope
  env.documents = [doc1];

  const recivers = [];
  console.log(user);
  user?.map((signer) => {
    const count = recivers.length + 1;
    const receiver1 = docusign.Signer.constructFromObject({
      email: signer.email,
      name: signer.name,
      recipientId: "" + count,
      routingOrder: "1",
    });

    const signHere = docusign.SignHere.constructFromObject({
      anchorString: "/sn" + count + "/",
      anchorYOffset: "10",
      anchorUnits: "pixels",
      anchorXOffset: "20",
    });

    const signer1Tabs = docusign.Tabs.constructFromObject({
      signHereTabs: [signHere],
    });
    receiver1.tabs = signer1Tabs;
    recivers.push(receiver1);
    return receiver1;
  });
  const cc1 = new docusign.CarbonCopy();
  cc1.email = "diogosgn@gmail.com";
  cc1.name = "Diogo";
  cc1.routingOrder = "1";
  cc1.recipientId = "1";

  // Add the recipients to the envelope object
  let recipients = docusign.Recipients.constructFromObject({
    signers: [...recivers],
    carbonCopies: [cc1],
  });

  env.recipients = recipients;

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  env.status = "sent";

  return env;
}
