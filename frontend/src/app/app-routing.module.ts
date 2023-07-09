import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import AuthGuard from './guards/auth.guard';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { PasswordResetFormComponent } from './components/password-reset-form/password-reset-form.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { AdminComponent } from './components/admin/admin.component';
import { PasswordChangeFormComponent } from './components/password-change-form/password-change-form.component';
import { UnregisteredComponent } from './components/unregistered/unregistered.component';
import { ClientComponent } from './components/client/client.component';
import { NewObjectComponent } from './components/new-object/new-object.component';
import { AgencyReviewsComponent } from './components/agency-reviews/agency-reviews.component';
import { JobComponent } from './components/job/job.component';
import { SubmitJobComponent } from './components/submit-job/submit-job.component';
import { WorkersComponent } from './components/workers/workers.component';
import { AgencyJobsComponent } from './components/agency-jobs/agency-jobs.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminJobsComponent } from './components/admin-jobs/admin-jobs.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: { userType: ['unregistered'] },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
    data: { userType: ['unregistered'] },
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { userType: ['client', 'agency', 'admin'] },
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent,
    canActivate: [AuthGuard],
    data: { userType: ['unregistered'] },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordFormComponent,
    canActivate: [AuthGuard],
    data: { userType: ['unregistered'] },
  },
  {
    path: 'reset-password',
    component: PasswordResetFormComponent,
    canActivate: [AuthGuard],
    data: { userType: ['unregistered'] },
  },
  {
    path: 'change-password',
    component: PasswordChangeFormComponent,
    canActivate: [AuthGuard],
    data: { userType: ['client', 'agency', 'admin'] },
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { userType: ['admin'] },
  },
  {
    path: 'agencies',
    component: UnregisteredComponent,
    canActivate: [AuthGuard],
    data: { userType: ['unregistered', 'client'] },
  },
  {
    path: 'agency-reviews',
    component: AgencyReviewsComponent,
    canActivate: [AuthGuard],
    data: { userType: ['client', 'unregistered'] },
  },
  {
    path: 'objects',
    component: ClientComponent,
    canActivate: [AuthGuard],
    data: { userType: ['client'] },
  },
  {
    path: 'new-object',
    component: NewObjectComponent,
    canActivate: [AuthGuard],
    data: { userType: ['client'] },
  },
  {
    path: 'jobs',
    component: JobComponent,
    canActivate: [AuthGuard],
    data: { userType: ['client'] },
  },
  {
    path: 'agency-jobs',
    component: AgencyJobsComponent,
    canActivate: [AuthGuard],
    data: { userType: ['agency'] },
  },
  {
    path: 'submit-job',
    component: SubmitJobComponent,
    canActivate: [AuthGuard],
    data: { userType: ['client'] },
  },
  {
    path: 'workers',
    component: WorkersComponent,
    canActivate: [AuthGuard],
    data: { userType: ['agency'] },
  },
  {
    path: 'admin-users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard],
    data: { userType: ['admin'] },
  },
  {
    path: 'admin-jobs',
    component: AdminJobsComponent,
    canActivate: [AuthGuard],
    data: { userType: ['admin'] },
  },

  { path: '**', redirectTo: '' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
