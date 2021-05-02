import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { EmailService } from '../email.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  edit: boolean;
  picData: any;
  imageSrc: string;
  sending: boolean;
  id: any;
  freeze: boolean;
  touched: boolean;
  removeImage: boolean;
  patient: any;
  imageName: string;
  private user = "mohdnihar@gmail.com"

  constructor(private router: Router, private Service: EmailService, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.edit = false;
    this.sending = false;
    this.freeze = false;
    this.touched = false;
    this.removeImage = false;
    this.id = null;
    this.patient = {
      PatientfirstName: "",
      PatientlastName: "",
      emailAddress: "",
      phoneNumber: ""
    };
    this.route.paramMap.subscribe(params => {
      if (params.get('id') && params.get('id') != "") {
        this.sending = true;
        let result = this.Service.sharedPatientData.value;
        if (result.length > 0) {
          let Response = result.find(t => t.patientId == params.get('id'));
          Object.keys(Response).forEach(key => {
            if (key in this.patient)
              this.patient[key] = Response[key];
          });
          this.changeDetectorRef.detectChanges();
          this.setValue(Response);
        }
        if (result.length == 0) {
          let data = { "user": this.user, "patientId": params.get('id') }
          this.Service.readPatientdata(data)
            .subscribe(Response => {
              if (Response) {
                Object.keys(Response).forEach(key => {
                  if (key in this.patient)
                    this.patient[key] = Response[key];
                });
                this.changeDetectorRef.detectChanges();
                this.setValue(Response);
              }
            }, error => {
              console.log(error);
              return null;
            })
        }
      }
    });
  }

  setValue(patient) {
    this.changeDetectorRef.detectChanges();
    this.id = patient.patientId;
    this.edit = true;
    this.freeze = patient.freeze;
    this.touched = patient.touched ? patient.touched : false;
    this.imageName = patient.imageSrc

    if (patient.imageSrc) {
      this.Service.getPreSignedUrl(patient.imageSrc, 'get', "dentallive-patients")
        .subscribe(Response => {
          this.sending = false;
          if (Response["url"]) {
            this.imageSrc = Response["url"];
          }
        });
    } else {
      this.sending = false;
    }
  }

  saveFile(elem, form: NgForm) {
    let name = uuidv4() + ".jpg"
    this.Service.getPreSignedUrl(name, 'put', "dentallive-patients")
      .subscribe(Response => {
        if (!Response || !Response['url'])
          return swal("Error saving data,please try again");
        this.Service.saveDataS3(elem, Response['url'])
          .subscribe(Response_nested => {
            console.log(Response_nested);
            this.savetoDB(name, form);
          }, error => {
            console.log(error);
            swal("Error saving data,please try again");
            this.sending = false;
          })
      }, error => {
        console.log(error);
        swal("Error saving data,please try again");
        this.sending = false;
      })
  }

  savetoDB(newImagename, form: NgForm) {
    let json: JSON = form.value;

    if (newImagename)
      json['imageSrc'] = newImagename;
    else if (this.removeImage)
      json['imageSrc'] = "";
    else if (this.imageName)
      json['imageSrc'] = this.imageName;
    else
      json['imageSrc'] = "";

    if (!this.edit)
      json['touched'] = false;

    this.id = this.id ? this.id : uuidv4();
    json['patientId'] = this.id;
    json['freeze'] = false;
    this.Service.savePatient(json)
      .subscribe(Response => {
        this.edit ? swal("Patient data updated succesfully") : swal("Patient data saved succesfully");
        this.sending = false;
        this.id = null;
        this.router.navigate(['/mail/patients']);
      }, error => {
        console.log(error);
        swal("Error saving data,please try again");
        this.sending = false;
        this.id = null;
      })
  }

  loadFiles = function (event) {
    if (event.target.files.length > 0) {
      this.picData = event.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(this.picData);
      this.removeImage = false;
    }
  }

  removeFile() {
    this.picData = null;
    this.imageSrc = null;
    this.removeImage = true;
  }

  onSubmit = function (form: NgForm) {
    console.log('hi');
    if (form.invalid) {
      form.form.markAllAsTouched();
      this.invalidForm = true;
      return;
    }
    this.sending = true;
    if (!this.picData)
      this.savetoDB(null, form);
    else
      this.saveFile(this.picData, form);
  }

  freezeItem(status: boolean) {
    swal({
      title: "Are you sure?",
      text: "Do you want to freeze this patient!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.sending = true;
          let data = { "user": this.user, "patientId": this.id, "freeze": status }
          this.Service.freezePatientdata(data).subscribe(Response => {
            swal("Patient data updated succesfully");
            this.sending = false;
            this.id = null;
            this.router.navigate(['/mail/patients']);
          }, error => {
            console.log(error);
            swal("Error saving data,please try again");
            this.sending = false;
            this.id = null;
          })
        }
      });
  }

  deleteItem() {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this patient!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.sending = true;
          let data = { "user": this.user, "patientId": this.id }
          this.Service.deletePatientdata(data).subscribe(Response => {
            swal("Patient deleted succesfully")
            this.sending = false;
            this.id = null;
            this.router.navigate(['/mail/patients']);
          }, error => {
            console.log(error);
            swal("Error saving data,please try again");
            this.sending = false;
            this.id = null;
          })
        }
      });
  }
}
