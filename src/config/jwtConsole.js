// eslint-disable-next-line @typescript-eslint/no-var-requires
const docusign = require("docusign-esign");
const fs = require("fs");
const path = require("path");
const sendEnvelope = require("../Controller/Assinatura");
const jwtConfig = require("./jwtConfig.json");

const { ProvisioningInformation } = require("docusign-esign");
// const demoDocsPath = path.resolve(__dirname, "../demo_documents");
// const doc2File = "World_Wide_Corp_Battle_Plan_Trafalgar.docx";
// const doc3File = "World_Wide_Corp_lorem.pdf";

const SCOPES = ["signature", "impersonation"];
const getArgs = async (apiAccountId, accessToken, basePath) => {
  const envelopeArgs = {
    ccEmail: "diogosgn@gmail.com",
    ccName: "Diogo",
    status: "sent",
  };
  const args = {
    accessToken,
    basePath,
    accountId: apiAccountId,
    envelopeArgs,
  };
  console.log(args);
  return args;
};
const authenticate = async () => {
  const jwtLifeSec = 10 * 60;
  const dsApi = new docusign.ApiClient();
  dsApi.setOAuthBasePath(jwtConfig.dsOauthServer.replace("https://", ""));
  const rsaKey = fs.readFileSync(path.resolve(__dirname, "./private.key"));
  try {
    const results = await dsApi.requestJWTUserToken(
      jwtConfig.dsJWTClientId,
      jwtConfig.impersonatedUserGuid,
      SCOPES,
      rsaKey,
      jwtLifeSec
    );
    const accessToken = results.body.access_token;
    const userInfoResults = await dsApi.getUserInfo(accessToken);
    const userInfo = userInfoResults.accounts.find(
      (account) => account.isDefault === "true"
    );

    return {
      accessToken: results.body.access_token,
      apiAccountId: userInfo.accountId,
      basePath: `${userInfo.baseUri}/restapi`,
    };
  } catch (e) {
    console.log(e);
    const body = e.response && e.response.body;
    if (body) {
      if (body.error && body.error === "consent_required") {
        if (this.getConsent()) {
          return this.authenticate();
        }
      } else {
        this._debug_log(`\nAPI problem: Status code ${
          e.response.status
        }, message body:
        ${JSON.stringify(body, null, 4)}\n\n`);
      }
    }
  }
};

function getConsent() {
  const urlScopes = SCOPES.join("+");
  // Construct consent URL
  const redirectUri = "https://developers.docusign.com/platform/auth/consent";
  const consentUrl =
    `${jwtConfig.dsOauthServer}/oauth/auth?response_type=code&` +
    `scope=${urlScopes}&client_id=${jwtConfig.dsJWTClientId}&` +
    `redirect_uri=${redirectUri}`;
}
const jwt = {
  main: async () => {
    const accountInfo = await authenticate();
    const args = getArgs(
      accountInfo.apiAccountId,
      accountInfo.accessToken,
      accountInfo.basePath
    );
    let envelope = sendEnvelope.sendEnvelope(args);
    console.log(envelope);
  },
};
jwt.main();
module.exports = jwt;
