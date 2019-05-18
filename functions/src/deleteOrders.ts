import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

exports.deleteOrder = functions.firestore
  .document('orders/{orderId}')
  .onDelete((snap, context) => {
    return new Promise( async (resolve, reject) => {
      const deletedOrder = snap.data();
      if(deletedOrder) {
        try{
          await admin.firestore().collection('files')
            .doc(deletedOrder.pictureId)
            .delete()
            .then();

          const restultFromStorage = await admin.storage()
            .bucket().file('product-pictures/' + deletedOrder.pictureId)
            .delete()
            .then()

          resolve(restultFromStorage);
        } catch (e) {
          reject(e);
        }


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
      } else {
        reject('No product deleted');
      }

    });
  });
