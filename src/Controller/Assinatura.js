const docusign = require("docusign-esign");
const fs = require("fs-extra");
const jwtConsole = require("../config/jwtConsole");
const user = [];
module.exports = {
  async postAssinatura(req, res) {
    const document = req.body.document;
    const auth = await jwtConsole.main();
    user.push({ email: req.body.email, name: req.body.name });
    const env = await makeEnvelope(auth, document);
    const envelopeID = await sendEnvelope(env);
    res.json(envelopeID);
  },
};
async function sendEnvelope(args) {
  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient);
  let results = null;

  // Step 1. Make the envelope request body
  const envelope = makeEnvelope(args.envelopeArgs);

  // Step 2. call Envelopes::create API method
  // Exceptions will be caught by the calling function
  const code = "0cc91cf5-59ec-49d5-9ddf-c211e3048013";
  results = await envelopesApi.createEnvelope(code, {
    envelopeDefinition: envelope,
  });
  let envelopeId = results.envelopeId;

  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
  return { envelopeId: envelopeId };
}

async function makeEnvelope(args, documents) {
  const env = new docusign.EnvelopeDefinition();
  env.emailSubject = "Please sign this document set";

  const doc1 = new docusign.Document();
  const doc1b64 = documents;
  doc1.documentBase64 = doc1b64;
  doc1.name = "Order acknowledgement"; // can be different from actual file name
  doc1.fileExtension = "html"; // Source data format. Signed docs are always pdf.
  doc1.documentId = "1"; // a label used to reference the doc

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
  });
  const cc1 = new docusign.CarbonCopy();
  cc1.email = "diogosgn@gmail.com";
  cc1.name = "Diogo";
  cc1.routingOrder = "3";
  cc1.recipientId = "3";

  // Add the recipients to the envelope object
  const recipients = docusign.Recipients.constructFromObject({
    signers: [...recivers],
    carbonCopies: [cc1],
  });
  env.recipients = recipients;

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  // env.status = args.status;

  return env;
}
