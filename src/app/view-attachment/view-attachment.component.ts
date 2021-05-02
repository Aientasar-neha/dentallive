import { Component, OnInit, Sanitizer } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import { EmailService } from '../email.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-view-attachment',
  templateUrl: './view-attachment.component.html',
  styleUrls: ['./view-attachment.component.css']
})

export class ViewAttachmentComponent implements OnInit {

  fileUrl: any;

  constructor(private route: ActivatedRoute, private Service: EmailService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fileUrl = "";
    this.route.paramMap.subscribe(params => {
      if (params.get('key')) {
        this.Service.getPreSignedUrl(params.get('key'), 'get')
          .subscribe(Response => {
            if (Response["url"]) {
              this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(Response["url"]);
            } else {
              swal("unable to load message,please try again later");
            }
          }, error => {
            swal("unable to load message,please try again later");
          });
      } else {
        swal("unable to load message,please try again later");
      }
    });
  }
}
