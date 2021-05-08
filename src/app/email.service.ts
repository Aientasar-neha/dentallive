import { Injectable } from '@angular/core';
import { HttpClient, } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

export interface mail {
  pk: string,
  sk: string,
  MailFrom: string,
  MailTo: string,
  MailCc: string,
  inReplyTo: string,
  references: string,
  mailDateTime: string,
  subject: string,
  messageId: string,
  s3link: string,
  patientId: string,
  subUserId: string,
  htmlText: string,
  plainText: string,
}

@Injectable({
  providedIn: "root",
})

export class EmailService {

  //singleton package object shared across all the components
  sharedEmailData: BehaviorSubject<Array<mail>> = new BehaviorSubject([]);

  preSignUrl: string;
  httpOptions: any;
  sendMailUrl: string;
  allMaildata: string;

  constructor(private http: HttpClient) {
    this.sendMailUrl = "https://dfgirshn9d.execute-api.us-west-2.amazonaws.com/default/sendMailDental";
    this.preSignUrl = "https://hg6x56ixcl.execute-api.us-west-2.amazonaws.com/default/createPresignedUrl";
    this.allMaildata = "https://j0fdbxbgja.execute-api.us-west-2.amazonaws.com/default/readMail";
  }

  updateMailData(message: any) {
    this.sharedEmailData.next(message)
  }

  getPreSignedUrl(name, type, storage = null) {
    if (!storage)
      storage = "dentalmail-attachments";
    let data = { "name": name, 'type': type, "storage": storage }
    return this.http.post(this.preSignUrl, data);
  }

  readallMaildata(data) {
    return this.http.post(this.allMaildata, data);
  }

  saveDataS3(data: any, url: any) {
    return this.http.put(url, data);
  }

  sendMail(data: any) {
    return this.http.put(this.sendMailUrl, data);
  }

}
