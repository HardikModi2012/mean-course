import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {DialogService} from '@progress/kendo-angular-dialog';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';
import {PageChangeEvent} from '@progress/kendo-angular-pager';
import {AccessKey} from 'src/app/core/constants/access-key.constants';
import {AuditOptions} from 'src/app/core/interfaces/generic/audit-options.interface';
import {BreadCrumbItemList} from 'src/app/core/interfaces/generic/breadcrumb.interface';
import {ComboItemList} from 'src/app/core/interfaces/generic/combobox-options.interface';
import {GetDataAPI} from 'src/app/core/interfaces/generic/get-data-api.interface';
import {HeaderList} from 'src/app/core/interfaces/generic/grid.interface';
import {CurrentScreen} from 'src/app/core/interfaces/generic/screen-list.interface';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {SalesQuery} from 'src/app/core/interfaces/query/sales-query.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {QueryService} from 'src/app/core/services/query/query.service';
import {AuditLogComponent} from 'src/app/layout/components/audit-log/audit-log.component';
import {SubSink} from 'subsink';
import {debounce} from 'typescript-debounce-decorator';

@Component({
  selector: 'app-sales-query',
  templateUrl: './sales-query.component.html',
  styleUrls: ['./sales-query.component.scss']
})
export class SalesQueryComponent implements OnInit {
  userData: UserData | undefined;
  breadcrumbItems: BreadCrumbItemList;
  currentScreen!: CurrentScreen;

  flags = {
    auditDialog: false,
    isTableLoading: false,
    isFieldsSearch: false
  };
  comboData: {[key in string]: ComboItemList} = {};
  vendorCode: string = '';
  auditOptions: AuditOptions | undefined;
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
  formData: SalesQuery = this.resetData();
  searchTable: string = '';
  private subSink = new SubSink();
  originalData!: GetDataAPI<SalesQuery>;
  gridData: GridDataResult = {
    data: [],
    total: 0
  };
  accessKey = AccessKey;

  gridHeaderList: HeaderList<SalesQuery> = [
    {field: 'itemCode', title: 'Trn #', width: 150},
    {field: 'fromDate', title: 'Trn Date', width: 160, type: 'DATE_TIME'},
    {field: 'itemDesc', title: 'Item Code', width: 150},
    {field: 'vendorName', title: 'Party Name', width: 300},
    {field: 'stock', title: 'Stock', width: 100},
    {field: 'qty', title: 'Qty', width: 50, align: 'RIGHT'},
    {field: 'avgCost', title: 'Avg Cost', width: 100},
    {field: 'avgSalesPrice', title: 'Avg Sales Price', width: 100},
    {field: 'rate', title: 'Rate', width: 100}
  ];

  constructor(
    public ds: DesignService,
    private activatedRoute: ActivatedRoute,
    private queryService: QueryService,
    private dialogService: DialogService
  ) {
    const screenDetail = this.ds.setBreadcrumbItems(this.activatedRoute);
    this.breadcrumbItems = screenDetail.breadcrumbItems;
    this.currentScreen = screenDetail.currentScreen;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.onGetTableData('LOAD_DATA', 1);
  }
  resetData(value: SalesQuery | undefined = undefined): SalesQuery {
    this.formData = {
      divisionCode: value?.divisionCode || '',
      itemDesc: value?.itemDesc || '',

      fromDate: value?.fromDate || '',
      toDate: value?.toDate || '',
      brandCode: value?.brandCode || '',
      avgCost: value?.avgCost || '',
      avgSalesPrice: value?.avgSalesPrice || '',
      qty: value?.qty || '',
      binLocation: value?.binLocation || '',

      stock: value?.stock || '',
      division: value?.division || '',
      search: value?.search || '',
      withStock: value?.withStock || false
    };

    return this.formData;
  }

  onGetTableData(type: 'LOAD_DATA' | 'EXCEL' | 'CSV' = 'LOAD_DATA', pageNumber: number = this.paging.pageNumber, data: any = {}): void {
    this.flags.isTableLoading = true;
    const pageSize = data.pageSize !== undefined ? data.pageSize : this.paging.pagesize;
    const searchString = data?.form?.value || '';
    let divisionCode = this.formData.divisionCode ? this.formData.divisionCode : this.userData?.divisionCode;

    this.subSink.sink = this.queryService.getSalesQueryList(pageNumber, pageSize, searchString, divisionCode).subscribe({
      next: (success: GetDataAPI<SalesQuery>) => {
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

  setDefaultDivision(comboData: ComboItemList) {
    setTimeout(() => {
      this.formData.divisionCode = this.userData?.divisionCode || '';
      const selected = comboData.find((ele: {value: string}) => ele.value === this.userData?.divisionCode);
      this.vendorCode = selected?.code?.vendor;
      this.formData.vendor = selected?.code?.vendor;
    }, 0);
  }

  onPageChange(event: PageChangeEvent): void {
    this.paging.skip = event.skip;
    this.paging.pagesize = event.take;
    this.paging.pageNumber = event.skip / this.paging.pagesize + 1;

    this.onGetTableData('LOAD_DATA', this.paging.pageNumber);
  }

  @debounce(300)
  onFilter(form: NgForm) {
    if (this.searchTable !== '') {
      this.onGetTableData('LOAD_DATA', 0, {pageSize: 0});
    } else {
      this.onGetTableData('LOAD_DATA', 1, form);
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
      title: `${this.currentScreen.name} Audit List For : ${id}`
    };

    let ref = AuditLogComponent.open(this.dialogService, this.auditOptions);

    this.subSink.sink = ref.result.subscribe((x: any) => {
      if (x && x.auditDialog) {
      }
    });
  }

  onQuery(form: NgForm) {
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
