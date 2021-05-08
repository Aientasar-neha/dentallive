import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface patient {
  pk: string,
  sk: string,
  PatientfirstName: string,
  PatientlastName: string,
  emailAddress: string,
  freeze: string,
  imageSrc: string,
  patientId: string,
  phoneNumber: string,
}

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  sharedPatientData: BehaviorSubject<Array<patient>> = new BehaviorSubject([]);

  preSignUrl: string;
  putPatient: string;
  readPatient: string;
  freezePatient: string;
  deletePatient: string;

  constructor(private http: HttpClient) {
    this.preSignUrl = "https://hg6x56ixcl.execute-api.us-west-2.amazonaws.com/default/createPresignedUrl";
    this.putPatient = "https://ox99w7el85.execute-api.us-west-2.amazonaws.com/default/putPatient";
    this.readPatient = "https://cigdcnww72.execute-api.us-west-2.amazonaws.com/default/getPatient";
    this.freezePatient = "https://hcnkq3nlj2.execute-api.us-west-2.amazonaws.com/default/freezePatient";
    this.deletePatient = "https://n5x6iuqelc.execute-api.us-west-2.amazonaws.com/default/deletePatient";
  }

  readPatientdata(data) {
    return this.http.post(this.readPatient, data);
  }

  getPreSignedUrl(name, type, storage = null) {
    if (!storage)
      storage = "dentalmail-attachments";
    let data = { "name": name, 'type': type, "storage": storage }
    return this.http.post(this.preSignUrl, data);
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

  updatePatientData(message: any) {
    this.sharedPatientData.next(message)
  }

  saveDataS3(data: any, url: any) {
    return this.http.put(url, data);
  }

}
