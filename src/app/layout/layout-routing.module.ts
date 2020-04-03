import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { AuthGuard } from '../core/auth-guard/auth.guard';
import { AppConstants } from '@app/app.constants';
const routes: Routes = [
  {
    path: '',
    redirectTo: `/${AppConstants.APP_URLS.PAGE}/${AppConstants.DEFAULT_PAGE_ID}`,
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'create-card', loadChildren: '@app/create-card/create-card.module#CreateCardModule' },
      { path: 'page/:pageId', loadChildren: '@app/page-container/page-container.module#PageContainerModule' },
      { path: 'my-menu', loadChildren: '@app/my-menu/my-menu.module#MyMenuModule' },
      { path: 'create-page', loadChildren: '@app/create-page/create-page.module#CreatePageModule' },
      { path: 'menu', loadChildren: '@app/menu/menu.module#MenuModule' }
    ]
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: 'signup', loadChildren: '../sign-up/sign-up.module#SignUpModule' },
      { path: 'signin', loadChildren: '../sign-in/sign-in.module#SignInModule' },
      { path: 'forgot-password', loadChildren: '../forgot-password/forgot-password.module#ForgotPasswordModule' },
      { path: 'reset-password', loadChildren: '../reset-password/reset-password.module#ResetPasswordModule' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LayoutRoutingModule { }
