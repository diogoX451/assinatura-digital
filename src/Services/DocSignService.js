import { Recipients } from "../Model/Recipients";
const jwtConfig = require("../config/jwtConfig.json");
import { Document } from "../Model/Document";
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const docusign = require("docusign-esign");
const RSAKEY = fs.readFileSync(path.resolve(__dirname, "./private.key"));
const SCOPES = ["signature", "impersonation"];
let env = new docusign.EnvelopeDefinition();
const JWT_LIVE_SEC = 10 * 60;
export class DocSignService {
  accessToken = null;
  recipients = new Recipients();
  sendDocument = [];
  async authenticate() {
    const dsApi = new docusign.ApiClient();
    dsApi.setOAuthBasePath(jwtConfig.dsOauthServer.replace("https://", ""));
    try {
      const results = await dsApi.requestJWTUserToken(
        jwtConfig.dsJWTClientId,
        jwtConfig.impersonatedUserGuid,
        SCOPES,
        RSAKEY,
        JWT_LIVE_SEC
      );
      this.accessToken = results.body.access_token;
      return this;
    } catch (e) {
      throw e;
    }
  }
  addDocument(name, fileExtension, documentBase64) {
    let document = new Document();
    document.documentBase64 = documentBase64;
    document.name = name;
    document.fileExtension = fileExtension;
    document.documentId = this.sendDocument.length + 1;
    this.sendDocument.push(document);
    env.documents = this.sendDocument;
    return document;
  }
  async send() {
    console.log(this.recipients);
    try {
      await this.authenticate();
    } catch (e) {
      console.log(e);
    }
    await axios({
      method: "POST",
      url: "https://demo.docusign.net/restapi/v2.1/accounts/0cc91cf5-59ec-49d5-9ddf-c211e3048013/envelopes",
      data: {
        emailSubject: "Please sign this document set",
        recipients: this.recipients,
        documents: this.sendDocument,
        status: "sent",
      },
      headers: {
        Authorization: "Bearer " + this.accessToken,
      },
    })
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log("Error", error.response.data);
      });
  }
}
