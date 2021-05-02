import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { mail } from '../email.model';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-mail-sent',
  templateUrl: './mail-sent.component.html',
  styleUrls: ['./mail-sent.component.css']
})
export class MailSentComponent implements OnInit {

  private user = "mohdnihar@gmail.com"
  private type = "OUT"
  private patientId = 0;
  private subUserId = 0;
  data = { "user": this.user, "mailType": this.type, "pid": this.patientId, "sid": this.subUserId, "type": 0 }
  shimmer = Array;
  loading = true;

  mails: mail[] = [];
  displayedColumns: string[] = ['MailTo', 'subject', 'mailDateTime'];
  dataSource: MatTableDataSource<mail>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private Service: EmailService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.Service.readallMaildata(this.data)
      .subscribe(Response => {
        console.log(Response);
        if (Response) {
          this.Service.updateMailData(Response);
          this.dataSource = new MatTableDataSource(this.Service.sharedEmailData.value);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.loading = false;
        }
      }, error => {
        console.log(error);
        return null;
      })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
