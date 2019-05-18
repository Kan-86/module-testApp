import * as admin from 'firebase-admin';
import * as deleteOrders from './deleteOrders';
import * as orderRest from './orders-rest';
import * as restApi from './main-rest-endpoint';
import * as uploadNewOrderImage from './upload-new-product-image-function';

admin.initializeApp()
//  Start writing Firebase Functions
//  https://firebase.google.com/docs/functions/typescript

module.exports = {
  ...deleteOrders,
  ...orderRest,
  ...restApi,
  ...uploadNewOrderImage
}

/*
exports.deleteOrder = functions.firestore
  .document('orders/{orderID}')
  .onDelete((snap, context) => {

    return new Promise(async (resolve, reject) => {
      // Get an object representing the document prior to deletion
      // e.g. {'name': 'Marie', 'age': 66}
      const deletedOrder = snap.data();
      if (deletedOrder) {
        try {
          await admin.firestore().collection('files')
            .doc(deletedOrder.pictureId)
            .delete()
            .then();

          const resultFromStorage = await admin.storage()
            .bucket().file('product-pictures/' + deletedOrder.pictureId)
            .delete()
            .then();

          resolve(resultFromStorage);
        } catch (err) {
          reject(err)
        }
      } else {
        reject('No order deleted');
      }
    });*/
    /*
        admin.firestore().collection('files')
          .doc(deletedProduct.pictureId)
          .delete()
          .then(value => {
              admin.storage()
                .bucket().file('product-pictures/' + deletedProduct.pictureId)
                .delete()
                .then(res => resolve(res), err => reject(err))
                .catch(err => reject(err))
            },
            err => reject(err))
          .catch(err => reject(err))*/
/* });

exports.uploadNewOrderImage =
 functions.storage.object().onFinalize((object) => {
   return new Promise((resolve, reject) =>{
     if(object && object.name &&object.metadata) {
       console.log('Full uploaded obj: ' + JSON.stringify((object)))
       const fileMeta = {
         lastModified: object.updated,
         name: object.metadata.originalName,
         type: 'image/png',
         size: object.size
       }
       console.log('Object Name: ' + object.name)
       const nameForeDoc = object.name.split('/')[1]; //order-pictures
       admin.firestore().collection('files')
         .doc(nameForeDoc).set(fileMeta)
         .then(value => resolve(value))
         .catch(err => reject(err))
         resolve('It worked: ' + resolve);
       // Firestre And save meta
     }else {
       reject('Error happened, not enough metadata or file data: ' + reject);
     }
   });
 });

exports.orders = functions.https.onRequest((request, response) => {
  admin.firestore().collection('orders')
    .get().then(orders => {
      const listOfOrders: any = [];

      orders.forEach(order => {
        let ord = order.data();
        ord.id = order.id;
        listOfOrders.push(ord);
      })
    // Orders As JSON from Firebase db
    response.json(listOfOrders);
  }).catch(err => {
    console.log(err)
  })
});
*/
