import { Injectable } from '@angular/core';
import { HttpClient, } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

export interface account {
  pk: string,
  sk: string,
  accountfirstName: string,
  accountlastName: string,
  emailAddress: string,
  imageSrc: string,
  phoneNumber: string,
  dob: string
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  //singleton package object shared across all the components
  sharedAccountData: BehaviorSubject<Array<account>> = new BehaviorSubject([]);

  preSignUrl: string;
  putAccount: string;//signup
  readAccount: string;
  loginAccount: string;//login
  updateAccount;//internal update

  constructor(private http: HttpClient) {
    this.preSignUrl = "https://hg6x56ixcl.execute-api.us-west-2.amazonaws.com/default/createPresignedUrl";
    this.putAccount = "https://6vvl848qm2.execute-api.us-west-2.amazonaws.com/default/putAccount";
    this.readAccount = "https://nt7yyffmx5.execute-api.us-west-2.amazonaws.com/default/getAccount";
    this.loginAccount = "https://7w0lcl5bn3.execute-api.us-west-2.amazonaws.com/default/loginAccount";
    this.updateAccount = "https://kpxbsvgeu8.execute-api.us-west-2.amazonaws.com/default/updateAccount"
  }

  updateAccountData(message: any) {
    this.sharedAccountData.next(message)
  }

  getPreSignedUrl(name, type, storage = null) {
    let data = { "name": name, 'type': type, "storage": storage }
    return this.http.post(this.preSignUrl, data);
  }

  saveDataS3(data: any, url: any) {
    return this.http.put(url, data);
  }

  readAccountdata(data) {
    return this.http.post(this.readAccount, data);
  }

  saveAccount(data) {
    return this.http.post(this.putAccount, data);
  }

  updateAccountdata(data) {
    return this.http.post(this.updateAccount, data);
  }

  loginAccountData(data) {
    return this.http.post(this.loginAccount, data);
  }
}
