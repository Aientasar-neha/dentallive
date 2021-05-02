import { patient } from './../email.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { EmailService } from '../email.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  private user = "mohdnihar@gmail.com"
  data = { "user": this.user }
  shimmer = Array;
  loading = true;

  patients: patient[] = [];
  displayedColumns: string[] = ['PatientfirstName', 'emailAddress', 'phoneNumber'];
  dataSource: MatTableDataSource<patient>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private Service: EmailService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.Service.readPatientdata(this.data)
      .subscribe(Response => {
        console.log(Response);
        if (Response) {
          this.Service.updatePatientData(Response);
          this.dataSource = new MatTableDataSource(this.Service.sharedPatientData.value);
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


