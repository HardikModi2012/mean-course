import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';
import {PageChangeEvent} from '@progress/kendo-angular-pager';
import {AccessKey} from 'src/app/core/constants/access-key.constants';
import {BreadCrumbItemList} from 'src/app/core/interfaces/generic/breadcrumb.interface';
import {ComboItem, ComboItemList} from 'src/app/core/interfaces/generic/combobox-options.interface';
import {GetDataAPI} from 'src/app/core/interfaces/generic/get-data-api.interface';
import {HeaderList} from 'src/app/core/interfaces/generic/grid.interface';
import {CurrentScreen} from 'src/app/core/interfaces/generic/screen-list.interface';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {deliveryOrderQuery} from 'src/app/core/interfaces/logistics/deliveryOrderQuery.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {DeliveryOrderQueryService} from 'src/app/core/services/logistics/delivery-order-query.service';
import {SubSink} from 'subsink';
import {debounce} from 'typescript-debounce-decorator';

@Component({
  selector: 'app-delivery-order-query',
  templateUrl: './delivery-order-query.component.html',
  styleUrls: ['./delivery-order-query.component.scss']
})
export class DeliveryOrderQueryComponent implements OnInit {
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
  originalData!: GetDataAPI<deliveryOrderQuery>;
  gridData: GridDataResult = {
    data: [],
    total: 0
  };
  accessKey = AccessKey;
  formData = new deliveryOrderQuery();
  comboData: {[key in string]: ComboItemList} = {};

  gridHeaderList: HeaderList<deliveryOrderQuery> = [
    {field: 'orderRef', title: 'Order Ref / RMA No.', width: 200},
    {field: 'orderDate', title: 'Order Date', type: 'DATE_TIME', width: 160},
    {field: 'customerName', title: 'Customer Name', width: 300},
    {field: 'locationName', title: 'Location Name', width: 300},
    {field: 'country', title: 'Customer Country', width: 150},
    {field: 'brand', title: 'Brand', width: 200},
    {field: 'itemCode', title: 'Item Code', width: 300},
    {field: 'itemDesc', title: 'Item Description', width: 500},
    {
      field: 'qty',
      title: 'Qty',
      width: 120,
      typeConfig: {
        decimal: 0
      },
      type: 'NUMBER',
      align: 'RIGHT'
    },
    {field: 'rfid', title: 'RFID', width: 150},
    {field: 'vendorSerialNo', title: 'Vendor Serial No', width: 200},
    {field: 'mainProductCode', title: 'Main Product Code', width: 200},
    {field: 'mainProductSerialNo', title: 'Main Product Serial No', width: 200},
    {field: 'orderType', title: 'Type', width: 150},
    {field: 'originalPONo', title: 'Original PO No', width: 200},
    {field: 'shipmentBatchNo', title: 'Shipment Batch No', width: 150},
    {field: 'sapNo', title: 'SAP No', width: 150},
    {field: 'orderNo', title: 'Order No', width: 150},
    {field: 'locationCode', title: 'Location Code', width: 150},
    // {field: 'invoice', title: 'Invoice', width: 120},
    {field: 'emailReceived', title: 'Order Received Date & Time', type: 'DATE_TIME', width: 160},
    {field: 'fulfilmentNo', title: 'Fulfilment No', width: 150},
    {field: 'salesOrderRef', title: 'Sales Order Ref.', width: 120},
    {field: 'incoterms', title: 'Incoterms', width: 150},
    {field: 'accountNo', title: 'Account No.', width: 120}
  ];

  constructor(public ds: DesignService, private activatedRoute: ActivatedRoute, private delOrdQueryService: DeliveryOrderQueryService) {
    const screenDetail = this.ds.setBreadcrumbItems(this.activatedRoute);
    this.breadcrumbItems = screenDetail.breadcrumbItems;
    this.currentScreen = screenDetail.currentScreen;
  }

  ngOnInit(): void {}

  onGetTableData(type: 'LOAD_DATA' | 'EXCEL' | 'CSV' = 'LOAD_DATA', pageNumber: number = this.paging.pageNumber, data: any = {}): void {
    this.flags.isTableLoading = true;
    const pageSize = data.pageSize !== undefined ? data.pageSize : this.paging.pagesize;
    let divisionCode = this.formData?.divisionCode ? this.formData?.divisionCode : '';
    let locationCode = this.formData?.locationCode ? this.formData?.locationCode : '';

    this.subSink.sink = this.delOrdQueryService
      .getDeliveryOrderQuery(pageNumber, pageSize, divisionCode, locationCode, this.formData)
      .subscribe({
        next: (success: GetDataAPI<deliveryOrderQuery>) => {
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
        },
        complete: () => {
          this.flags.isTableLoading = false;
        }
      });
  }

  onDivisionCodeChange(divisionCodeRef: ComboBoxComponent) {
    this.formData.locationCode = divisionCodeRef?.dataItem?.code.locationCode || '';
    this.formData.vendorCode = divisionCodeRef?.dataItem?.code.vendor || '';
    this.formData.fsl = divisionCodeRef?.dataItem?.code.fsl || '';
    this.formData.brandCode = divisionCodeRef?.dataItem?.code.brandCode || '';
  }

  onVendorChange(vendor: string, divisionCodeRef: ComboBoxComponent, vendorCodeRef: ComboBoxComponent) {
    if (!vendorCodeRef?.dataItem?.value) {
      this.formData.brandCode = '';
    }
    if (divisionCodeRef?.dataItem?.code.vendor !== vendor) {
      this.formData.divisionCode = '';
      this.formData.fsl = '';
    }
  }

  setDefaultBrand(comboData: ComboItemList) {
    if (!!comboData && comboData?.length === 1) {
      this.formData.brandCode = comboData[0]?.value || '';
    }
  }

  clearSelectedOptions() {
    (this.formData.itemCode = ''), (this.formData.description = '');
  }
  setDefaultLocation(comboData: any) {
    setTimeout(() => {
      let selected = undefined;
      if (this.formData.locationCode) {
        selected = comboData.find((ele: ComboItem) => ele.value === this.formData.locationCode);
        this.formData.locationCode = selected?.value || '';
      } else {
        selected = comboData.find((ele: ComboItem) => ele?.isFlag === true);
      }

      if (!selected) {
        selected = comboData.find((ele: {value: string}) => {
          return ele.value.charAt(0) === 'G';
        });
      }
      this.formData.locationCode = selected?.value || '';
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
  }

  @debounce(300, {leading: true})
  onExportToCsv() {
    this.onGetTableData('CSV', 1, {pageSize: 0});
  }

  setDefaultDivision(comboData: ComboItemList) {
    setTimeout(() => {
      this.formData.divisionCode = this.userData?.divisionCode || '';
      const selected = comboData.find((ele: {value: string}) => ele.value === this.userData?.divisionCode);
      this.formData.vendorCode = selected?.code?.vendor;
      this.vendorCode = selected?.code?.vendor;
      // this.formData.vendorCode = selected?.code?.vendor;
    }, 0);
  }

  onSubmit(form: NgForm) {
    if (!form?.valid) {
      form?.form.markAllAsTouched();
      return;
    }
    this.onGetTableData('LOAD_DATA', 1, form);
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
