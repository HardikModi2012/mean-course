import {Injectable} from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {apiRoutes} from '../constants/api-path.constants';
import {ServiceRolesConstant} from '../constants/validation.constants';
import {ComboType} from '../enums/combo-type.enum';
import {ComboboxOptions, ComboItem, ComboItemList} from '../interfaces/generic/combobox-options.interface';
import {ApiService} from './api.service';

/**
 * Bring Combobox Options through API Call
 *
 * @export
 * @class ComboBoxService
 */
@Injectable({
  providedIn: 'root'
})
export class ComboBoxService {
  private _cache: {[key in string]: Observable<ComboItemList>} = {};

  /**
   * Creates an instance of ComboBoxService.
   * @param {ApiService} api
   * @memberof ComboBoxService
   */
  constructor(private api: ApiService) {}

  /**
   * Change API for Combobox data as per parameter UniqueType
   *
   * @return {*}
   * @memberof UniqueValidatorDirective
   */
  switchApi(appCombobox: ComboboxOptions): Observable<ComboItemList> {
    let result: Observable<ComboItemList>;

    switch (appCombobox?.type) {
      case ComboType.MD_CODE: {
        result = this.getMdCodeCombo(!!appCombobox?.inActive);
        break;
      }

      // case ComboType.SELECT_TYPE: {
      //   result = of([
      //     {text: 'Screen', value: 1},
      //     {text: 'Printer', value: 2},
      //     {text: 'File', value: 3},
      //     {text: 'Email', value: 4}
      //   ]);
      //   break;
      // }

      // case ComboType.SUM_OF: {
      //   result = of([
      //     {text: 'SUM1', value: 1},
      //     {text: 'SUM2', value: 2},
      //     {text: 'SUM3', value: 3},
      //     {text: 'SUM4', value: 4}
      //   ]);
      //   break;
      // }

      // case ComboType.FSL_STATIC: {
      //   result = of([
      //     {text: 'PT28-PT DEMO DAMMAM', value: 'PT28'},
      //     {text: 'PT29-PT DEMO JEDDAH', value: 'PT29'},
      //     {text: 'PT38-PT DEMO RIYADH', value: 'PT38'}
      //   ]);
      //   break;
      // }
      default: {
        alert(`Please Add ${appCombobox?.type} Switch Case in Combo box Service`);
        result = of([]);
        break;
      }
    }

    return result;
  }

  private dataFormat = (res: ComboItemList) => {
    res.forEach((item: ComboItem) => {
      try {
        item.text = item.text?.trim() || '';
        item.value = item.value?.trim() || '';
        item.code = JSON.parse(item.code);
      } catch (e) {
        return item.code;
      }
    });
    return res;
  };

  /**
   * Get MASTER_DIVISION Combo
   *
   * @return {*} {Observable<ComboItemList>}
   * @memberof ComboBoxService
   */
  getMdCodeCombo(inActive: boolean): Observable<ComboItemList> {
    return this.api.get(`${apiRoutes.getMdCodeCombobox}${inActive ? '/true' : ''}`, {}).pipe(map(this.dataFormat));
  }
}
