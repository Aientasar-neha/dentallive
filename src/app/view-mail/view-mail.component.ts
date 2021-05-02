import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-view-mail',
  templateUrl: './view-mail.component.html',
  styleUrls: ['./view-mail.component.css']
})
export class ViewMailComponent implements OnInit {
  message: any;
  attachments = [];
  rhino: any;
  fromHtml = "";
  backLink = '/mail/inbox';


  private user = "mohdnihar@gmail.com"
  private type = "INC"
  data = { "user": this.user, "mailType": this.type, "type": 1 }

  constructor(private router: Router, private route: ActivatedRoute, private Service: EmailService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.get('type') == "sent") {
        this.data = { "user": this.user, "mailType": "OUT", "type": 1 };
        this.backLink = '/mail/sent';
      }

      if (params.get('id')) {
        let result = this.Service.sharedEmailData.value;
        if (result.length > 0) {
          this.message = result.find(t => t.messageId == params.get('id'));
          params.get('type') == "sent" ? this.fromHtml = "To : " + this.message.MailTo : this.fromHtml = "From : " + this.message.MailFrom.html;
          this.message.messageHTML ? this.message.htmlText = this.sanitizer.bypassSecurityTrustHtml(this.message.messageHTML) : this.message.htmlText = this.sanitizer.bypassSecurityTrustHtml(this.message.htmlText);
        }
        if (!this.message) {
          this.data.mailType = this.data.mailType + '#' + params.get('id');
          this.Service.readallMaildata(this.data)
            .subscribe(Response => {
              if (Response) {
                this.message = Response[0];
                params.get('type') == "sent" ? this.fromHtml = "To : " + this.message.MailTo : this.fromHtml = "From : " + this.message.MailFrom.html;
                this.message.messageHTML ? this.message.htmlText = this.sanitizer.bypassSecurityTrustHtml(this.message.messageHTML) : this.message.htmlText = this.sanitizer.bypassSecurityTrustHtml(this.message.htmlText);
              }
            }, error => {
              console.log(error);
              return null;
            })
        }
      } else {
        swal("unable to load message,please try again later");
        this.router.navigate(['/mail/inbox']);
      }
    });
  }
}
