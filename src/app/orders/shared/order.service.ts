import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from, Observable, throwError} from 'rxjs';
import {Order} from './order.model';
import {catchError, first, map, switchMap, tap} from 'rxjs/operators';
import {error} from 'selenium-webdriver';
import {ImageMetadata} from '../../files/shared/image-metadata';
import {FileService} from '../../files/shared/file.service';
import {HttpClient} from '@angular/common/http';

const collection_path = 'orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: AngularFirestore,
              private fs: FileService,
              private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.db
      .collection<Order>(collection_path)
      // This will return an Observable
      .snapshotChanges()
      .pipe(
        map(actions => {
          // actions is an array of DocumentChangeAction
          return actions.map(action => {
            const data = action.payload.doc.data() as Order;
            return {
              id: action.payload.doc.id,
              name: data.name,
              pictureId: data.pictureId
            };
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
      && imageMeta.fileMeta.name && imageMeta.fileMeta.type &&
      (imageMeta.imageBlob || imageMeta.base64Image)) {
      const endPointUrl =
        'https://us-central1-productappexample.cloudfunctions.net/orders';
      const porderToSend: any = {
        name: order.name,
        image: {
          base64: imageMeta.base64Image,
          name: imageMeta.fileMeta.name,
          type: imageMeta.fileMeta.type,
          size: imageMeta.fileMeta.size
        }
      };
      return this.http.post<Order>(endPointUrl, porderToSend);
      /*return this.fs.uploadImage(imageMeta)
        .pipe(
          switchMap(metadata => {
            product.pictureId = metadata.id;
            return this.addProduct(product);
          }),
          catchError((err, caught) => {
            return throwError(err);
          })
        );*/
    } else {
      return throwError('You need better metadata');
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
