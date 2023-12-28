import {Component, Input, OnInit} from '@angular/core';
import {GridDataResult} from '@progress/kendo-angular-grid';
import {PageChangeEvent} from '@progress/kendo-angular-pager';
import {GetDataAPI} from 'src/app/core/interfaces/generic/get-data-api.interface';
import {HeaderList} from 'src/app/core/interfaces/generic/grid.interface';
import {deliveryOrderStatus} from 'src/app/core/interfaces/logistics/deliveryOrderStatus.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {DeliveryOrderStatusService} from 'src/app/core/services/logistics/delivery-order-status.service';
import {SubSink} from 'subsink';

@Component({
  selector: 'app-delivery-child-grid',
  templateUrl: './delivery-child-grid.component.html',
  styleUrls: ['./delivery-child-grid.component.scss']
})
export class DeliveryChildGridComponent implements OnInit {
  @Input() public category: any | undefined;
  @Input() public isChild: boolean | undefined;
  flags = {
    isTableLoading: false
  };
  gridData: GridDataResult = {
    data: [],
    total: 0
  };
  isLoading: boolean | undefined;
  public skip = 0;
  private subSink = new SubSink();
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
  originalData!: GetDataAPI<deliveryOrderStatus>;

  gridHeaderList: HeaderList<deliveryOrderStatus> = [
    {field: 'lpono', title: 'Order Ref/ RMA No.', width: 120},
    {field: 'itCode', title: 'Item Code', width: 100},
    {field: 'itDesc', title: 'Item Description', width: 200},
    {field: 'batchNo', title: 'RFID', width: 100},
    {field: 'vendorSerialNo', title: 'Vendor Serial No', width: 100},
    {field: 'productCode', title: 'Main Product Code', width: 100},
    {field: 'productSerialNo', title: 'Main Product Serial No', width: 100},
    {field: 'ptype', title: 'Type', width: 100},
    {field: 'originalPONo', title: 'Original PO No', width: 100},
    {field: 'shipmentBatchNo', title: 'Shipment Batch No', width: 100},
    {field: 'sapNo', title: 'SAP No', width: 100},
    {field: 'itQty', title: 'Qty', width: 100, type: 'NUMBER', typeConfig: {decimal: 0}},
    {field: 'requestNo', title: 'Request No', width: 100}
    // {field: '', title: 'Request No', width: 100}
    // {field: '', title: '', width: 100},
    // {field: '', title: '', width: 100},
  ];

  constructor(private service: DeliveryOrderStatusService, public ds: DesignService) {}

  public ngOnInit(): void {
    // this.isLoading = this.flags.isTableLoading;
    this.onGetTableData('LOAD_DATA', this.paging.pageNumber);
  }

  onGetTableData(type: 'LOAD_DATA' | 'EXCEL' | 'CSV' = 'LOAD_DATA', pageNumber: number = this.paging.pageNumber, data: any = {}): void {
    this.flags.isTableLoading = true;
    this.subSink.sink = this.service.getChildGridData(this.category).subscribe({
      next: (success: any) => {
        switch (type) {
          case 'LOAD_DATA': {
            const totalCount = success.totalCount ? success.data.length : 0;
            this.originalData = success;
            this.paging.totalCount = totalCount;
            this.gridData = {
              data: success,
              total: totalCount
            };
            if (pageNumber === 1) {
              this.paging.skip = 0;
            }
            break;
          }

          // case 'EXCEL': {
          //   const finalData = success.data;
          //   finalData.forEach((element: any) => {
          //     element.invoice = element.invoice ? 'Yes' : 'No';
          //   });

          //   this.paging.totalCount = success.totalCount;
          //   this.gridData = {
          //     data: finalData,
          //     total: success.totalCount
          //   };
          //   setTimeout(() => {
          //     data.grid.saveAsExcel();
          //     // const totalCount = !this.searchTable ? this.originalData.totalCount : this.originalData.data.length;
          //     const totalCount = 0;
          //     this.gridData = {
          //       data: this.originalData.data,
          //       total: totalCount
          //     };
          //   }, 0);
          //   break;
          // }

          // case 'CSV': {
          //   const finalData = success.data;
          //   finalData.forEach((element: any) => {
          //     element.invoice = element.invoice ? 'Yes' : 'No';
          //   });

          //   const gridHeaderList: HeaderList<deliveryOrderStatus> = [
          //     {field: 'orderRefNo', title: 'Order Ref / RMA No.', width: 150},
          //     {field: 'orderCreatedDate', title: 'Order Created Date', type: 'DATE_TIME', width: 200},
          //     {field: 'customerName', title: 'Customer Name', width: 300},
          //     {field: 'orderStatus', title: 'Order Status', width: 200},
          //     {field: 'demoPeriod', title: 'Demo Period', width: 200},
          //     {field: 'brand', title: 'Brand', width: 150},
          //     {field: 'vendor', title: 'Vendor', width: 100},
          //     {field: 'shipmentDate', title: 'Shipment Date', type: 'DATE_TIME', width: 200}
          //   ];

          //   this.ds.exportToCSV(finalData, gridHeaderList, '');
          //   break;
          // }

          default:
            alert('Please Add Type');
            break;
        }
      },
      error: (error: any) => {
        this.ds.showError(error);
        // this.flags.isTableLoading = false;
      },
      complete: () => {
        this.flags.isTableLoading = false;
      }
    });
  }

  public pageChange({skip, take}: PageChangeEvent): void {
    this.skip = skip;
    // this.service.queryForCategory(this.category.CategoryID, {skip, take});
  }
}
