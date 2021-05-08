import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { AccountService } from '../account.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-accountsignup',
  templateUrl: './accountsignup.component.html',
  styleUrls: ['./accountsignup.component.css']
})
export class AccountsignupComponent implements OnInit {
  sending: boolean;

  constructor(private router: Router, private Service: AccountService) { }

  ngOnInit() {
    this.sending = false;
  }

  onSubmit = function (form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      this.invalidForm = true;
      form.form['classList'].add('was-validated')
      return;
    }
    this.sending = true;
    let json: JSON = form.value;
    json["dentalId"] = uuidv4();
    this.Service.saveAccount(json)
      .subscribe(Response => {
        this.sending = false;
        if (!Response.user) {
          swal("Unable to signup,please try again");
          return;
        }
        sessionStorage.setItem("user", Response.user);
        sessionStorage.setItem("dentalId", Response.dentalId);
        swal("Your account has been created succesfully");
        this.router.navigate(['/mail/account']);
      }, error => {
        this.sending = false;
        if (error.status == 409)
          swal("E-Mail ID exists already,please login to continue")
        else
          swal("Unable to signup,please try again");
      })
  }
}
