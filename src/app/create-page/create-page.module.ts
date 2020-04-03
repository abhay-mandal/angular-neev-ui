import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CreatePageRoutingModule } from './create-page-routing.module';
import { CreatePageComponent } from './create-page.component';


@NgModule({
  declarations: [CreatePageComponent],
  imports: [
    CommonModule,
    CreatePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class CreatePageModule { }
