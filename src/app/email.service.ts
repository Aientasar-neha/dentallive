import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, } from "@angular/common/http";
import { Observable, of, BehaviorSubject, throwError } from "rxjs";
import { catchError, map, finalize } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class EmailService {
  preSignUrl: string;
  httpOptions: any;
  sendMailUrl: string;
  mailData: string;
  constructor(private http: HttpClient) {
    this.sendMailUrl = "https://dfgirshn9d.execute-api.us-west-2.amazonaws.com/default/sendMailDental";
    this.preSignUrl = " https://hg6x56ixcl.execute-api.us-west-2.amazonaws.com/default/createPresignedUrl";
    this.mailData = " https://j0fdbxbgja.execute-api.us-west-2.amazonaws.com/default/readMail";
  }

  getPreSignedUrl(name) {
    return this.http.post(this.preSignUrl, name);
  }

  getMailData(data) {
    return this.http.post(this.mailData, data);
  }

  saveDataS3(data: any, url: any) {
    return this.http.put(url, data);
  }

  sendMail(data: any) {
    return this.http.put(this.sendMailUrl, data);
  }
}
