import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FilesModule } from '../files/files.module';
import { OrderAddComponent } from './order-add/order-add.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [OrderListComponent, OrderAddComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    ReactiveFormsModule,
    FilesModule,
    ImageCropperModule,
    RouterModule,
  ]
})
export class OrdersModule { }
