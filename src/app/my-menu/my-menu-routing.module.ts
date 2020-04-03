import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/core/auth-guard/auth.guard';
import { MyMenuComponent } from './my-menu.component';

const routes: Routes = [
  { path: '', component: MyMenuComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyMenuRoutingModule { }
