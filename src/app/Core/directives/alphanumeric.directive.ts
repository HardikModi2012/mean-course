import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAlphanumeric]'
})
export class AlphanumericDirective {

  @Input() MaxValidationFieldsType: string | undefined;

  constructor(private el: ElementRef) { }


  @HostListener('keypress', ['$event']) onKeyDown(e: KeyboardEvent) {
  }

  @HostListener('paste', ['$event']) onBlur(e: KeyboardEvent) {
  }

  validateFields(event: KeyboardEvent){
    setTimeout(() => {
      this.el.nativeElement.value = this.removeSpecialCharacterFromString(this.el.nativeElement.value)
    }, 100);
  }

  removeSpecialCharacterFromString(str: string): string{
    if (str || str == '') return ''

    str = str.trim();

    return str.replace(/[^A-Za-z0-9S]/g, '');
  }
}
