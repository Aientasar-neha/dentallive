import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { EmailService, mail } from '../email.service';

@Component({
  selector: 'app-mail-inbox',
  templateUrl: './mail-inbox.component.html',
  styleUrls: ['./mail-inbox.component.css']
})
export class MailInboxComponent implements OnInit, AfterViewInit {

  private user = sessionStorage.getItem("user")
  private type = "INC"
  private patientId = 0;
  private subUserId = 0;
  data = { "user": this.user, "mailType": this.type, "pid": this.patientId, "sid": this.subUserId, "type": 0 }
  shimmer = Array;
  loading = true;

  mails: mail[] = [];
  displayedColumns: string[] = ['MailFrom', 'subject', 'mailDateTime'];
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
        if (Response["mail"]) {
          this.Service.updateMailData(Response["mail"]);
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

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
