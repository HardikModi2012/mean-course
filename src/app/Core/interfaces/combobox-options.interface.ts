import {NgModel} from '@angular/forms';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {ComboType} from '../../enums/combo-type.enum';

/**
 * Type for appCombobox Directive Input
 *
 * @interface ComboboxOptions
 */
export interface ComboboxOptions {
  /**
   * One of the UniqueType Enum
   *
   * @type {keyof typeof UniqueType}
   * @memberof UniqueOptions
   */
  type: keyof typeof ComboType;

  /**
   * delay or debounce time in microseconds
   *
   * @type {(number | undefined)}
   * @memberof UniqueOptions
   */
  compRef?: ComboBoxComponent | undefined;

  compModel?: NgModel | undefined;

  autoFocus?: boolean;

  inActive?: boolean;

  data?: any;

  provideData?: ComboItemList;
}

export interface CustomComboboxOptions {
  /**
   * delay or debounce time in microseconds
   *
   * @type {(number | undefined)}
   * @memberof UniqueOptions
   */
  compRef?: ComboBoxComponent | undefined;

  compModel?: NgModel | undefined;

  autoFocus?: boolean;
}

export interface ComboItemList extends Array<ComboItem> {}

export interface ComboItem {
  text: string;
  value: any;
  isFlag?: boolean;
  code?: any;
  SELECTED?: boolean;
  DISABLED?: boolean;
}
