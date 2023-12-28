import {formatDate, getCurrencySymbol} from '@angular/common';
import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '@progress/kendo-angular-notification';
import {saveAs} from '@progress/kendo-file-saver';
import * as moment from 'moment';
import {ToWords} from 'to-words';
import {debounce} from 'typescript-debounce-decorator';
import {AccessKey} from '../constants/access-key.constants';
import {CurrencyToWordFormatList} from '../constants/currency-to-words.constant';
import * as SvgLogos from '../constants/svg.constants';
import {
  BaseCurrencyConstant,
  VolumeDecimalConstant,
  WeightDecimalConstant,
  baseCurrencyDecimal,
  foreignCurrencyDecimal
} from '../constants/validation.constants';
import {BreadCrumbItemList} from '../interfaces/generic/breadcrumb.interface';
import {Header} from '../interfaces/generic/grid.interface';
import {ScreenIdKeyList} from '../interfaces/generic/screen-list.interface';
import {AuthService} from './auth.service';

/**
 * All Design and layout related Global functions
 *
 * @export
 * @class DesignService
 */
@Injectable({
  providedIn: 'root'
})
export class DesignService {
  readonly accessKey = AccessKey;
  readonly baseCurrencyConstant = BaseCurrencyConstant;
  readonly svg = SvgLogos;

  readonly baseCurrencyDecimal = baseCurrencyDecimal;
  readonly foreignCurrencyDecimal = foreignCurrencyDecimal;
  readonly volumeDecimal = VolumeDecimalConstant;
  readonly weightDecimal = WeightDecimalConstant;

  readonly dateFormatPlaceholder = {
    year: 'YYYY',
    month: 'MM',
    day: 'DD',
    hour: 'HH',
    minute: 'MM',
    second: 'SS'
  };

  /**
   * Creates an instance of DesignService.
   * @param {NotificationService} notificationS
   * @memberof DesignService
   */
  constructor(
    private notificationS: NotificationService,
    private router: Router,
    private authS: AuthService,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  /**
   * Set Header Height CSS variable
   *
   * @memberof DesignService
   */
  @debounce(300)
  setHeaderHeight() {
    const header: HTMLDivElement | null = document.querySelector('#header');
    const height = header?.offsetHeight;

    const root: HTMLHtmlElement | null = document.querySelector(':root');
    root?.style.setProperty('--header-height', `${height}px`);
  }

  /**
   * Set Sub Header Height CSS variable
   *
   * @memberof DesignService
   */

  @debounce(300)
  setSubHeaderHeight() {
    const subHeader: HTMLDivElement | null = document.querySelector('#sub-header');
    const height = subHeader?.offsetHeight;

    const root: HTMLHtmlElement | null = document.querySelector(':root');
    root?.style.setProperty('--sub-header-height', `${height}px`);
  }

  /**
   * Set Footer Height CSS variable
   *
   * @memberof DesignService
   */

  @debounce(300)
  setFooterHeight() {
    const footer: HTMLDivElement | null = document.querySelector('#footer');
    const height = footer?.offsetHeight;

    const root: HTMLHtmlElement | null = document.querySelector(':root');
    root?.style.setProperty('--footer-height', `${height}px`);
  }

  /**
   * Show Notification
   *
   * @param {*} notify
   * @memberof DesignService
   */
  showNotification(notify: any) {
    if (!notify.showOther) this.hideNotifications();

    this.notificationS.show({
      content: notify?.content,
      animation: {
        duration: notify?.animation?.duration || 100,
        type: notify?.animation?.type || 'slide'
      },
      cssClass: `k-notification-${notify?.type || 'none'}`,
      hideAfter: notify?.hideAfter || 5000,
      position: {
        vertical: notify?.position?.vertical || 'bottom',
        horizontal: notify?.position?.horizontal || 'right'
      },
      closable: !!notify?.closable
    });
  }

  hideNotifications() {
    document.querySelectorAll('kendo-notification-container').forEach((item: any) => item.remove());
  }

  /**
   * Convert JSON Data to CSV
   *
   * @param {*} data
   * @param {Array<{field: string; title: string}>} headerList
   * @param {string} [filename='data']
   * @return {*}  {*}
   * @memberof DesignService
   */
  exportToCSV(data: any, headerList: Array<{field: string; title: string}>, filename: string = 'data'): any {
    let csvData = this.convertToCSV(data, headerList);

    let blob = new Blob(['\ufeff' + csvData], {type: 'text/csv;charset=utf-8;'});
    let downloadLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {
      //if Safari open in new window to save file with random filename.
      downloadLink.setAttribute('target', '_blank');
    }
    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', filename + '.csv');
    downloadLink.style.visibility = 'hidden';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  /**
   * @ignore
   *
   * @param {string} objArray
   * @param {Array<{field: string; title: string}>} headerList
   * @return {*}
   * @memberof DesignService
   */
  private convertToCSV(objArray: string, headerList: Array<{field: string; title: string}>): any {
    const replacer = (value: string | null | undefined) => {
      const res = value === null || value === undefined ? '' : value.toString().indexOf('"') > 0 ? value.replace(/"/g, ' ') : value;
      return res.toString().indexOf(',') > 0 ? '"' + res + '"' : res;
    };

    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    for (let index in headerList) {
      row += replacer(headerList[index].title) + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index].field;
        line += replacer(array[i][head]) + ',';
      }
      str += line + '\r\n';
    }
    return str;
  }

  /**
   * Format Numeric Textbox decimal places
   *
   * @param {number} val
   * @return {*}
   * @memberof DesignService
   */
  formatNumericTextbox(val: number): number {
    if (Math.floor(val) === val) {
      return 0;
    } else {
      return val?.toString()?.split('.')[1]?.length || 0;
    }
  }

  setBreadcrumbItems(activatedRoute: ActivatedRoute) {
    const currentScreen: any = this.authS.currentScreen;
    const breadcrumbItems: BreadCrumbItemList = [];

    if (!currentScreen) {
      alert(`Please Add ScreenListConstant object ${currentScreen}`);
    }

    if (currentScreen?.breadcrumbPath && currentScreen?.breadcrumbPath.length > 0) {
      currentScreen?.breadcrumbPath.forEach((id: ScreenIdKeyList) => {
        if (!!this.authS.screenList[id]) {
          breadcrumbItems.push({
            text: this.authS.screenList[id].name,
            title: 'Go to ' + this.authS.screenList[id].name,
            link: this.authS.screenList[id].link
          });
        }
      });
    }

    breadcrumbItems.push({
      text: currentScreen.name,
      title: 'Go to ' + currentScreen.name,
      link: currentScreen.link
    });

    return {breadcrumbItems, currentScreen};
  }

  fixDecimal(value: number, decimal: number): string {
    if (!value || isNaN(value)) {
      return '';
    }

    const divisor = +(+'1').toFixed(decimal).replace('.', '');
    const roundedNumber = Math.round((parseFloat(value.toString()) + Number.EPSILON) * divisor) / divisor;
    return roundedNumber.toFixed(decimal);
  }

  itemDisabled(itemArgs: {dataItem: any; index: number}) {
    return !!itemArgs.dataItem?.DISABLED;
  }

  isDisabledInGrid(args: {dataItem: {DISABLED: boolean; SELECTED: boolean}}) {
    return {
      'k-disabled': !!args.dataItem?.DISABLED,
      'k-state-selected': !!args.dataItem?.SELECTED
    };
  }

  exportBase64PDF(
    base64String: string,
    type: 'PRINT' | 'VIEW' | 'DOWNLOAD' | 'EXTERNAL_VIEW' = 'PRINT',
    fileName: string = 'DEFAULT_FILE_NAME'
  ) {
    const base64ToArrayBuffer = (data: string) => {
      const stringData = data.replace('data:application/pdf;base64,', '');
      const bString = window.atob(stringData);
      const bLength = bString.length;
      let bytes = new Uint8Array(bLength);
      for (let i = 0; i < bLength; i++) {
        const ascii = bString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes;
    };

    const content = base64ToArrayBuffer(base64String);
    const blob = new Blob([content], {type: 'application/pdf'});
    const dataUrl = window.URL.createObjectURL(blob);

    switch (type) {
      case 'PRINT': {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = dataUrl;
        document.body.appendChild(iframe);
        iframe.contentWindow?.print();
        break;
      }

      case 'EXTERNAL_VIEW': {
        const iframe = document.createElement('iframe');
        iframe.style.height = '100vh';
        iframe.style.width = '100vw';
        iframe.style.display = 'block';
        iframe.style.position = 'absolute';
        iframe.style.inset = '0';
        iframe.style.zIndex = '1000000';
        iframe.style.overflow = 'hidden';
        iframe.src = dataUrl;
        document.body.appendChild(iframe);
        break;
      }

      case 'VIEW': {
        let width = window.outerWidth + 'px';
        let height = window.outerHeight + 'px';
        window.open(dataUrl, '_blank', `toolbar=no,scrollbars=yes,resizable=yes,top=0,left=0,width=${width},height=${height}`);
        break;
      }

      case 'DOWNLOAD': {
        saveAs(dataUrl, `${fileName}.pdf`);
        break;
      }

      default:
        break;
    }
  }

  printBase64Text(base64String: string, filename: string) {
    const base64ToArrayBuffer = (data: string) => {
      const stringData = data.replace('data:text/plain;base64,', '');
      const bString = window.atob(stringData);
      const bLength = bString.length;
      let bytes = new Uint8Array(bLength);
      for (let i = 0; i < bLength; i++) {
        const ascii = bString.charCodeAt(i);
        bytes[i] = ascii;
      }
      return bytes;
    };

    const content = base64ToArrayBuffer(base64String);
    const blob = new Blob([content], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.name = 'filename';
    if (iframe.contentWindow && iframe.contentWindow != null) iframe.contentWindow.document.title = filename;

    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    iframe.contentWindow?.print();
  }

  hideColumn(header: Header<any>): boolean {
    if (typeof header?.hideFun === 'function') {
      return !header?.hideFun();
    }
    if (header?.hide === true) {
      return false;
    }
    return true;
  }

  showError(error: any) {
    console.error(error);

    try {
      error.error = JSON.parse(error.error);
    } catch (err) {}

    this.showNotification({
      content: error.error.message || error.message || error,
      type: 'error'
    });
  }

  onBreadcrumbItemClick(event: any) {
    this.router.navigateByUrl(event.link);
  }

  currentDateTime(): Date {
    return new Date();
  }

  currentMonth(validate: boolean): Date {
    return validate ? moment().startOf('month').toDate() : moment('01-01-1900').toDate();
  }

  currentEndMonth(): Date {
    return moment().endOf('month').toDate();
  }

  disabledPreviousDates(date: Date): boolean {
    return date < moment().subtract(1, 'd').toDate();
  }

  disabledFutureDates(date: Date): boolean {
    return date > moment().toDate();
  }

  dateObject(date: any, format?: string): Date | string {
    if (!!date && typeof date === 'string') {
      return moment(date, format || 'YYYY-MM-DDTHH:mm:ss', true).toDate();
    } else if (!!date && typeof date === 'number') {
      return moment(date).toDate();
    }
    return date;
  }

  dateToString(date?: Date | string | null, format?: string) {
    return !!date ? formatDate(date, format || 'yyyy-MM-ddT00:00:00', this.locale) : date || '';
  }

  excelDateToJSDate(date: number) {
    if (!!date && typeof date === 'number') {
      const day = 24 * 60 * 60 * 1000;
      // 25569 days minus as excel calculate the number of days from 01-01-1900 and js calculate the number of days from 01-01-1970
      return new Date(Math.round((date - 25569) * day));
    } else {
      return date;
    }
  }

  loadScript(
    url: string,
    config?: {
      loadType?: 'async' | 'defer' | 'none';
      crossOrigin?: boolean;
      integrity?: string;
      target?: string;
      id?: string;
    },
    callback?: () => void
  ) {
    var script: any = document.createElement('script');
    script.type = 'text/javascript';

    switch (config?.loadType) {
      case 'async':
        script.async = true;
        break;

      case 'none':
        break;

      default:
        script.defer = true;
        break;
    }

    if (config?.crossOrigin) script.crossOrigin = 'anonymous';
    if (config?.id) script.id = config?.id;

    if (script?.readyState) {
      // only required for IE <9
      script.onreadystatechange = function () {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          if (!!callback) callback();
        }
      };
    } else {
      //Others
      script.onload = function () {
        if (!!callback) callback();
      };
    }

    script.src = url;
    document.querySelector(config?.target || 'body')?.appendChild(script);
  }

  toWords(
    value?: number | string,
    format?: {
      code: string;
      name?: string;
      fractionName?: string;
      namePlural?: string;
      fractionNamePlural?: string;
      localCode?: string;
      symbol?: string;
    }
  ) {
    if (['AED'].includes(format?.code || '')) {
      format = CurrencyToWordFormatList.AED;
    }

    let result = '';
    if (!!value && !isNaN(+value)) {
      const toWords = new ToWords({
        localeCode: format?.localCode || 'en-US',
        converterOptions: {
          currency: true,
          ignoreDecimal: false,
          ignoreZeroCurrency: true,
          currencyOptions: {
            name: format?.name || '',
            plural: format?.namePlural || format?.name || '',
            symbol: format?.symbol || getCurrencySymbol(format?.code || '', 'narrow') || '',
            fractionalUnit: {
              name: format?.fractionName || 'Point',
              plural: format?.fractionNamePlural || format?.fractionName || 'Point',
              symbol: ''
            }
          }
        }
      });
      const amount = +value;
      result = toWords.convert(amount);
    }

    // return args[0];
    return result;
  }

  getAccountingFormat(ds: DesignService, data: string | number, decimal: number, defaultVal: any) {
    if (!data || data == '') {
      return defaultVal || (+'0').toFixed(decimal);
    }

    let num = Number(data);

    if (num >= 0) {
      return ds.fixDecimal(+data, decimal).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') || defaultVal || (+'0').toFixed(decimal);
    } else {
      return (
        '(' +
        (ds.fixDecimal(-1 * num, decimal).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') || defaultVal || (+'0').toFixed(decimal)) +
        ')'
      );
    }
  }
}
