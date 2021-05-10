import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { AccountService } from './../account.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  sending: boolean;

  constructor(private router: Router, private Service: AccountService) { }

  ngOnInit() {
    this.sending = false;
  }

  onSubmit = function (form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      this.invalidForm = true;
      return;
    }
    this.sending = true;
    let json: JSON = form.value;
    this.Service.forgetPasswordData(json)
      .subscribe(Response => {
        this.sending = false;
        this.router.navigate(['/reset', json['emailAddress']]);
      }, error => {
        this.sending = false;
        console.log(error);
        console.log(error.errorMessage);
        if (error.status == 404)
          swal("E-Mail ID does not exists,please signup to continue")
        else
          swal("Unable to reset password,please try again");
      })
  }
}

