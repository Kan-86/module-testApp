import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Order} from '../shared/order.model';
import {switchMap} from 'rxjs/operators';
import {FileService} from '../../files/shared/file.service';
import {OrderService} from '../shared/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {ImageMetadata} from '../../files/shared/image-metadata';
import {isNullOrUndefined, isUndefined} from 'util';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.scss']
})
export class OrderAddComponent implements OnInit {
  orderFormGroup: FormGroup;
  fileToUpload: File;
  imageChangeEvent: any = '';
  croppedImage: any = '';
  croppedBlob: Blob;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private fs: FileService,
              private os: OrderService) {
    this.orderFormGroup = new FormGroup({
      name: new FormControl('')
    });
  }

  ngOnInit() {
  }


  addOrder(order: Order) {
    const orderData = this.orderFormGroup.value;
    debugger;
    this.os.addOrderWithImage(
      orderData,
      this.getMetaDataForImage()
    ).subscribe(order => {
      this.router.navigate(['../'],
        {relativeTo: this.activatedRoute});
    });
  }

  private getMetaDataForImage(): ImageMetadata {


      const fileBeforeCrop = this.imageChangeEvent.target.files[0];
      return  {
        imageBlob: this.croppedBlob,
        fileMeta: {
          name: fileBeforeCrop.name,
          type: 'image/png',
          size: fileBeforeCrop.size
        }
      };
    return undefined;
  }

  uploadFile(event) {
    this.imageChangeEvent = event;
    // Going away soon :D
    // this.fileToUpload = event.target.files[0];
  }

  imageCropped(event: ImageCroppedEvent) {
    // Preview
    this.croppedImage = event.base64;
    this.croppedBlob = event.file;
    // Converting image for upload
    const fileBeforeCrop = this.imageChangeEvent.target.files[0];
    this.fileToUpload = new File(
      [event.file],
      fileBeforeCrop.name
    , {type: fileBeforeCrop.type});
  }
}
