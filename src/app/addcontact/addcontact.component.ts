import { ContactService } from './../contact.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.component.html',
  styleUrls: ['./addcontact.component.css']
})
export class AddcontactComponent implements OnInit {

  edit: boolean;
  picData: any;
  imageSrc: string;
  sending: boolean;
  id: any;
  removeImage: boolean;
  contact: any;
  imageName: string;
  private user = sessionStorage.getItem("user")

  constructor(private router: Router, private Service: ContactService, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.edit = false;
    this.sending = false;
    this.removeImage = false;
    this.id = null;

    this.contact = {
      ContactfirstName: "",
      ContactlastName: "",
      emailAddress: "",
      phoneNumber: ""
    };

    this.route.paramMap.subscribe(params => {
      if (params.get('id') && params.get('id') != "") {
        this.sending = true;
        let result = this.Service.sharedContactData.value;
        if (result.length > 0) {
          let Response = result.find(t => t.contactId == params.get('id'));
          Object.keys(Response).forEach(key => {
            if (key in this.contact)
              this.contact[key] = Response[key];
          });
          this.changeDetectorRef.detectChanges();
          this.setValue(Response);
        }
        if (result.length == 0) {
          let data = { "user": this.user, "contactId": params.get('id') }
          this.Service.readContactdata(data)
            .subscribe(Response => {
              if (Response['user']) {
                Object.keys(Response['user']).forEach(key => {
                  if (key in this.contact)
                    this.contact[key] = Response['user'][key];
                });
                this.changeDetectorRef.detectChanges();
                this.setValue(Response['user']);
              }
            }, error => {
              console.log(error);
              return null;
            })
        }
      }
    });
  }

  setValue(contact) {
    this.changeDetectorRef.detectChanges();
    this.id = contact.contactId;
    this.edit = true;
    this.imageName = contact.imageSrc

    if (contact.imageSrc) {
      this.Service.getPreSignedUrl(contact.imageSrc, 'get', "dentallive-contacts")
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
    this.Service.getPreSignedUrl(name, 'put', "dentallive-contacts")
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
    json['loggedUser'] = this.user;

    if (newImagename)
      json['imageSrc'] = newImagename;
    else if (this.removeImage)
      json['imageSrc'] = "";
    else if (this.imageName)
      json['imageSrc'] = this.imageName;
    else
      json['imageSrc'] = "";

    this.id = this.id ? this.id : uuidv4();
    json['contactId'] = this.id;
    this.Service.saveContact(json)
      .subscribe(Response => {
        this.edit ? swal("Contact data updated succesfully") : swal("Contact data saved succesfully");
        this.sending = false;
        this.id = null;
        this.router.navigate(['/mail/contacts']);
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

  deleteItem() {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this contact!",
      icon: "warning",
      buttons: ["No", "Yes"],
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.sending = true;
          let data = { "user": this.user, "contactId": this.id }
          this.Service.deleteContactdata(data).subscribe(Response => {
            swal("Contact deleted succesfully")
            this.sending = false;
            this.id = null;
            this.router.navigate(['/mail/contacts']);
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
