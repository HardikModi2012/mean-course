import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appUppercase]'
})
export class UppercaseDirective {

  @Input() appUpperCaseInput: boolean | '' = true;
  constructor(private readonly control: NgControl) { }

  @HostListener('input', ['$event.target'])
  onInput(input: HTMLInputElement): void {
    if (this.appUpperCaseInput || this.appUpperCaseInput === '') {
      this.control?.control.setValue(input.value.toUpperCase())
    }
  }

}
