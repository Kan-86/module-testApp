import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable, Subscription} from 'rxjs';
import {OrderService} from '../shared/order.service';
import {Order} from '../shared/order.model';
import {FormControl, FormGroup} from '@angular/forms';
import {FileService} from '../../files/shared/file.service';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {

  orders: Observable<Order[]>;


  constructor(private fs: FileService,
              private os: OrderService) {
  }

  ngOnInit() {
    this.orders = this.os.getOrders()
      .pipe(
        tap(orders => {
          orders.forEach(order => {
            if (order.pictureId) {
              this.fs.getFileUrl(order.pictureId)
                .subscribe(url => {
                  order.url = url;
                });
            }
          });
        })
      );
  }

  deleteOrder(order: Order) {
    const obs = this.os.deleteOrder(order.id);
      obs.subscribe( oerderFromFireBase => {
        window.alert('Order with id: ' + order.id + ' and name: ' + order.name + ' is Deleted');
      }, error1 => {
        window.alert('Order not found id: ' + order.id);
      });
  }
}
