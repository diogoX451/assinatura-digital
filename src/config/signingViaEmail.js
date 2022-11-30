/**
 * @file
 * Example 002: Remote signer, cc, envelope has three documents
 * @author DocuSign
 */

const fs = require("fs-extra");
const docusign = require("docusign-esign");

/**
 * This function does the work of creating the envelope
 */
const sendEnvelope = async (args) => {
  // Data for this method
  // args.basePath
  // args.accessToken
  // args.accountId

  let dsApiClient = new docusign.ApiClient();
  dsApiClient.setBasePath(args.basePath);
  dsApiClient.addDefaultHeader("Authorization", "Bearer " + args.accessToken);
  let envelopesApi = new docusign.EnvelopesApi(dsApiClient),
    results = null;

  // Step 1. Make the envelope request body
  let envelope = makeEnvelope(args.envelopeArgs);

  // Step 2. call Envelopes::create API method
  // Exceptions will be caught by the calling function
  results = await envelopesApi.createEnvelope(args.accountId, {
    envelopeDefinition: envelope,
  });
  let envelopeId = results.envelopeId;

  console.log(`Envelope was created. EnvelopeId ${envelopeId}`);
  return { envelopeId: envelopeId };
};

/**
 * Creates envelope
 * @function
 * @param {Object} args parameters for the envelope
 * @returns {Envelope} An envelope definition
 * @private
 */

function makeEnvelope(args) {
  // Data for this method
  // args.signerEmail
  // args.signerName
  // args.ccEmail
  // args.ccName
  // args.status
  // doc2File
  // doc3File

  // document 1 (html) has tag **signature_1**
  // document 2 (docx) has tag /sn1/
  // document 3 (pdf) has tag /sn1/
  //
  // The envelope has two recipients.
  // recipient 1 - signer
  // recipient 2 - cc
  // The envelope will be sent first to the signer.
  // After it is signed, a copy is sent to the cc person.

  let doc2DocxBytes, doc3PdfBytes;
  // read files from a local directory
  // The reads could raise an exception if the file is not available!
  doc2DocxBytes = fs.readFileSync(args.doc2File);
  doc3PdfBytes = fs.readFileSync(args.doc3File);

  // create the envelope definition
  let env = new docusign.EnvelopeDefinition();
  env.emailSubject = "Please sign this document set";

  // add the documents
  let doc1 = new docusign.Document(),
    doc1b64 = Buffer.from(document1(args)).toString("base64"),
    doc2b64 = Buffer.from(doc2DocxBytes).toString("base64"),
    doc3b64 = Buffer.from(doc3PdfBytes).toString("base64");
  doc1.documentBase64 = doc1b64;
  doc1.name = "Order acknowledgement"; // can be different from actual file name
  doc1.fileExtension = "html"; // Source data format. Signed docs are always pdf.
  doc1.documentId = "1"; // a label used to reference the doc

  // Alternate pattern: using constructors for docs 2 and 3...
  let doc2 = new docusign.Document.constructFromObject({
    documentBase64: doc2b64,
    name: "Battle Plan", // can be different from actual file name
    fileExtension: "docx",
    documentId: "2",
  });

  let doc3 = new docusign.Document.constructFromObject({
    documentBase64: doc3b64,
    name: "Lorem Ipsum", // can be different from actual file name
    fileExtension: "pdf",
    documentId: "3",
  });

  // The order in the docs array determines the order in the envelope
  env.documents = [doc1, doc2, doc3];

  let signers = [
    {
      name: "Jonathan Canavieira",
      email: "jonathan.canavieira@2beconsulting.com.br",
    },
    {
      name: "Diogo",
      email: "diogo.almeida@produzindocerto.com.br",
    },
  ];

  let recivers = [];
  signers.map((signer) => {
    let count = recivers.length + 1;
    let receiver1 = docusign.Signer.constructFromObject({
      email: signer.email,
      name: signer.name,
      recipientId: "" + count,
      routingOrder: "1",
    });

    let signHere = docusign.SignHere.constructFromObject({
      anchorString: "/sn" + count + "/",
      anchorYOffset: "10",
      anchorUnits: "pixels",
      anchorXOffset: "20",
    });

    let signer1Tabs = docusign.Tabs.constructFromObject({
      signHereTabs: [signHere],
    });
    receiver1.tabs = signer1Tabs;
    recivers.push(receiver1);
  });

  // routingOrder (lower means earlier) determines the order of deliveries
  // to the recipients. Parallel routing order is supported by using the
  // same integer as the order for two or more recipients.

  // create a cc recipient to receive a copy of the documents, identified by name and email
  // We're setting the parameters via setters
  let cc1 = new docusign.CarbonCopy();
  cc1.email = args.ccEmail;
  cc1.name = args.ccName;
  cc1.routingOrder = "3";
  cc1.recipientId = "3";

  // Add the recipients to the envelope object
  let recipients = docusign.Recipients.constructFromObject({
    signers: [...recivers],
    carbonCopies: [cc1],
  });
  env.recipients = recipients;

  // Request that the envelope be sent by setting |status| to "sent".
  // To request that the envelope be created as a draft, set to "created"
  env.status = args.status;

  return env;
}

/**
 * Creates document 1
 * @function
 * @private
 * @param {Object} args parameters for the envelope
 * @returns {string} A document in HTML format
 */

function document1(args) {
  // Data for this method
  // args.signerEmail
  // args.signerName
  // args.ccEmail
  // args.ccName

  return `
    <!DOCTYPE html>
    <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body style="font-family:sans-serif;margin-left:2em;">
        <h1 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
            color: darkblue;margin-bottom: 0;">World Wide Corp</h1>
        <h2 style="font-family: 'Trebuchet MS', Helvetica, sans-serif;
          margin-top: 0px;margin-bottom: 3.5em;font-size: 1em;
          color: darkblue;">Order Processing Division</h2>
        <h4>Ordered by ${args.signerName}</h4>
        <p style="margin-top:3em;">
  Candy bonbon pastry jujubes lollipop wafer biscuit biscuit. Topping brownie sesame snaps sweet roll pie. Croissant danish biscuit soufflé caramels jujubes jelly. Dragée danish caramels lemon drops dragée. Gummi bears cupcake biscuit tiramisu sugar plum pastry. Dragée gummies applicake pudding liquorice. Donut jujubes oat cake jelly-o. Dessert bear claw chocolate cake gummies lollipop sugar plum ice cream gummies cheesecake.
        </p>
        <!-- Note the anchor tag for the signature field is in white. -->
        <h3 style="margin-top:3em;">Agreed: <span style="color:white;">**signature_1**/</span></h3>
        <h3 style="margin-top:3em;">Agreed: <span style="color:white;">/sn1/</span></h3>
        </body>
    </html>
  `;
}

module.exports = { sendEnvelope };
