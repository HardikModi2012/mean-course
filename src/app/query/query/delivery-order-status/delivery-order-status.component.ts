import {Component, Inject, LOCALE_ID, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';
import {PageChangeEvent} from '@progress/kendo-angular-pager';
import {AccessKey} from 'src/app/core/constants/access-key.constants';
import {apiRoutes} from 'src/app/core/constants/api-path.constants';
import {PhilipsVendorConst, SHSVendorConst} from 'src/app/core/constants/validation.constants';
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
  selector: 'app-delivery-order-status',
  templateUrl: './delivery-order-status.component.html',
  styleUrls: ['./delivery-order-status.component.scss']
})
export class DeliveryOrderStatusComponent implements OnInit {
  userData: UserData | undefined;
  breadcrumbItems: BreadCrumbItemList;
  currentScreen!: CurrentScreen;

  flags = {
    isTableLoading: false,
    showIfShsVendor: (vendorCode: string) => SHSVendorConst.includes(vendorCode),
    showIfPhilipsVendor: (vendorCode: string) => PhilipsVendorConst.includes(vendorCode)
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
    // {
    //   field: 'requestNo',
    //   title: 'Request No',
    //   width: 150,
    //   type: 'LINK',
    //   typeConfig: {
    //     routerLink: (data: any) => {
    //       return {link: `/transaction/rma-request?view=${data}`, target: '_self', disabled: false};
    //     }
    //   }
    // },
    {
      field: 'invoiceNo',
      title: 'Invoice No',
      width: 150,
      type: 'LINK',
      typeConfig: {
        routerLink: (data: any) => {
          return {link: `/transaction/sales-invoice?view=${data}`, target: '_self', disabled: false};
        }
      }
    },
    {field: 'rmaNo', title: 'Order Ref / RMA No.', width: 150},
    {field: 'customerCountry', title: 'Customer Country', width: 200},
    {field: 'region', title: 'Region', width: 150},
    {field: 'customerName', title: 'Customer Name', width: 300},
    {field: 'orderStatus', title: 'Status', width: 200},
    {field: 'deliveryMode', title: 'Delivery Mode', width: 200},
    {field: 'awbNo', title: 'AWB No', width: 150},
    {field: 'orderType', title: 'Type', width: 200},
    {field: 'brand', title: 'Brand', width: 150},
    {field: 'vendor', title: 'Vendor', width: 100},
    {field: 'orderNo', title: 'Order No', width: 300},
    {field: 'orderReceivedDate', title: 'Order Received Date', type: 'DATE_TIME', width: 200},
    {field: 'orderCreatedDate', title: 'Order Created Date', type: 'DATE_TIME', width: 200},
    {field: 'orderAcknowledgedDate', title: 'Order Acknowledged Date', type: 'DATE_TIME', width: 200},
    {field: 'expectedDeliveryDate', title: 'Expected Delivery Date', type: 'DATE_TIME', width: 200},
    {field: 'shipmentDate', title: 'Shipment Date', type: 'DATE_TIME', width: 160},
    {field: 'deliveryDate', title: 'Delivery Date', type: 'DATE_TIME', width: 160},
    {field: 'requestCreatedBy', title: 'Request Created By', width: 200},
    {field: 'orderCreatedBy', title: 'Order Created By', width: 200},
    {field: 'invoiceCreatedby', title: 'Invoice Created By', width: 200},
    {field: 'reasonForDelay', title: 'Reason for Delay', width: 300},
    {field: 'tat', title: 'TAT(Hrs)', width: 150},
    {field: 'sla', title: 'SLA', width: 120},
    {field: 'dlvNo', title: 'DLVNo', width: 150}
  ];

  constructor(
    public ds: DesignService,
    private activatedRoute: ActivatedRoute,
    private delOrdStatusService: DeliveryOrderStatusService,
    public apiS: ApiService,
    @Inject(LOCALE_ID) public locale: string
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

    this.subSink.sink = this.delOrdStatusService.getDeliveryOrderStatus(pageNumber, pageSize, searchString, this.formData).subscribe({
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
            finalData.forEach((element: any) => {
              element.attachment1 = element.attachment1 ? 'Yes' : 'No';
              element.attachment2 = element.attachment2 ? 'Yes' : 'No';
              element.attachment3 = element.attachment3 ? 'Yes' : 'No';
              element.invoice = element.invoice ? 'Yes' : 'No';
              element.proofOfDelivery = element.proofOfDelivery ? 'Yes' : 'No';
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
              element.attachment1 = element.attachment1 ? 'Yes' : 'No';
              element.attachment2 = element.attachment2 ? 'Yes' : 'No';
              element.attachment3 = element.attachment3 ? 'Yes' : 'No';
              element.invoice = element.invoice ? 'Yes' : 'No';
              element.proofOfDelivery = element.proofOfDelivery ? 'Yes' : 'No';
            });

            const gridHeaderList: HeaderList<deliveryOrderStatus> = [
              {field: 'requestNo', title: 'Request No', width: 150},
              {field: 'invoiceNo', title: 'Invoice No', width: 150},
              {field: 'rmaNo', title: 'Order Ref / RMA No.', width: 150},
              {field: 'customerCountry', title: 'Customer Country', width: 200},
              {field: 'region', title: 'Region', width: 150},
              {field: 'customerName', title: 'Customer Name', width: 300},
              {field: 'orderStatus', title: 'Status', width: 200},
              {field: 'deliveryMode', title: 'Delivery Mode', width: 200},
              {field: 'awbNo', title: 'AWB No', width: 150},
              {field: 'orderType', title: 'Type', width: 200},
              {field: 'brand', title: 'Brand', width: 150},
              {field: 'vendor', title: 'Vendor', width: 100},
              {field: 'orderNo', title: 'Order No', width: 300},
              {field: 'orderReceivedDate', title: 'Order Received Date', type: 'DATE_TIME', width: 200},
              {field: 'orderCreatedDate', title: 'Order Created Date', type: 'DATE_TIME', width: 200},
              {field: 'orderAcknowledgedDate', title: 'Order Acknowledged Date', type: 'DATE_TIME', width: 200},
              {field: 'expectedDeliveryDate', title: 'Expected Delivery Date', type: 'DATE_TIME', width: 200},
              {field: 'shipmentDate', title: 'Shipment Date', type: 'DATE_TIME', width: 160},
              {field: 'deliveryDate', title: 'Delivery Date', type: 'DATE_TIME', width: 160},
              {field: 'requestCreatedBy', title: 'Request Created By', width: 200},
              {field: 'orderCreatedBy', title: 'Order Created By', width: 200},
              {field: 'invoiceCreatedby', title: 'Invoice Created By', width: 200},
              {field: 'reasonForDelay', title: 'Reason for Delay', width: 300},
              {field: 'tat', title: 'TAT(Hrs)', width: 150},
              {field: 'sla', title: 'SLA', width: 120},
              {field: 'dlvNo', title: 'DLVNo', width: 150},
              {
                field: 'invoice',
                title: 'Invoice',
                width: 150
              },
              {field: 'proofOfDelivery', title: 'Proof Of Delivery', width: 150},
              {field: 'attachment1', title: 'Attachment 1', width: 150},
              {field: 'attachment2', title: 'Attachment 2', width: 150},
              {field: 'attachment3', title: 'Attachment 3', width: 150}
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

  onVendorChange(vendor: string, divisionCodeRef: ComboBoxComponent, vendorCodeRef: ComboBoxComponent) {
    if (!vendorCodeRef?.dataItem?.value) {
      this.formData.brandCode = '';
    }
    if (divisionCodeRef?.dataItem?.code.vendor !== vendor) {
      this.formData.divisionCode = '';
    }
  }

  onViewClick(value: any) {
    this.apiS.viewFile(value);
  }
  onSubmit(form: NgForm) {
    if (!form?.valid) {
      form?.form.markAllAsTouched();
      return;
    }
    this.onGetTableData('LOAD_DATA', 1, form);
  }

  onDeliveryTypeChange() {
    setTimeout(() => {
      this.formData.type = !!this.formData.type ? this.formData.type : 'DELIVERY';
    }, 0);
  }

  onDeliveryNoteView(item: any) {
    const openUrl = (encryptedString: string) => {
      if (this.flags.showIfShsVendor(item.vendorCode)) {
        window.open(`${environment.CLIENT_URL}download/delivery-note/${encryptedString}`, '_blank');
      } else if (this.flags.showIfPhilipsVendor(item.vendorCode)) {
        window.open(`${environment.CLIENT_URL}download/philips-delivery-note?s=${encryptedString}`, '_blank');
      } else {
        window.open(`${environment.CLIENT_URL}download/delivery-note-pdf?s=${encryptedString}`, '_blank');
      }
    };

    if (!!item.invoice) {
      openUrl(item?.invoice);
    } else {
      this.apiS
        .getText(apiRoutes.getEncryptedString, {
          divisionCode: item.divisionCode,
          locationCode: item.locationCode,
          docNo: item.orderNo
        })
        .subscribe({
          next: (success) => {
            openUrl(success);
          },
          error: (error) => {
            this.ds.showError(error);
          }
        });
    }
  }

  onInvoiceView(item: any) {
    if (!!item.invoice) {
      window.open(`${environment.CLIENT_URL}download/sales-commercial-invoice?s=${item?.invoice}`, '_blank');
    } else {
      this.apiS
        .getText(apiRoutes.getEncryptedString, {
          divisionCode: item.divisionCode,
          locationCode: item.locationCode,
          docNo: item.orderNo
        })
        .subscribe({
          next: (success) => {
            window.open(`${environment.CLIENT_URL}download/sales-commercial-invoice?s=${success}`, '_blank');
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
