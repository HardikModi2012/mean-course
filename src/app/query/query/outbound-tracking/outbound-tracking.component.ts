import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';
import {PageChangeEvent} from '@progress/kendo-angular-pager';
import * as moment from 'moment';
import {AccessKey} from 'src/app/core/constants/access-key.constants';
import {NozomiVendorConst} from 'src/app/core/constants/validation.constants';
import {BreadCrumbItemList} from 'src/app/core/interfaces/generic/breadcrumb.interface';
import {ComboItemList} from 'src/app/core/interfaces/generic/combobox-options.interface';
import {GetDataAPI} from 'src/app/core/interfaces/generic/get-data-api.interface';
import {HeaderList} from 'src/app/core/interfaces/generic/grid.interface';
import {CurrentScreen} from 'src/app/core/interfaces/generic/screen-list.interface';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {InboundTracking} from 'src/app/core/interfaces/query/inbound-tracking.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {QueryService} from 'src/app/core/services/query/query.service';
import {SubSink} from 'subsink';
import {debounce} from 'typescript-debounce-decorator';

@Component({
  selector: 'app-outbound-tracking',
  templateUrl: './outbound-tracking.component.html',
  styleUrls: ['./outbound-tracking.component.scss']
})
export class OutboundTrackingComponent implements OnInit {
  private subSink = new SubSink();
  formData: InboundTracking = this.resetData();
  comboData: {[key in string]: ComboItemList} = {};

  private originalData!: GetDataAPI<InboundTracking>;

  paging = {
    totalCount: 0,
    pageable: {
      buttonCount: 3,
      info: true,
      pageSizes: [10, 25, 50, 100, 200, 500],
      previousNext: true
    },
    pagesize: 25,
    pageNumber: 1,
    skip: 0,
    filter: {}
  };

  flags = {
    isTableLoading: false,
    showIfNozomi: () => NozomiVendorConst.includes(this.userData?.vendorCode || '')
  };

  gridHeaderList: HeaderList<InboundTracking> = [
    {field: 'division', title: 'Division', width: 120},
    {field: 'groupName', title: 'Vendor', width: 150},
    {field: 'brand', title: 'Brand', width: 150},
    {field: 'billNo', title: 'Invoice No', width: 120},
    {field: 'date', title: 'Date', type: 'DATE_TIME', width: 160},
    {field: 'locationCode', title: 'Stock Location', width: 200},
    {field: 'partNumber', title: 'Item Code', width: 180},
    {field: 'description', title: 'Item Description', width: 300},
    {
      field: 'qty',
      title: 'Quantity',
      width: 150,
      align: 'RIGHT'
    },
    {field: 'serialNumber', title: 'Serial Number', width: 180},
    {field: 'rfid', title: 'RFID', width: 180},
    {field: 'invoiceNo', title: 'Supplier Invoice Number', width: 180},
    {field: 'currency', title: 'Currency', width: 150},
    {field: 'amount', title: 'Amount', width: 150, align: 'RIGHT'},
    {field: 'amountBC', title: 'Amount (AED)', width: 180, align: 'RIGHT'},
    {field: 'customer', title: 'Customer', width: 300},
    {field: 'orderNo', title: 'Order Number', width: 180},
    {field: 'dispatchNo', title: 'Dispatch Number', width: 180},
    {field: 'awbNo', title: 'Airway Bill Number', hideFun: () => this.flags.showIfNozomi(), width: 200},
    {field: 'salesOrderRef', title: 'Sales Order Ref', hideFun: () => this.flags.showIfNozomi(), width: 180},
    {field: 'incoterms', title: 'Incoterms', hideFun: () => this.flags.showIfNozomi(), width: 180},
    {field: 'accountNo', title: 'Account Number', hideFun: () => this.flags.showIfNozomi(), width: 180},
    {field: 'boe', title: 'BOE Number', width: 180},
    {field: 'createdBy', title: 'Created By', width: 300}
  ];

  gridData: GridDataResult = {
    data: [],
    total: 0
  };

  userData: UserData | undefined;
  breadcrumbItems: BreadCrumbItemList;
  currentScreen!: CurrentScreen;
  tempData: InboundTracking | undefined;
  searchTable: string = '';
  accessKey = AccessKey;

  cellOptions(header: any) {
    if (!header?.format) {
      switch (header.type) {
        case 'NUMBER':
          header.format = (0).toFixed(header?.typeConfig?.decimal || header?.decimal || 0);
          break;
        case 'DATE':
          header.format = 'dd/MM/yyyy';
          break;
        case 'DATE_TIME':
          header.format = 'dd/MM/yyyy HH:mm:ss';
          break;
        default:
          break;
      }
    }
    return {format: header.format};
  }

  constructor(
    public ds: DesignService,
    private activatedRoute: ActivatedRoute,
    private queryService: QueryService,
    private cdr: ChangeDetectorRef
  ) {
    const screenDetail = this.ds.setBreadcrumbItems(this.activatedRoute);
    this.breadcrumbItems = screenDetail.breadcrumbItems;
    this.currentScreen = screenDetail.currentScreen;
    this.accessKey = ds.accessKey;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.flags.isTableLoading = true;
    this.cdr.detectChanges();
  }

  private resetData(value: InboundTracking | undefined = undefined): InboundTracking {
    this.formData = {
      divisionCode: value?.divisionCode || this.userData?.divisionCode,
      itemData: value?.itemData || [],
      fromDate: value?.fromDate ?? moment().startOf('month').toDate(),
      toDate: value?.toDate || new Date()
    };

    return this.formData;
  }
  onGetTableData(type: 'LOAD_DATA' | 'EXCEL' | 'CSV' = 'LOAD_DATA', pageNumber: number = this.paging.pageNumber, data: any = {}): void {
    this.flags.isTableLoading = true;
    const pageSize = data.pageSize !== undefined ? data.pageSize : this.paging.pagesize;
    const searchString = !!this.searchTable ? this.searchTable : '';
    let fromDate = this.formData?.fromDate;
    let toDate = this.formData?.toDate;
    let divisionCode = this.formData?.divisionCode ? this.formData?.divisionCode : '';
    this.subSink.sink = this.queryService
      .getAllOutBoundTrackingList(pageNumber, pageSize, searchString, fromDate, toDate, divisionCode)
      .subscribe({
        next: (success: GetDataAPI<InboundTracking>) => {
          switch (type) {
            case 'LOAD_DATA': {
              const totalCount = !this.searchTable ? success.totalCount : success.data.length;
              this.originalData = success;
              this.paging.totalCount = totalCount;
              this.gridData = {
                data: success.data,
                total: totalCount
              };
              if (pageNumber === 1) {
                this.paging.skip = 0;
              }
              break;
            }

            case 'EXCEL': {
              const finalData = success.data;

              this.paging.totalCount = success.totalCount;
              this.gridData = {
                data: finalData,
                total: success.totalCount
              };
              setTimeout(() => {
                data.grid.saveAsExcel();
                const totalCount = !this.searchTable ? this.originalData.totalCount : this.originalData.data.length;
                this.gridData = {
                  data: this.originalData.data,
                  total: totalCount
                };
              }, 0);
              break;
            }

            case 'CSV': {
              const finalData = success.data;

              this.ds.exportToCSV(finalData, this.gridHeaderList, this.currentScreen.id);
              break;
            }

            default:
              alert('Please Add Type');
              break;
          }
        },
        error: (error: any) => {
          this.ds.showError(error);
          this.flags.isTableLoading = false;
        },
        complete: () => {
          this.flags.isTableLoading = false;
        }
      });
  }

  setDefaultDivision(comboData: ComboItemList) {
    setTimeout(() => {
      this.formData.divisionCode = this.userData?.divisionCode || '';
      this.onGetTableData('LOAD_DATA', 1);
    }, 0);
  }

  onPageChange(event: PageChangeEvent): void {
    this.paging.skip = event.skip;
    this.paging.pagesize = event.take;
    this.paging.pageNumber = event.skip / this.paging.pagesize + 1;

    this.onGetTableData('LOAD_DATA', this.paging.pageNumber);
  }

  @debounce(300)
  onFilter() {
    if (this.searchTable !== '') {
      this.onGetTableData('LOAD_DATA', 0, {pageSize: 0});
    } else {
      this.onGetTableData('LOAD_DATA', 1);
    }

    this.paging.skip = 0;
  }

  @debounce(300, {leading: true})
  fetchDataForExcel(grid: GridComponent) {
    this.onGetTableData('EXCEL', 1, {grid, pageSize: 0});
    // this.loader.open();
    // this.masterS.getExportToExcel().subscribe({
    //   next: (success) => {
    //     const file = new Blob([success], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
    //     const fileURL = window.URL.createObjectURL(file);

    //     saveAs(fileURL, `${this.currentScreen.id}.xlsx`);
    //   },
    //   error: (error) => {
    //     this.loader.close();
    //     this.ds.showError(error);
    //   },
    //   complete: () => {
    //     this.loader.close();
    //   }
    // });
  }

  @debounce(300, {leading: true})
  onExportToCsv() {
    this.onGetTableData('CSV', 1, {pageSize: 0});
  }

  onQuery(form: NgForm) {
    if (!form?.valid) {
      form?.form.markAllAsTouched();
      return;
    }
    this.onGetTableData('LOAD_DATA', 1);
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
