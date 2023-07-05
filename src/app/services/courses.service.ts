import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

constructor() { }

// checkUpdate() {
//   this.poolingShortList$ = interval(15 * 1000)
//   .pipe(
//     startWith(0),
//     concatMap(() => this.jobSearchService.checkUpdate(this.jobId))
//   )
//   .subscribe(data => {
//     if (data) {
//       if (this.entity && this.entity.id) {
//         this.loadShortList(this.entity);
//       } else if (this.entityMachine && this.entityMachine.id) {
//         this.loadShortList(this.entityMachine);
//       }
//     }
//   });
// }

// show(message: string, action = this.defaultAction, duration = this.defaultDuration): MatSnackBarRef<SimpleSnackBar> {
//   return this.snackBar.open(message, action, {
//     duration: duration,
//     panelClass: ['snack'],
//     horizontalPosition: 'center',
//     verticalPosition: 'bottom'
//   });
// }
// showMessageError(message: string, action = this.defaultAction, duration = this.defaultDuration): MatSnackBarRef<SimpleSnackBar> {
//   return this.snackBar.open(message, action, {
//     duration: duration,
//     panelClass: ['snack-error'],
//     horizontalPosition: 'center',
//     verticalPosition: 'bottom'
//   });
// }

}
