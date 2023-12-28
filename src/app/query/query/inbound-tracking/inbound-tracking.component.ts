import {AfterViewInit, ChangeDetectorRef, Component, Inject, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';
import {PageChangeEvent} from '@progress/kendo-angular-pager';
import * as moment from 'moment';
import {AccessKey} from 'src/app/core/constants/access-key.constants';
import {BreadCrumbItemList} from 'src/app/core/interfaces/generic/breadcrumb.interface';
import {ComboItemList} from 'src/app/core/interfaces/generic/combobox-options.interface';
import {GetDataAPI} from 'src/app/core/interfaces/generic/get-data-api.interface';
import {HeaderList} from 'src/app/core/interfaces/generic/grid.interface';
import {CurrentScreen} from 'src/app/core/interfaces/generic/screen-list.interface';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {InboundTracking, InboundTrackingData} from 'src/app/core/interfaces/query/inbound-tracking.interface';
import {ApiService} from 'src/app/core/services/api.service';
import {DesignService} from 'src/app/core/services/design.service';
import {QueryService} from 'src/app/core/services/query/query.service';
import {SubSink} from 'subsink';
import {debounce} from 'typescript-debounce-decorator';

@Component({
  selector: 'app-inbound-tracking',
  templateUrl: './inbound-tracking.component.html',
  styleUrls: ['./inbound-tracking.component.scss']
})
export class InboundTrackingComponent implements OnInit, OnDestroy, AfterViewInit {
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
    isTableLoading: false
  };

  gridHeaderList: HeaderList<InboundTrackingData> = [
    {
      field: 'poNumber',
      title: 'PO Number',
      width: 150,
      type: 'LINK',
      typeConfig: {
        routerLink: (data: any) => {
          return {link: `/transaction/purchase-order?view=${data}`, target: '_self', disabled: false};
        }
      }
    },
    {
      field: 'documentNumber',
      title: 'GRN Number',
      width: 150,
      type: 'LINK',
      typeConfig: {
        routerLink: (data: any) => {
          return {link: `/transaction/grn-inbound?view=${data}`, target: '_self', disabled: false};
        }
      }
    },
    {field: 'documentDate', title: 'GRN Date', type: 'DATE_TIME', width: 160},
    {field: 'division', title: 'Division', width: 120},
    {field: 'divisionName', title: 'Division Name', width: 300},
    // {field: 'documentNumber', title: 'Document Number', width: 180},
    // {field: 'poNumber', title: 'PO Number', width: 150},
    {field: 'groupCode', title: 'Vendor Code', width: 150},
    {field: 'groupName', title: 'Vendor', width: 150},
    {field: 'brandCode', title: 'Brand Code', width: 150},
    {field: 'brandName', title: 'Brand', width: 150},
    {field: 'supplierName', title: 'Supplier Name', width: 200},
    {field: 'currency', title: 'Currency', width: 130},
    {field: 'stockLocation', title: 'Stock Location', width: 200},
    {field: 'invoiceNo', title: 'Invoice No.', width: 180},
    {field: 'invoiceDate', title: 'Invoice Date', type: 'DATE', width: 120},
    {field: 'doNumber', title: 'DO Number', width: 180},
    {field: 'doDate', title: 'DO Date', type: 'DATE', width: 120},
    {field: 'receivedBy', title: 'Received By', width: 180},
    {field: 'receivedDate', title: 'Received Date', type: 'DATE_TIME', width: 160},
    {field: 'airwayBillNo', title: 'Airway Bill No.', width: 200},
    {field: 'deliveryMode', title: 'Delivery Mode', width: 180},
    {field: 'amount', title: 'Amount', width: 150, align: 'RIGHT'},
    {field: 'boeNumber', title: 'BOE Number', width: 180},
    {field: 'createdBy', title: 'Created By', width: 150},
    {field: 'approvedBy', title: 'Approved By', width: 150},
    {field: 'approvedDate', title: 'Approved Date', type: 'DATE_TIME', width: 150},
    {field: 'receivedToGrn', title: 'Received => GRN Booking (HH)', width: 200},
    {field: 'grnToApproval', title: 'GRN Booking => GRN Approval (HH)', width: 200},
    {field: 'dockToStock', title: 'Dock To Stock (HH)', width: 150},
    {
      field: 'status',
      title: 'Status',
      width: 250,
      type: 'BADGE',
      typeConfig: {
        badge: [
          {
            value: 'APPROVED',
            text: 'Approved',
            type: 'success'
          },
          {
            value: 'PENDING FOR GRN APPRAVAL',
            text: 'Pending',
            type: 'dark'
          }
        ]
      }
    }
  ];

  gridData: GridDataResult = {
    data: [],
    total: 0
  };

  userData: UserData | undefined;
  breadcrumbItems: BreadCrumbItemList;
  currentScreen!: CurrentScreen;
  searchTable: string = '';
  accessKey = AccessKey;

  constructor(
    public ds: DesignService,
    private activatedRoute: ActivatedRoute,
    private queryService: QueryService,
    public apiS: ApiService,
    private cdr: ChangeDetectorRef,
    @Inject(LOCALE_ID) public locale: string
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
      fromDate: value?.fromDate || moment().startOf('month').toDate(),
      toDate: value?.toDate ?? new Date()
    };

    return this.formData;
  }

  private setTableLoading(isLoading: boolean) {
    this.flags.isTableLoading = isLoading;
  }

  onGetTableData(type: 'LOAD_DATA' | 'EXCEL' | 'CSV' = 'LOAD_DATA', pageNumber: number = this.paging.pageNumber, data: any = {}): void {
    this.setTableLoading(true);

    const pageSize = data.pageSize !== undefined ? data.pageSize : this.paging.pagesize;
    const searchString = !!this.searchTable ? this.searchTable : '';
    let fromDate = this.formData?.fromDate;
    let toDate = this.formData?.toDate;
    let divisionCode = this.formData?.divisionCode ? this.formData?.divisionCode : '';

    this.subSink.sink = this.queryService
      .getAllInBoundTrackingList(pageNumber, pageSize, searchString, fromDate, toDate, divisionCode)
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
              finalData.forEach((element: any) => {
                element.shipmentInvoice = element.shipmentInvoice ? 'Yes' : 'No';
                element.packingList = element.packingList ? 'Yes' : 'No';
                element.airwayBill = element.airwayBill ? 'Yes' : 'No';
                element.boe = element.boe ? 'Yes' : 'No';
                element.pod = element.pod ? 'Yes' : 'No';
              });

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
              finalData.forEach((element: any) => {
                element.shipmentInvoice = element.shipmentInvoice ? 'Yes' : 'No';
                element.packingList = element.packingList ? 'Yes' : 'No';
                element.airwayBill = element.airwayBill ? 'Yes' : 'No';
                element.boe = element.boe ? 'Yes' : 'No';
                element.pod = element.pod ? 'Yes' : 'No';
              });

              const gridHeaderList: HeaderList<InboundTrackingData> = [
                {field: 'poNumber', title: 'PO Number', width: 160},
                {field: 'documentNumber', title: 'GRN Number', type: 'DATE_TIME', width: 160},
                {field: 'documentDate', title: 'GRN Date', type: 'DATE_TIME', width: 160},
                {field: 'division', title: 'Division', width: 120},
                {field: 'divisionName', title: 'Division Name', width: 300},
                {field: 'groupCode', title: 'Vendor Code', width: 150},
                {field: 'groupName', title: 'Vendor', width: 150},
                {field: 'brandCode', title: 'Brand Code', width: 150},
                {field: 'brandName', title: 'Brand', width: 150},
                {field: 'supplierName', title: 'Supplier Name', width: 200},
                {field: 'currency', title: 'Currency', width: 130},
                {field: 'stockLocation', title: 'Stock Location', width: 200},
                {field: 'invoiceNo', title: 'Invoice No.', width: 180},
                {field: 'invoiceDate', title: 'Invoice Date', type: 'DATE', width: 120},
                {field: 'doNumber', title: 'DO Number', width: 180},
                {field: 'doDate', title: 'DO Date', type: 'DATE', width: 120},
                {field: 'receivedBy', title: 'Received By', width: 180},
                {field: 'receivedDate', title: 'Received Date', type: 'DATE_TIME', width: 160},
                {field: 'airwayBillNo', title: 'Airway Bill No.', width: 200},
                {field: 'deliveryMode', title: 'Delivery Mode', width: 180},
                {field: 'amount', title: 'Amount', width: 150, align: 'RIGHT'},
                {field: 'boeNumber', title: 'BOE Number', width: 180},
                {field: 'createdBy', title: 'Created By', width: 150},
                {field: 'approvedBy', title: 'Approved By', width: 150},
                {field: 'approvedDate', title: 'Approved Date', type: 'DATE_TIME', width: 150},
                {field: 'receivedToGrn', title: 'Received => GRN Booking (HH)', width: 150},
                {field: 'grnToApproval', title: 'GRN Booking => GRN Approval (HH)', width: 150},
                {field: 'dockToStock', title: 'Dock To Stock (HH)', width: 150},
                {field: 'status', title: 'Status', width: 250},
                {field: 'shipmentInvoice', title: 'Shipment Invoice', width: 150},
                {field: 'packingList', title: 'Packing List', width: 150},
                {field: 'airwayBill', title: 'Airway Bill', width: 150},
                {field: 'boe', title: 'BOE', width: 150},
                {field: 'pod', title: 'POD', width: 150}
              ];

              this.ds.exportToCSV(finalData, gridHeaderList, this.currentScreen.id);
              break;
            }

            default:
              alert('Please Add Type');
              break;
          }
        },
        error: (error: any) => {
          this.ds.showError(error);
          this.setTableLoading(false);
        },
        complete: () => {
          this.setTableLoading(false);
        }
      });
  }

  setDefaultDivision(comboData: ComboItemList) {
    setTimeout(() => {
      this.formData.divisionCode = this.userData?.divisionCode || '';
      this.onGetTableData('LOAD_DATA', 1);
    }, 0);
  }

  onViewClick(value: any) {
    // if (this.file) window.open(this.file.path, '_blank');
    if (!!value)
      this.apiS.getArrayBuffer('Common/DownloadFiles', {fileName: this.getFileName(value)}).subscribe((res) => {
        const file = new Blob([res], {type: 'application/pdf'});
        const fileURL = window.URL.createObjectURL(file);
        let width = window.outerWidth + 'px';
        let height = window.outerHeight + 'px';
        window.open(fileURL, '_blank', `toolbar=no,scrollbars=yes,resizable=yes,top=0,left=0,width=${width},height=${height}`);
      });
  }

  getFileName(value: string): string {
    let result = value?.replace(/\\/g, '/');
    result = result?.substring(result?.lastIndexOf('/') + 1);
    return result || '';
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
