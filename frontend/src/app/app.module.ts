import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import AuthGuard from './guards/auth.guard';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { PasswordResetFormComponent } from './components/password-reset-form/password-reset-form.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { AdminComponent } from './components/admin/admin.component';
import { PasswordChangeFormComponent } from './components/password-change-form/password-change-form.component';
import { UnregisteredComponent } from './components/unregistered/unregistered.component';
import { ClientComponent } from './components/client/client.component';
import { ObjectComponent } from './components/object/object.component';
import { NewObjectComponent } from './components/new-object/new-object.component';
import { AgencyReviewsComponent } from './components/agency-reviews/agency-reviews.component';
import { JobComponent } from './components/job/job.component';
import { SubmitJobComponent } from './components/submit-job/submit-job.component';
import { WorkersComponent } from './components/workers/workers.component';
import { AgencyJobsComponent } from './components/agency-jobs/agency-jobs.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminJobsComponent } from './components/admin-jobs/admin-jobs.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    AdminLoginComponent,
    PasswordResetFormComponent,
    ForgotPasswordFormComponent,
    AdminComponent,
    PasswordChangeFormComponent,
    UnregisteredComponent,
    ClientComponent,
    ObjectComponent,
    NewObjectComponent,
    AgencyReviewsComponent,
    JobComponent,
    SubmitJobComponent,
    WorkersComponent,
    AgencyJobsComponent,
    FooterComponent,
    AdminUsersComponent,
    AdminJobsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
    }),
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
