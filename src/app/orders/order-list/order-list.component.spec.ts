import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListComponent } from './order-list.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ImageCropperModule} from "ngx-image-cropper";
import {RouterTestingModule} from "@angular/router/testing";
import {CommonModule} from "@angular/common";
import {OrdersRoutingModule} from "../orders-routing.module";
import {FilesModule} from "../../files/files.module";
import {OrderService} from "../shared/order.service";
import {FileService} from "../../files/shared/file.service";
import {OrderAddComponent} from "../order-add/order-add.component";
import {Observable, of} from "rxjs";
import {Order} from "../shared/order.model";
import {By} from "@angular/platform-browser";
import {Component} from "@angular/core";

describe('OrderListComponent', () =>
{
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;
  let helper = new Helper();
  let dh: DOMHelper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderListComponent, OrderAddComponent ],
      imports: [
        CommonModule,
        OrdersRoutingModule,
        ReactiveFormsModule,
        FilesModule,
        ImageCropperModule,
        RouterTestingModule.withRoutes(
          [
            { path: 'add', component: DummyComponent }
          ]
        )
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
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    helper = new Helper();
    dh = new DOMHelper(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain H2 tag', () =>
  {
    expect(dh.singleText('h2'))
      .toBe('List all Orders')
  });

  it('Should minimum be one button on the page',  ()=>
  {
    expect(dh.count('button')).toBeGreaterThanOrEqual(1);
  });

  it('Should be a + button first on the page',  () =>
  {
    expect(dh.singleText('button')).toBe('+');
  });

  it('should navigate to / before + button click',  () =>
  {
    const location = TestBed.get(Location);
    expect(location.path()).toBe('');
  });

  it('should navigate to /add on + button click', function () {
    const location = TestBed.get(Location);
    const buttons =fixture.debugElement.queryAll(By.css('button'));
    const nativeButton: HTMLButtonElement = buttons[0].nativeElement;
    nativeButton.click();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(location.path()).toBe('/add');
    })
  });

  it('should show one Unordered List Item', () =>
  {
    expect(dh.count('ul')).toBe(1);
  });

  it('should show no list item when no orders are available', ()=>
  {
    expect(dh.count('li')).toBe(0);
  });

  it('should show one list item', ()  =>
  {
    fixture.detectChanges();
    expect(dh.count('li')).toBe(1);
  });

  it('should show one list item when I have one order',  () =>
  {
    component.orders = helper.getOrders(1);
    fixture.detectChanges();
    expect(dh.count('li')).toBe(1);
  });

  it('should show 100 list item when I have 100 orders',  () =>
  {
    component.orders = helper.getOrders(100);
    fixture.detectChanges();
    const listItem = fixture.debugElement
      .queryAll(By.css('li'));
    expect(listItem.length).toBe(100);
  });

  it('Should show 5 order names and ids in spans', () =>
  {
    component.orders = helper.getOrders(5);
    fixture.detectChanges();
    for (let i = 0; i < 5; i++)
    {
      const product = helper.orders[i];
      expect(dh.countText('span', product.name + ' -- ' + product.id))
        .toBe(1);
    }
});

@Component({template: ''})
class DummyComponent
{

}

class OrderServiceTest
{
  getOrders(): Observable<Order[]> {
    return of([]);
  }
}

class FileServiceTest
{

}

class Helper
{
  orders: Order[] = [];
  getOrders(amount: number): Observable<Order[]>
  {
    for (let i = 0; i < amount; i++)
    {
      this.orders.push(
        {id: 'abc' + i, name: 'item' + i, pictureId: 'abc' + i}
      );
    }
    return of(this.orders);
  }
}

class DOMHelper {
  private fixture: ComponentFixture<OrderListComponent>

  constructor(fixture: ComponentFixture<OrderListComponent>) {
    this.fixture = fixture;
  }

  singleText(tagName: string): string {
    const h2ele = this.fixture.debugElement.query(By.css(tagName));
    if (h2ele) {
      return h2ele.nativeElement.textContent
    }
  }

  count(tagName: string): number {
    const elements = this.fixture.debugElement
      .queryAll(By.css(tagName));
    return elements.length;
  }

  countText(tagName: string, text: string): number
  {
    const elements = this.fixture.debugElement
      .queryAll(By.css(tagName));
    return elements.filter(element =>
      element.nativeElement.textContent === text).length;
  }
}
