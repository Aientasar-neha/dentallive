import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { AccountService } from './../account.service';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.css']
})
export class PasswordresetComponent implements OnInit {
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
    this.Service.loginAccountData(json)
      .subscribe(Response => {
        this.sending = false;
        this.router.navigate(['/mail/compose']);
      }, error => {
        this.sending = false;
        if (error.status == 404)
          swal("E-Mail ID does not exists,please signup to continue")
        else if (error.status == 401)
          swal("Wrong Password,please try again");
        else
          swal("Unable to signup,please try again");
      })
  }
}

