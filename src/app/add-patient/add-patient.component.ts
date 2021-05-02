import { Component, OnInit, ViewChild } from '@angular/core';
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

  edit = false;
  picData: any;
  imageSrc: string;
  sending = false;
  id: any;
  freeze = false;
  touched = false;
  removeImage = false;

  private user = "mohdnihar@gmail.com"
  @ViewChild(NgForm, { static: false }) mainForm: NgForm;

  constructor(private router: Router, private Service: EmailService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('id') && params.get('id') != "") {
        let result = this.Service.sharedPatientData.value;
        let patient;
        if (result.length > 0) {
          patient = result.find(t => t.patientId == params.get('id'));
          this.setValue(patient);
        }
        if (!patient) {
          let data = { "user": this.user, "patientId": params.get('id') }
          this.Service.readPatientdata(data)
            .subscribe(Response => {
              if (Response) {
                patient = Response;
                this.setValue(patient);
              }
            }, error => {
              console.log(error);
              return null;
            })
        }
      } else {
        swal("unable to load patient,please try again later");
        this.router.navigate(['/mail/patients']);
      }
    });
  }

  setValue(patient) {
    Object.keys(this.mainForm.controls).forEach(key => {
      if (patient[key])
        this.mainForm.controls[key].setValue(patient[key]);
    });
    this.id = patient.patientId;
    this.edit = true;
    this.freeze = patient.freeze;
    this.touched = patient.touched ? patient.touched : false;

    if (patient.imageSrc) {
      this.Service.getPreSignedUrl(patient.imageSrc, 'get', "dentallive-patients")
        .subscribe(Response => {
          if (Response["url"]) {
            this.imageSrc = Response["url"];
          }
        });
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
    else
      json['imageSrc'] = this.imageSrc;

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
        //this.router.navigate(['/mail/patients']);
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
          let data = { "user": this.user, "patientId": this.id, "freeze": status }
          this.Service.freezePatientdata(data).subscribe(Response => {
            swal("Patient data updated succesfully");
            this.sending = false;
            this.id = null;
            //this.router.navigate(['/mail/patients']);
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
      text: "Once deleted, you will not be able to recover this patient!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          let data = { "user": this.user, "patientId": this.id }
          this.Service.deletePatientdata(data).subscribe(Response => {
            swal("Patient deleted succesfully")
            this.sending = false;
            this.id = null;
            //this.router.navigate(['/mail/patients']);
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
