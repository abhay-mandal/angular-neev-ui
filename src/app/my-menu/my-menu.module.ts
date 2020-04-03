import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyMenuRoutingModule } from './my-menu-routing.module';
import { MyMenuComponent } from './my-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MyMenuComponent],
  imports: [
    CommonModule,
    MyMenuRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class MyMenuModule { }
