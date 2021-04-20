import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-mail-inbox',
  templateUrl: './mail-inbox.component.html',
  styleUrls: ['./mail-inbox.component.css']
})
export class MailInboxComponent implements OnInit {
  private user = "mohdnihar@gmail.com"
  private type = "INC"
  private patientId = 0;
  private subUserId = 0;

  displayedColumns: string[] = ['MailFrom', 'subject', 'mailDateTime'];
  dataSource: any;

  constructor(private Service: EmailService) { }

  ngOnInit() {
    let data = { "user": this.user, "mailType": this.type, "pid": this.patientId, "sid": this.subUserId }
    this.Service.getMailData(data)
      .subscribe(Response => {
        if (Response) {
          this.dataSource = Response;
        }
        console.log(Response);
      }, error => {
        console.log(error);
        return null;
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
