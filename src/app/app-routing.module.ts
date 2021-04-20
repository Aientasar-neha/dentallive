import { LandingHomeComponent } from './landing-home/landing-home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailInboxComponent } from './mail-inbox/mail-inbox.component';
import { VideojsRecordComponent } from './videojs-record/videojs-record.component';


const routes: Routes = [
  { path: '', component: LandingHomeComponent },
  { path: 'compose', component: VideojsRecordComponent },
  { path: 'inbox', component: MailInboxComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
