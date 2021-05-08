import { contact, ContactService } from './../contact.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  private user = sessionStorage.getItem("user")
  data = { "user": this.user }
  shimmer = Array;
  loading = true;

  contacts: contact[] = [];
  displayedColumns: string[] = ['ContactfirstName', 'emailAddress', 'phoneNumber'];
  dataSource: MatTableDataSource<contact>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private Service: ContactService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.Service.readContactdata(this.data)
      .subscribe(Response => {
        console.log(Response);
        if (Response["users"]) {
          this.Service.updateContactData(Response["users"]);
          this.dataSource = new MatTableDataSource(this.Service.sharedContactData.value);
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


