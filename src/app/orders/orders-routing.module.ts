import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OrderListComponent} from './order-list/order-list.component';
import {OrderAddComponent} from './order-add/order-add.component';

const routes: Routes = [
  {
    path: 'add',
    component: OrderAddComponent
  },
  {
    path: '',
    component: OrderListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
