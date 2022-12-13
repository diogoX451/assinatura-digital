import { CarbonCopy } from "./CarbonCopy";
import { Signer } from "./Signer";

export class Recipients {
  carbonCopies = [];
  signers = [];

  addCarbonCopy() {
    let carbonCopy = new CarbonCopy();
    carbonCopy.recipientId = this.signers.length + this.carbonCopies.length + 1;
    this.carbonCopies.push(carbonCopy);
    return carbonCopy;
  }
  addSigner() {
    let signer = new Signer();
    signer.recipientId = this.signers.length + this.carbonCopies.length + 1;
    this.signers.push(signer);
    return signer;
  }
}
