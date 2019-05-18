import { Injectable } from '@angular/core';
import {AngularFireStorage} from '@angular/fire/storage';
import {defer, from, Observable} from 'rxjs';
import {FileMetaData} from './fileMetaData';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, switchMap} from 'rxjs/operators';
import {ImageMetadata} from './image-metadata';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore) { }

  uploadImage(imageMetadata: ImageMetadata): Observable<FileMetaData> {
    if (imageMetadata.imageBlob) {
      const fileToUpload = new File(
        [imageMetadata.imageBlob],
        imageMetadata.fileMeta.name
        , {type: imageMetadata.fileMeta.type});
      return this.upload(fileToUpload);
    }
  }

  upload(file: File): Observable<FileMetaData> {
    const uid = this.db.createId();
    return defer(() =>
      this.storage.ref('product-pictures/' + uid)
        .put(file, {
          customMetadata: {
            originalName: file.name
          }
        })
        .then()
    ).pipe(
      map(fileRef => {
        fileRef.id = uid;
        return fileRef;
      })
    );
  }

  /*addFileMetaData(meta: FileMetaData): Observable<FileMetaData> {
    return defer(() => this.db.collection('files')
      .add(meta)
    ).pipe(
        map(documentRef => {
          meta.id = documentRef.id;
          return meta;
        })
      );
  }*/

  getFileUrl(id: string): Observable<any> {
    return this.storage.ref('product-pictures/' + id)
      .getDownloadURL();
  }
}
