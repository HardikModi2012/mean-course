import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appString]'
})
export class StringDirective {

  @Input() MaxLength: number = 99999999;
  @Input() MinLength: number = 0;

  constructor(private el: ElementRef) { }

  private checkLength(value: string): void {
    if (value.length < this.MinLength) {
      this.el.nativeElement.setCustomValidatity(`Minimum length is ${this.MinLength}`)
    } else if (value.length > this.MaxLength) {
      this.el.nativeElement.setCustomValidatity(`Maximum length is ${this.MaxLength}`)
    } else {
      this.el.nativeElement.setCustomValidatity('');
    }
  }

  @HostListener('paste', ['$event']) onPaste(e: ClipboardEvent) {
    const input = this.el.nativeElement as HTMLInputElement;

    if (!input) {
      return;
    }

    const MaxLength = this.MaxLength;
    const pastedText = e.clipboardData?.getData('text');
    const value = input.value;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    setTimeout(() => {
      const pastedValue = pastedText.substring(0, MaxLength - value.length + selectionEnd - selectionStart);
      const newValue = value.substring(0, selectionStart) + pastedValue + value.substring(selectionEnd);
      input.value = newValue;
      this.checkLength(newValue)
    }, 0);

  }

  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;
    const keyCode = e.which || e.keyCode
    if (keyCode === 8 || keyCode === 46 || keyCode === 37 || keyCode === 39) {
      return;
    }
    if (value.length >= this.MaxLength) {
      e.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInput(e: MouseEvent) {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;
    this.checkLength(value);
    if (value.length >= this.MaxLength) {
      input.value = value.substr(0, this.MaxLength)
      this.checkLength(value);
    }
  }

  @HostListener('blue', ['$event']) onBlur(e: MouseEvent) {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;
    this.checkLength(value);
  }

}
