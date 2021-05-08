import { account, AccountService } from './../account.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  private user = sessionStorage.getItem("user")
  data = { "user": this.user }
  shimmer = Array;
  loading = true;

  accounts: account[] = [];
  displayedColumns: string[] = ['AccountfirstName', 'emailAddress', 'phoneNumber'];
  dataSource: MatTableDataSource<account>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private Service: AccountService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.Service.readAccountdata(this.data)
      .subscribe(Response => {
        console.log(Response);
        if (Response) {
          this.Service.updateAccountData(Response);
          this.dataSource = new MatTableDataSource(this.Service.sharedAccountData.value);
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



