import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {Order} from './order.model';
import {first, map, switchMap, tap} from 'rxjs/operators';
import {error} from 'selenium-webdriver';
import {ImageMetadata} from '../../files/shared/image-metadata';
import {FileService} from '../../files/shared/file.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFirestore,
              private fs: FileService) { }

  getOrders(): Observable<Order[]> {
    return this.db.collection<Order>('orders').snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Order;
            return {id: action.payload.doc.id
              , name: data.name
            , pictureId: data.pictureId};
          });
        })
      );
  }

  deleteOrder(id: string): Observable<Order> {
    return this.db.doc<Order>('orders/' + id)
      .get().pipe(
        first(),
        tap(orderDocument => {
        }),
        switchMap(orderDocument => {
          if (!orderDocument || !orderDocument.data()) {
            throw new Error('Not found');
          } else {
            return from(
              this.db.doc<Order>('orders/' + id)
                .delete()
            ).pipe(
              map(() => {
                return orderDocument.data() as Order;
              })
            );
          }
        })
    );
    /*return Observable.create(obs => {
      this.db.doc<Order>('orders/' + id)
        .delete()
        .then(() => obs.next())
        .catch(err => obs.errback())
        .finally(() => obs.complete);
    });*/
    /*return this.db.doc<Order>('orders/' + id)
      .delete();*/
  }

  addOrderWithImage(order: Order, imageMeta: ImageMetadata)
    : Observable<Order> {
    if (imageMeta && imageMeta.fileMeta
      && imageMeta.fileMeta.name && imageMeta.fileMeta.type
      && (imageMeta.imageBlob || imageMeta.base64Image)) {
      return this.fs.uploadImage(imageMeta)
        .pipe(
          switchMap(metaData => {
            order.pictureId = metaData.id;
            return this.addOrder(order);
          })
        );
    } else {
      throw Error('You need better metadata');
    }
  }

  addOrder(order: Order): Observable<Order> {
    return from(
      this.db.collection('orders').add(
        {
          name: order.name,
          pictureId: order.pictureId
        }
      )
    ).pipe(
      map(orderRef => {
        order.id = orderRef.id;
        return order;
      })
    );
  }
}
