import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';
import {PageChangeEvent} from '@progress/kendo-angular-pager';
import {AccessKey} from 'src/app/core/constants/access-key.constants';
import {apiRoutes} from 'src/app/core/constants/api-path.constants';
import {BreadCrumbItemList} from 'src/app/core/interfaces/generic/breadcrumb.interface';
import {ComboItem, ComboItemList} from 'src/app/core/interfaces/generic/combobox-options.interface';
import {GetDataAPI} from 'src/app/core/interfaces/generic/get-data-api.interface';
import {HeaderList} from 'src/app/core/interfaces/generic/grid.interface';
import {CurrentScreen} from 'src/app/core/interfaces/generic/screen-list.interface';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {deliveryOrderStatus} from 'src/app/core/interfaces/logistics/deliveryOrderStatus.interface';
import {ApiService} from 'src/app/core/services/api.service';
import {DesignService} from 'src/app/core/services/design.service';
import {DeliveryOrderStatusService} from 'src/app/core/services/logistics/delivery-order-status.service';
import {environment} from 'src/environments/environment';
import {SubSink} from 'subsink';
import {debounce} from 'typescript-debounce-decorator';

@Component({
  selector: 'app-demo-order-status',
  templateUrl: './demo-order-status.component.html',
  styleUrls: ['./demo-order-status.component.scss']
})
export class DemoOrderStatusComponent implements OnInit {
  userData: UserData | undefined;
  breadcrumbItems: BreadCrumbItemList;
  currentScreen!: CurrentScreen;

  flags = {
    isTableLoading: false
  };
  vendorCode: string = '';
  paging = {
    totalCount: 0,
    pageable: {
      buttonCount: 3,
      info: true,
      pageSizes: [10, 25, 50, 100, 200, 500],
      previousNext: true
    },
    pagesize: 10,
    pageNumber: 1,
    skip: 0,
    filter: {}
  };

  searchTable: string = '';
  private subSink = new SubSink();
  originalData!: GetDataAPI<deliveryOrderStatus>;
  gridData: GridDataResult = {
    data: [],
    total: 0
  };
  accessKey = AccessKey;
  formData = new deliveryOrderStatus();
  comboData: {[key in string]: ComboItemList} = {};

  gridHeaderList: HeaderList<deliveryOrderStatus> = [
    {field: 'divisionCode', title: 'Division Code', width: 150},
    {field: 'divisionName', title: 'Division Name', width: 300},
    {field: 'locationCode', title: 'Location Code', width: 150},
    {field: 'locationName', title: 'Location Name', width: 300},
    {field: 'orderNo', title: 'Order No.', width: 150},
    {field: 'orderRefNo', title: 'Order Ref No.', width: 150},
    {field: 'orderCreatedDate', title: 'Order Created Date', type: 'DATE_TIME', width: 200},
    {field: 'customerName', title: 'Customer Name', width: 300},
    {field: 'orderStatus', title: 'Order Status', width: 200},
    {field: 'demoPeriod', title: 'Demo Period', width: 100},
    {field: 'brand', title: 'Brand', width: 150},
    {field: 'vendor', title: 'Vendor', width: 100},
    {field: 'shipmentDate', title: 'Shipment Date', type: 'DATE_TIME', width: 200}
  ];

  constructor(
    public ds: DesignService,
    private activatedRoute: ActivatedRoute,
    private delOrdStatusService: DeliveryOrderStatusService,
    public apiS: ApiService
  ) {
    const screenDetail = this.ds.setBreadcrumbItems(this.activatedRoute);
    this.breadcrumbItems = screenDetail.breadcrumbItems;
    this.currentScreen = screenDetail.currentScreen;
  }

  ngOnInit(): void {}

  onGetTableData(type: 'LOAD_DATA' | 'EXCEL' | 'CSV' = 'LOAD_DATA', pageNumber: number = this.paging.pageNumber, data: any = {}): void {
    this.flags.isTableLoading = true;
    const pageSize = data.pageSize !== undefined ? data.pageSize : this.paging.pagesize;
    const searchString = !!this.searchTable ? this.searchTable : '';

    this.subSink.sink = this.delOrdStatusService.getDemoOrderStatus(pageNumber, pageSize, searchString, this.formData).subscribe({
      next: (success: GetDataAPI<deliveryOrderStatus>) => {
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

            const gridHeaderList: HeaderList<deliveryOrderStatus> = [
              {field: 'divisionCode', title: 'Division Code', width: 150},
              {field: 'divisionName', title: 'Division Name', width: 300},
              {field: 'locationCode', title: 'Location Code', width: 150},
              {field: 'locationName', title: 'Location Name', width: 300},
              {field: 'orderNo', title: 'Order No.', width: 150},
              {field: 'orderRefNo', title: 'Order Ref No.', width: 150},
              {field: 'orderCreatedDate', title: 'Order Created Date', type: 'DATE_TIME', width: 200},
              {field: 'customerName', title: 'Customer Name', width: 300},
              {field: 'orderStatus', title: 'Order Status', width: 200},
              {field: 'demoPeriod', title: 'Demo Period', width: 200},
              {field: 'brand', title: 'Brand', width: 150},
              {field: 'vendor', title: 'Vendor', width: 100},
              {field: 'shipmentDate', title: 'Shipment Date', type: 'DATE_TIME', width: 200}
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
        this.flags.isTableLoading = false;
      },
      complete: () => {
        this.flags.isTableLoading = false;
      }
    });
  }

  onPageChange(event: PageChangeEvent): void {
    this.paging.skip = event.skip;
    this.paging.pagesize = event.take;
    this.paging.pageNumber = event.skip / this.paging.pagesize + 1;

    this.onGetTableData('LOAD_DATA', this.paging.pageNumber);
  }

  onVendorChange(vendor: string, divisionCodeRef: ComboBoxComponent, vendorCodeRef: ComboBoxComponent) {
    if (!vendorCodeRef?.dataItem?.value) {
      this.formData.brandCode = '';
    }
    if (divisionCodeRef?.dataItem?.code.vendor !== vendor) {
      this.formData.divisionCode = '';
    }
  }

  @debounce(300)
  onFilter() {
    this.onGetTableData('LOAD_DATA', 1);
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

  onDivisionCodeChange(divisionCodeRef: ComboBoxComponent) {
    this.formData.vendorCode = divisionCodeRef?.dataItem?.code.vendor || '';
    this.formData.brandCode = divisionCodeRef?.dataItem?.code.brandCode || '';
  }

  setDefaultBrand(comboData: ComboItemList) {
    if (!!comboData && comboData?.length === 1) {
      this.formData.brandCode = comboData[0]?.value || '';
    }
  }

  setDefaultVendor(comboData: ComboItemList) {
    setTimeout(() => {
      let selected = undefined;
      if (this.formData.vendorCode) {
        selected = comboData.find((ele: ComboItem) => ele.value === this.formData.vendorCode);
        this.formData.vendorCode = selected?.value || '';
      } else {
        selected = comboData.find((ele: ComboItem) => ele?.isFlag === true);
      }
    }, 0);
  }

  setDefaultDivision(comboData: ComboItemList) {
    setTimeout(() => {
      this.formData.divisionCode = this.userData?.divisionCode || '';
      const selected = comboData.find((ele: {value: string}) => ele.value === this.userData?.divisionCode);
      this.formData.vendorCode = selected?.code?.vendor;
    }, 0);
  }

  onViewInvoiceClick(data: any) {
    this.onViewClick(data);
  }

  onViewPodClick(data: any) {
    this.onViewClick(data);
  }

  onViewAtt1Click(data: any) {
    this.onViewClick(data);
  }

  onViewAtt2Click(data: any) {
    this.onViewClick(data);
  }

  onViewAtt3Click(data: any) {
    this.onViewClick(data);
  }

  onViewClick(value: any) {
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

  onSubmit(form: NgForm) {
    if (!form?.valid) {
      form?.form.markAllAsTouched();
      return;
    }
    this.onGetTableData('LOAD_DATA', 1, form);
  }

  onDeliveryNoteView(item: any) {
    if (!!item.invoice) {
      window.open(`${environment.CLIENT_URL}download/demo-delivery-note-pdf?s=${item?.invoice}`, '_blank');
    } else {
      this.apiS
        .getText(apiRoutes.getEncryptedString, {
          divisionCode: item.divisionCode,
          locationCode: item.locationCode,
          docNo: item.orderNo
        })
        .subscribe({
          next: (success) => {
            window.open(`${environment.CLIENT_URL}download/demo-delivery-note-pdf?s=${success}`, '_blank');
          },
          error: (error) => {
            this.ds.showError(error);
          }
        });
    }
  }

  onInvoiceView(item: any) {
    if (!!item.invoice) {
      window.open(`${environment.CLIENT_URL}download/demo-commercial-invoice?s=${item?.invoice}`, '_blank');
    } else {
      this.apiS
        .getText(apiRoutes.getEncryptedString, {
          divisionCode: item.divisionCode,
          locationCode: item.locationCode,
          docNo: item.orderNo
        })
        .subscribe({
          next: (success) => {
            window.open(`${environment.CLIENT_URL}download/demo-commercial-invoice?s=${success}`, '_blank');
          },
          error: (error) => {
            this.ds.showError(error);
          }
        });
    }
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
