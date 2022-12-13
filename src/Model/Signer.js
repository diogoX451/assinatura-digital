import { CarbonCopy } from "./CarbonCopy";
import { SignHere } from "./SignHere";

export class Signer extends CarbonCopy {
  tabs = { signHereTabs: [] };

  addSignHere() {
    let signHere = new SignHere();
    this.tabs.signHereTabs.push(signHere);
    return signHere;
  }
}
