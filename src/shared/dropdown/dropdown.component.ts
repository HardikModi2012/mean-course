import { Component, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SubSink } from 'src/app/Core/Subsink';
import { DropdownService } from '../services/Dropdown.service';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements OnInit, OnDestroy, ControlValueAccessor {
    ngOnDestroy(): void {
      this.subSink.unSubscribe();
    }

    @Input() placeholder = 'Select an option';
    @Input() label: string = '';

    config: any = { //DropDownConfig
      type: 'BLANK',
      label: '',
      placeholder: 'Select And Option',
      hasFilter: false,
      required: false
    } as any; // DropDownConfig;

    @Input() set Config(config: any) { // dropdownconfig
      this.config = config;

      this.getInitialData();
    }

    @Input() set refreshData(config: boolean) {
      if (config) {
        this.getInitialData();
        this.refreshDataChange.emit(false);
      }
    }

    @Output() refreshDataChange: EventEmitter<boolean> = new EventEmitter();

    @Input() set filter(data: any) {
      if (this.config.hasFilter) {
        // this.value = '';
        this.config.data = data;
        this.getInitialData();
      }
    }

    @Input() disabled: boolean = false;

    @Output() dropDownData: EventEmitter<any[]> = new EventEmitter();

    @HostBinding('attr.tabindex') tabindex = 0;

    // @HostListener('focus')
    // @debounce(200)
    focusHandler() {
      this.flags.isOpen = true;
      this.flags.isFocused = true;
    }

    flags = {
      isOpen: false,
      isFocused: false
    };

    private subSink = new SubSink();

    formControl: any = null;

    options: any[] = [];
    selectedOption: any = {text: '', value: ''} as any;
    searchTerm = '';
    filteredOptions: any[] = [];

    value: string = '';

    public onChange = (value: string) => {};
    public onTouched = () => {};

    ngOnInit(): void {}

    constructor(private dropDownService: DropdownService) {}
    // , private readonly errorHandler: ErrorHandlerService
    private getInitialData() {
      if (this.config.hasFilter && !this.config.data) {
        this.selectedOption = {text: '', value: ''} as any;
        return;
      }

      this.subSink.sink = this.dropDownService.getComboData(this.config).subscribe({
        next: (comboData: any[]) => {
          this.options = comboData;

          let checkValue = this.options.find((option) => option.value.toString().toLowerCase() == this.value?.toString().toLowerCase());

          if (!checkValue) {
            this.value = '';
            this.selectedOption = {text: '', value: ''} as any;
            //this.onChange('');
          } else {
            this.selectOption(checkValue);
            this.onChange(checkValue.value);
          }

          this.dropDownData.emit(comboData);

          this.setSelectedOptionOnValueSelection();
          this.filterOptions();
        },
        error: (error: any) => {
          // this.errorHandler.handle(error);
        }
      });
    }

    private setDefaultSelectedOption() {
      this.selectedOption = {text: '', value: ''} as any;
    }

    filterOptions() {
      this.filteredOptions = this.options.filter((option) => option.text.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    selectOption(option: any) {
      this.value = option.value;
      this.searchTerm = '';
      this.flags.isOpen = false;
      this.filterOptions();
      this.selectedOption = option;
      this.onChange(option.value);
    }

    writeValue(value: string): void {
      this.value = value;
      this.searchTerm = '';

      this.setSelectedOptionOnValueSelection();
    }

    registerOnChange(fn: (value: string) => void): void {
      this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
      this.onTouched = fn;
    }

    toggleDropdown() {
      if (this.flags.isFocused) {
        this.flags.isOpen = false;
      }
      this.flags.isOpen = !this.flags.isOpen;

      this.flags.isFocused = false;

      if (!this.flags.isOpen) {
        this.searchTerm = '';
        this.onTouched();
      }
    }

    private setSelectedOptionOnValueSelection() {
      if (this.options && this.options.length > 0 && this.value) {
        var find = this.options.find((option) => option.value.toString().toLowerCase() == this.value.toString().toLowerCase());
        if (find != null) {
          this.selectedOption = find;
        }
      }
    }

    onLastOptionBlur() {
      this.flags.isOpen = false;

      this.searchTerm = '';
      this.onTouched();
    }

    onCloseClick() {
      this.setDefaultSelectedOption();
      this.value = '';

      this.selectOption(this.selectedOption);
    }
  }
