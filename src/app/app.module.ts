import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideojsRecordComponent } from './videojs-record/videojs-record.component';
import { HttpClientModule } from '@angular/common/http';
import { EmailService } from './email.service';
import { DentalLiveMailMainComponent } from './dental-live-mail-main/dental-live-mail-main.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MailInboxComponent } from './mail-inbox/mail-inbox.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LandingHomeComponent } from './landing-home/landing-home.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ViewMailComponent } from './view-mail/view-mail.component';
import { ViewAttachmentComponent } from './view-attachment/view-attachment.component';
import { NgxShimmerLoadingModule } from 'ngx-shimmer-loading';
import { MatSortModule } from '@angular/material';
import { ContactsComponent } from './contacts/contacts.component';
import { PatientsComponent } from './patients/patients.component';
import { AccountComponent } from './account/account.component';
import { MailSentComponent } from './mail-sent/mail-sent.component';
import { AddPatientComponent } from './add-patient/add-patient.component';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    AppComponent,
    VideojsRecordComponent,
    DentalLiveMailMainComponent,
    MailInboxComponent,
    LandingHomeComponent,
    ViewMailComponent,
    ViewAttachmentComponent,
    ContactsComponent,
    PatientsComponent,
    AccountComponent,
    MailSentComponent,
    AddPatientComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    AngularFontAwesomeModule,
    NgxShimmerLoadingModule,
    MatSortModule
  ],
  providers: [
    EmailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
