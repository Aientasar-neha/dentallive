import { Injectable } from '@angular/core';
import { HttpClient, } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";

export interface contact {
  pk: string,
  sk: string,
  contactfirstName: string,
  contactlastName: string,
  emailAddress: string,
  imageSrc: string,
  contactId: string,
  phoneNumber: string,
}

@Injectable({
  providedIn: 'root'
})

export class ContactService {
  //singleton package object shared across all the components
  sharedContactData: BehaviorSubject<Array<contact>> = new BehaviorSubject([]);

  preSignUrl: string;
  putContact: string;
  readContact: string;
  deleteContact: string;

  constructor(private http: HttpClient) {
    this.preSignUrl = "https://hg6x56ixcl.execute-api.us-west-2.amazonaws.com/default/createPresignedUrl";
    this.putContact = "https://n8eby7ood1.execute-api.us-west-2.amazonaws.com/default/putContact";
    this.readContact = " https://rvzqt7v603.execute-api.us-west-2.amazonaws.com/default/getContact";
    this.deleteContact = "https://npkvrxn2zf.execute-api.us-west-2.amazonaws.com/default/deleteContact";
  }


  updateContactData(message: any) {
    this.sharedContactData.next(message)
  }

  getPreSignedUrl(name, type, storage = null) {
    let data = { "name": name, 'type': type, "storage": storage }
    return this.http.post(this.preSignUrl, data);
  }

  saveDataS3(data: any, url: any) {
    return this.http.put(url, data);
  }

  readContactdata(data) {
    return this.http.post(this.readContact, data);
  }

  saveContact(data) {
    return this.http.post(this.putContact, data);
  }

  deleteContactdata(data) {
    return this.http.post(this.deleteContact, data);
  }
}
