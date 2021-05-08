import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { v4 as uuidv4 } from 'uuid';
import { AccountService } from './../account.service';

@Component({
  selector: 'app-addaccount',
  templateUrl: './addaccount.component.html',
  styleUrls: ['./addaccount.component.css']
})

export class AddaccountComponent implements OnInit {

  picData: any;
  imageSrc: string;
  sending: boolean;
  removeImage: boolean;
  account: any;
  imageName: string;
  private user = sessionStorage.getItem("user")

  constructor(private router: Router, private Service: AccountService, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) { }


  ngOnInit() {
    this.sending = false;
    this.removeImage = false;

    this.account = {
      accountfirstName: "",
      accountlastName: "",
      dob: "",
      phoneNumber: ""
    };

    let data = { "user": this.user }
    this.sending = true;
    this.Service.readAccountdata(data)
      .subscribe(Response => {
        console.log(Response['user']);
        if (Response['user']) {
          Object.keys(Response['user']).forEach(key => {
            if (key in this.account)
              this.account[key] = Response['user'][key];
          });
          this.changeDetectorRef.detectChanges();
          this.setValue(Response);
        }
      }, error => {
        swal("No User exists");
        this.router.navigate(['/mail/inbox']);
      })
  }

  setValue(account) {
    this.changeDetectorRef.detectChanges();
    this.imageName = account.imageSrc

    if (account.imageSrc) {
      this.Service.getPreSignedUrl(account.imageSrc, 'get', "dentallive-accounts")
        .subscribe(Response => {
          this.sending = false;
          if (Response["url"]) {
            this.imageSrc = Response["url"];
            this.sending = false;
          }
        });
    } else {
      this.sending = false;
    }
  }

  saveFile(elem, form: NgForm) {
    let name = uuidv4() + ".jpg"
    this.Service.getPreSignedUrl(name, 'put', "dentallive-accounts")
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
    json['type'] = 0;
    json['emailAddress'] = this.user;

    if (newImagename)
      json['imageSrc'] = newImagename;
    else if (this.removeImage)
      json['imageSrc'] = "";
    else if (this.imageName)
      json['imageSrc'] = this.imageName;
    else
      json['imageSrc'] = "";

    this.Service.updateAccountdata(json)
      .subscribe(Response => {
        swal("Account data updated succesfully")
        this.sending = false;
        this.router.navigate(['/mail/accounts']);
      }, error => {
        console.log(error);
        error.status == 404 ? swal("User not found") : swal("Error saving data,please try again");;
        this.sending = false;
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
}
