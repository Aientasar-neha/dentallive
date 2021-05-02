import { AddPatientComponent } from './add-patient/add-patient.component';
import { MailSentComponent } from './mail-sent/mail-sent.component';
import { AccountComponent } from './account/account.component';
import { PatientsComponent } from './patients/patients.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ViewAttachmentComponent } from './view-attachment/view-attachment.component';
import { DentalLiveMailMainComponent } from './dental-live-mail-main/dental-live-mail-main.component';
import { ViewMailComponent } from './view-mail/view-mail.component';
import { LandingHomeComponent } from './landing-home/landing-home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailInboxComponent } from './mail-inbox/mail-inbox.component';
import { VideojsRecordComponent } from './videojs-record/videojs-record.component';


const routes: Routes = [
  { path: '', component: LandingHomeComponent },
  {
    path: 'mail',
    component: DentalLiveMailMainComponent,
    children: [
      { path: '', component: MailInboxComponent },
      { path: 'compose', component: VideojsRecordComponent },
      { path: 'inbox', component: MailInboxComponent },
      { path: 'sent', component: MailSentComponent },
      { path: 'view/:type/:id', component: ViewMailComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'patients/patient', component: AddPatientComponent },
      { path: 'patients/patient/:id', component: AddPatientComponent },
      { path: 'account', component: AccountComponent },
    ]
  },
  { path: 'file/:key', component: ViewAttachmentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
