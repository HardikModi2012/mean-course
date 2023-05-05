import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({
  selector: 'form[appScrollToInvalid]'
})
export class ScrollToInvalidDirective {

  constructor(private el: ElementRef, private form: NgForm) { }

  @HostListener('ngSubmit') OnSubmit(){
    if (this.form.control.invalid) {
      this.form?.form.markAllAsTouched();
      this.scrollToFirstInvalidControl();
    }
  }

  private scrollToFirstInvalidControl(){
    const firstInvalidControl : HTMLElement = this.el.nativeElement.querySelector('.ng-invalid');

    firstInvalidControl.scrollIntoView({
      behavior: 'smooth', block: 'center', inline: 'nearest'
    });
    setTimeout(() => {
      firstInvalidControl?.focus();
    }, 100);
  }

}
