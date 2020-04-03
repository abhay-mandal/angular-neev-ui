import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePageComponent } from './create-page.component';
import { AuthGuard } from '@app/core/auth-guard/auth.guard';


const routes: Routes = [
  { path: '', component: CreatePageComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreatePageRoutingModule { }
