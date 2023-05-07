import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appValidDecimal]'
})
export class ValidDecimalDirective {

  @Input() decimal : number = 0;

  private specialKeys = ['']
  constructor(private control: NgControl) { }

  @HostListener('keydown', ['$event'])
  onInputChange(event: KeyboardEvent){
    if (event.key === '' || event.keyCode === 110 || this.specialKeys.includes(event.key)) {
      return;
    }else{
      return this.control?.control?.setValue(+this.control.value.toFixed(this.decimal))
    }
  }
}
