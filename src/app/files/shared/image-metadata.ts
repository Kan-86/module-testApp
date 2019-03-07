import {FileMetaData} from './fileMetaData';

export interface ImageMetadata {
  base64Image?: string;
  imageBlob?: Blob;
  fileMeta: FileMetaData;
}
