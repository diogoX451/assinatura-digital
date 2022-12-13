import { Recipients } from "../Model/Recipients";
const jwtConfig = require("../config/jwtConfig.json");
import { Document } from "../Model/Document";
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const docusign = require("docusign-esign");
const RSAKEY = fs.readFileSync(path.resolve(__dirname, "./private.key"));
const SCOPES = ["signature", "impersonation"];
const JWT_LIVE_SEC = 10 * 60;
export class DocSignService {
  accessToken = null;
  documents = [];
  recipients = new Recipients();

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
  addDocument() {
    let document = new Document();
    document.documentId = this.documents.length + 1;
    this.documents.push(document);
    return document;
  }
  async send() {
    try {
      await this.authenticate();
    } catch (e) {
      console.log(e);
    }
    axios({
      method: "POST",
      url: "https://demo.docusign.net/restapi/v2.1/accounts/0cc91cf5-59ec-49d5-9ddf-c211e3048013/envelopes",
      data: {
        emailSubject: "Please sign this document set",
        recipients: this.recipients,
        documents: this.documents,
      },
      headers: {
        Authorization: "Bearer " + this.accessToken,
      },
    })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log("Error", error.response.data);
      });
  }
}
