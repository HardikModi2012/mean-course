import { DialogRef } from '@angular/cdk/dialog';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private modelRef: DialogRef | null = null;

  // constructor(private dialog: DialogService) {}

  // open() {
  //   this.close();

  //   this.modelRef = LoadingGridComponent.open(this.dialog);
  // }

  // close() {
  //   if (this.modelRef) {
  //     this.modelRef.close();
  //   }
  // }
}
