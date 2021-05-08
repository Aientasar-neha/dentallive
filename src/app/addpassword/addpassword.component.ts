import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { AccountService } from './../account.service';

@Component({
  selector: 'app-addpassword',
  templateUrl: './addpassword.component.html',
  styleUrls: ['./addpassword.component.css']
})
export class AddpasswordComponent implements OnInit {

  sending: boolean;
  private user = sessionStorage.getItem("user")

  constructor(private router: Router, private Service: AccountService, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) { }

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
    json['type'] = 1;
    json['emailAddress'] = this.user;

    this.Service.updateAccountdata(json)
      .subscribe(Response => {
        swal("Password updated succesfully")
        this.sending = false;
        this.router.navigate(['/mail/accounts']);
      }, error => {
        console.log(error);
        if (error.status == 401) {
          swal("Old password incorrect,please enter correct password");
          this.sending = false;
          return;
        }
        error.status == 404 ? swal("User not found") : swal("Error saving data,please try again");;
        this.sending = false;
      })
  }
}
