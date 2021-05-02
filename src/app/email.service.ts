import { Injectable } from '@angular/core';
import { HttpClient, } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { mail, patient } from './email.model';

@Injectable({
  providedIn: "root",
})

export class EmailService {

  //singleton package object shared across all the components
  sharedEmailData: BehaviorSubject<Array<mail>> = new BehaviorSubject([]);
  sharedPatientData: BehaviorSubject<Array<patient>> = new BehaviorSubject([]);

  preSignUrl: string;
  httpOptions: any;
  sendMailUrl: string;
  allMaildata: string;
  putPatient: string;
  readPatient: string;
  freezePatient: string;
  deletePatient: string;

  constructor(private http: HttpClient) {
    this.sendMailUrl = "https://dfgirshn9d.execute-api.us-west-2.amazonaws.com/default/sendMailDental";
    this.preSignUrl = "https://hg6x56ixcl.execute-api.us-west-2.amazonaws.com/default/createPresignedUrl";
    this.allMaildata = "https://j0fdbxbgja.execute-api.us-west-2.amazonaws.com/default/readMail";

    this.putPatient = "https://ox99w7el85.execute-api.us-west-2.amazonaws.com/default/putPatient";
    this.readPatient = "https://cigdcnww72.execute-api.us-west-2.amazonaws.com/default/getPatient";
    this.freezePatient = "https://hcnkq3nlj2.execute-api.us-west-2.amazonaws.com/default/freezePatient";
    this.deletePatient = "https://n5x6iuqelc.execute-api.us-west-2.amazonaws.com/default/deletePatient";
  }

  updateMailData(message: any) {
    this.sharedEmailData.next(message)
  }

  updatePatientData(message: any) {
    this.sharedPatientData.next(message)
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


  readPatientdata(data) {
    return this.http.post(this.readPatient, data);
  }

  savePatient(data) {
    return this.http.post(this.putPatient, data);
  }

  freezePatientdata(data) {
    return this.http.post(this.freezePatient, data);
  }

  deletePatientdata(data) {
    return this.http.post(this.deletePatient, data);
  }
}
