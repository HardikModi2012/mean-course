import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DialogService} from '@progress/kendo-angular-dialog';
import {GridComponent, GridDataResult, PageChangeEvent} from '@progress/kendo-angular-grid';
import {NozomiVendorConst, SHSVendorConst} from 'src/app/core/constants/validation.constants';
import {AuditOptions} from 'src/app/core/interfaces/generic/audit-options.interface';
import {BreadCrumbItemList} from 'src/app/core/interfaces/generic/breadcrumb.interface';
import {GetDataAPI} from 'src/app/core/interfaces/generic/get-data-api.interface';
import {CurrentScreen} from 'src/app/core/interfaces/generic/screen-list.interface';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {RmaOrderInterface} from 'src/app/core/interfaces/transaction/rma-order.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {LoaderService} from 'src/app/core/services/loader.service';
import {TransactionService} from 'src/app/core/services/transaction.service';
import {AuditLogComponent} from 'src/app/layout/components/audit-log/audit-log.component';
import {DeleteConfirmationComponent} from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';
import {SubSink} from 'subsink';
import {debounce} from 'typescript-debounce-decorator';
import {AccessKey} from './../../core/constants/access-key.constants';
import {AddUpdateDemoInvoiceComponent} from './add-update-demo-invoice/add-update-demo-invoice.component';

@Component({
  selector: 'app-demo-invoice',
  templateUrl: './demo-invoice.component.html',
  styleUrls: ['./demo-invoice.component.scss']
})
export class DemoInvoiceComponent implements OnInit {
  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  private subSink = new SubSink();

  private originalData!: GetDataAPI<RmaOrderInterface>;

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
    auditDialog: false,
    isTableLoading: false,
    showIfShsDivision: () => SHSVendorConst.includes(this.userData?.vendorCode || ''),
    showIfNozomiDivision: () => NozomiVendorConst.includes(this.userData?.vendorCode || '')
  };

  gridHeaderList: any = [
    {field: 'divisionCode', title: 'Division Code', width: 120},
    {field: 'divisionName', title: 'Division Name', width: 300},
    {field: 'docNo', title: 'Invoice No', width: 120},
    {field: 'docDate', title: 'Invoice Date', width: 160, type: 'DATE_TIME'},
    {field: 'rmaNo', title: 'Order Ref', width: 200},
    {field: 'vendor', title: 'Vendor', width: 180},
    {field: 'brand', title: 'Brand', width: 180},
    {field: 'customerName', title: 'Customer Name', width: 300},
    {field: 'customerRegion', title: 'Customer Region', width: 180},
    {field: 'customerCountry', title: 'Customer Country', width: 180},
    {field: 'stockLocationCode', title: 'Stock Location Code', width: 180},
    {field: 'locationName', title: 'Stock Location Name', width: 300},
    {field: 'deliveryType', title: 'Delivery Type', width: 180},
    {field: 'demoPeriod', title: 'Demo Period', width: 120},
    {field: 'orderReceivedDate', title: 'Order Received Date', type: 'DATE_TIME', width: 200},
    {field: 'pocId', title: 'POC Id', width: 150, hideFun: () => !this.flags.showIfNozomiDivision()},
    {field: 'pocName', title: 'POC Name', width: 300, hideFun: () => !this.flags.showIfNozomiDivision()},
    {field: 'shipmentName', title: 'Shipment Name', width: 300, hideFun: () => !this.flags.showIfNozomiDivision()}
    // {field: 'expectedDeliveryDate', title: 'Expected Delivery Date', width: 120, type: 'DATE'},
    // {field: 'timeFrom', title: 'From Time', width: 100, type: 'TIME'},
    // {field: 'timeTo', title: 'To Time', width: 100, type: 'TIME'},
    // {field: 'dlvNo', title: 'DLV No', width: 180, hideFun: () => !this.flags.showIfShsDivision()}
  ];

  gridData: GridDataResult = {
    data: [],
    total: 0
  };

  userData: UserData | undefined;

  breadcrumbItems: BreadCrumbItemList;

  currentScreen!: CurrentScreen;

  auditOptions: AuditOptions | undefined;

  searchTable: string = '';

  accessKey = AccessKey;

  constructor(
    public ds: DesignService,
    private activatedRoute: ActivatedRoute,
    private transactionService: TransactionService,
    private dialogService: DialogService,
    private loader: LoaderService
  ) {
    this.accessKey = ds.accessKey;
    const screenDetail = this.ds.setBreadcrumbItems(this.activatedRoute);
    this.breadcrumbItems = screenDetail.breadcrumbItems;
    this.currentScreen = screenDetail.currentScreen;
    this.onGetTableData('LOAD_DATA', 1);
  }

  ngOnInit(): void {}

  private setTableLoading(isLoading: boolean) {
    this.flags.isTableLoading = isLoading;
  }

  onViewClick(data: any) {
    let ref = AddUpdateDemoInvoiceComponent.Open(this.dialogService, 'READ', data);
    this.subSink.sink = ref.result.subscribe((_modelResponse) => {});
  }

  onAddClick() {
    let ref = AddUpdateDemoInvoiceComponent.Open(this.dialogService, 'CREATE', null);
    this.subSink.sink = ref.result.subscribe((modelResponse: any) => {
      if (modelResponse && modelResponse.isItemAdded) {
        this.onGetTableData('LOAD_DATA', 1);
      }
    });
  }

  onEditClick(data: any) {
    let ref = AddUpdateDemoInvoiceComponent.Open(this.dialogService, 'UPDATE', data);
    this.subSink.sink = ref.result.subscribe((modelResponse: any) => {
      if (modelResponse && modelResponse.isItemAdded) {
        this.onGetTableData('LOAD_DATA', 1);
      }
    });
  }

  onDeleteClick(demoInvoice: any) {
    let dialogRef = DeleteConfirmationComponent.open(this.dialogService, {
      title: 'Are you sure?',
      message: 'Do you really want to delete this Demo Invoice Document No? This process can not be undone'
    });

    this.subSink.sink = dialogRef.result.subscribe((data: any) => {
      if (data && data.isDelete) {
        this.loader.open();
        this.subSink.sink = this.transactionService.deleteDemoInvoice(demoInvoice.docNo).subscribe({
          next: (success: string) => {
            this.ds.showNotification({
              content: `Demo Invoice Document No.:- ${success} Deleted Successfully`,
              type: 'success'
            });
            this.onGetTableData('LOAD_DATA', 1);
          },
          error: (error: any) => {
            this.loader.close();
            this.ds.showError(error);
          },
          complete: () => {
            this.loader.close();
          }
        });
      }
    });
  }

  onGetTableData(type: 'LOAD_DATA' | 'EXCEL' | 'CSV' = 'LOAD_DATA', pageNumber: number = this.paging.pageNumber, data: any = {}): void {
    this.setTableLoading(true);

    const pageSize = data.pageSize !== undefined ? data.pageSize : this.paging.pagesize;
    const searchString = !!this.searchTable ? this.searchTable : '';
    const transType = this.currentScreen.transType || '';

    this.subSink.sink = this.transactionService.getAllRmaReturn(pageNumber, pageSize, searchString, transType).subscribe({
      next: (success: any) => {
        const list = this.gridHeaderList.filter((h: any) => ['DATE', 'DATE_TIME'].includes(h?.type));
        success?.data?.forEach((item: any) => {
          list.forEach((header: any) => {
            switch (header.type) {
              case 'DATE':
              case 'DATE_TIME':
                item[header.field] = !!item?.[header.field] ? new Date(item?.[header.field]) : '';
                break;

              default:
                break;
            }
          });
        });
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
        this.setTableLoading(false);
        this.ds.showError(error);
      },
      complete: () => {
        this.setTableLoading(false);
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

  onAuditClick(id: string) {
    if (!id) {
      return;
    }
    this.auditOptions = {
      code: this.currentScreen.id,
      id: id,
      title: `${this.currentScreen.name} Audit List For Voucher No: ${id}`,
      noTitle: 'Voucher No'
    };

    let ref = AuditLogComponent.open(this.dialogService, this.auditOptions);

    this.subSink.sink = ref.result.subscribe((x: any) => {
      if (x && x.auditDialog) {
      }
    });
  }

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
    return {
      format: header.format
    };
  }
}
