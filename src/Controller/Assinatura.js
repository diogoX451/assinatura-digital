const docusign = require("docusign-esign");
const fs = require("fs");
const path = require("path");
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
  const code1 = "https://demo.docusign.net/restapi";
  dsApiClient.setBasePath(code1);
  const code2 =
    "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCAMBhiqtPaSAgAgJjcw7LT2kgCAIyPUSNk0U1PpxhZSD-mpNIVAAEAAAAYAAIAAAAFAAAAHQAAAA0AJAAAADZhNmY4ZmRkLWI2ZDYtNDdiNi1iMWZhLTIzOTc1YWRkZDVjOSIAJAAAADZhNmY4ZmRkLWI2ZDYtNDdiNi1iMWZhLTIzOTc1YWRkZDVjORIAAQAAAAYAAABqd3RfYnIjACQAAAA2YTZmOGZkZC1iNmQ2LTQ3YjYtYjFmYS0yMzk3NWFkZGQ1Yzk.ZStFjV2O8nHAomCxwHO1fIOFNmknGstQHwRfadHnIg2-1QOs_-0Fy2UDdmK7Pwm2PlDPesR-yZvjGgmpsTK3d6lpqp4lPDqBf05aUbZFguZsUkK0KW7aqtGkHQA3nN95R5kV-PNifshrNCk_RF2F71U0xhMqcunXwck7fIR7xizsnHJlqpjgkEihnlRE1MGMQBD1cjsGi9iHjT6mbAh9WTAkuLkOSf6zlDfSBWCAJt9OowQOa-BMzZbj3TIIZz59CBldD_rh9j8iCCE-CgxRPGduXWC83XQQzTD39uKxyl2NMadsj_utZu3asEH44XxxpMz4iXasLD2UvyOU6JSGZQ";
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
let docPdf = path.resolve(__dirname, "../../demo_documents");
let docSingle = "World_Wide_Corp_lorem.pdf";
let doc = fs.readFileSync(path.resolve(docPdf, docSingle));
function makeEnvelope(args, documents) {
  const env = new docusign.EnvelopeDefinition();
  env.emailSubject = "Please sign this document set";
  const doc1b64 = Buffer.from(doc).toString("base64");
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
  env.status = "sent";

  return env;
}
