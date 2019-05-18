import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAddComponent } from './order-add.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ImageCropperModule} from 'ngx-image-cropper';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from "@angular/common";
import {OrdersRoutingModule} from "../orders-routing.module";
import {FilesModule} from "../../files/files.module";
import {OrderService} from "../shared/order.service";
import {Observable, of} from "rxjs";
import {Order} from "../shared/order.model";
import {OrderListComponent} from "../order-list/order-list.component";
import {FileService} from "../../files/shared/file.service";

describe('OrderAddComponent', () => {
  let component: OrderAddComponent;
  let fixture: ComponentFixture<OrderAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAddComponent, OrderListComponent ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        ImageCropperModule,
      ],
      providers: [
        {
          provide: OrderService, useClass: OrderServiceTest
        },
        {
          provide: FileService, useClass: FileServiceTest
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

class OrderServiceTest
{
  getOrders(): Observable<Order[]> {
    return of([]);
  }
}

class FileServiceTest
{

}
