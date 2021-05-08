import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { AccountService } from './../account.service';

@Component({
  selector: 'app-accountlogin',
  templateUrl: './accountlogin.component.html',
  styleUrls: ['./accountlogin.component.css']
})
export class AccountloginComponent implements OnInit {
  sending: boolean;

  constructor(private router: Router, private Service: AccountService) { }

  ngOnInit() {
    sessionStorage.removeItem('user');
    this.sending = false;
  }

  onSubmit = function (form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      this.invalidForm = true;
      return;
    }
    this.sending = true;
    const json: JSON = form.value;
    this.Service.loginAccountData(json)
      .subscribe(Response => {
        this.sending = false;
        if (!Response.user) {
          swal("Unable to signup,please try again");
          return;
        }
        sessionStorage.setItem('user', Response.user);
        sessionStorage.setItem("dentalId", Response.dentalId);
        this.router.navigate(['/mail/account']);
      }, error => {
        this.sending = false;
        if (error.status === 404)
          swal('E-Mail ID does not exists,please signup to continue');
        else if (error.status === 401)
          swal('Wrong Password,please try again');
        else
          swal('Unable to Login,please try again');
      });
  };
}

