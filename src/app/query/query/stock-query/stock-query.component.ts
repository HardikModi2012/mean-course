import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {DialogService} from '@progress/kendo-angular-dialog';
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
import {StockQuery} from 'src/app/core/interfaces/transaction/stock-query.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {QueryService} from 'src/app/core/services/query/query.service';
import {SubSink} from 'subsink';
import {debounce} from 'typescript-debounce-decorator';

@Component({
  selector: 'app-stock-query',
  templateUrl: './stock-query.component.html',
  styleUrls: ['./stock-query.component.scss']
})
export class StockQueryComponent implements OnInit {
  userData: UserData | undefined;
  breadcrumbItems: BreadCrumbItemList;
  currentScreen!: CurrentScreen;

  flags = {
    isTableLoading: false,
    showIfColumn: () => ['STOCK_QUERY_BIN_LOCATION'].includes(this.currentScreen.id)
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
    pagesize: 25,
    pageNumber: 1,
    skip: 0,
    filter: {}
  };

  searchTable: string = '';
  private subSink = new SubSink();
  originalData!: GetDataAPI<StockQuery>;
  gridData: GridDataResult = {
    data: [],
    total: 0
  };
  accessKey = AccessKey;
  formData = new StockQuery();
  comboData: {[key in string]: ComboItemList} = {};

  gridHeaderList: HeaderList<StockQuery> = [
    {field: 'itemCode', title: 'Item Code', width: 150},
    {field: 'itemDescription', title: 'Item Description', width: 300},
    {field: 'itemUnit', title: 'Unit', width: 150},
    {
      field: 'binLocation',
      title: 'Bin Location',
      width: 100,
      hideFun: () => !this.flags.showIfColumn()
    },
    {field: 'stock', title: 'Stock', width: 100},
    {
      field: 'pendingPO',
      title: 'Pending PO',
      width: 100,
      hideFun: () => this.flags.showIfColumn()
    },
    {
      field: 'pendingDO',
      title: 'Pending DO',
      width: 100,
      hideFun: () => this.flags.showIfColumn()
    },
    {
      field: 'pendingSO',
      title: 'Pending SO',
      width: 100,
      hideFun: () => this.flags.showIfColumn()
    }
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
    // this.onGetTableData('LOAD_DATA', 1);
  }

  ngOnInit(): void {}

  AfterViewInit(): void {}

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

  onGetTableData(
    type: 'LOAD_DATA' | 'EXCEL' | 'CSV' = 'LOAD_DATA',
    pageNumber: number = this.paging.pageNumber,
    data: any = {},
    form: any = {}
  ): void {
    this.flags.isTableLoading = true;
    const pageSize = data.pageSize !== undefined ? data.pageSize : this.paging.pagesize;
    let divisionCode = this.formData?.divisionCode ? this.formData?.divisionCode : '';
    let locationCode = this.formData?.locationCode ? this.formData?.locationCode : '';
    let screen = this.currentScreen.id;
    this.subSink.sink = this.queryService
      .getStockQueryList(pageNumber, pageSize, divisionCode, locationCode, this.formData, screen)
      .subscribe({
        next: (success: GetDataAPI<StockQuery>) => {
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

  onPageChange(event: PageChangeEvent, form: NgForm): void {
    this.paging.skip = event.skip;
    this.paging.pagesize = event.take;
    this.paging.pageNumber = event.skip / this.paging.pagesize + 1;

    this.onGetTableData('LOAD_DATA', this.paging.pageNumber, form);
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
  fetchDataForExcel(grid: GridComponent, form: NgForm) {
    this.onGetTableData('EXCEL', 1, {grid, pageSize: 0}, form.form);
  }

  @debounce(300, {leading: true})
  onExportToCsv() {
    this.onGetTableData('CSV', 1, {pageSize: 0});
  }

  onDivisionCodeChange(divisionCodeRef: ComboBoxComponent) {
    this.formData.locationCode = divisionCodeRef?.dataItem?.code.locationCode || '';
    this.formData.vendorCode = divisionCodeRef?.dataItem?.code.vendor || '';
    // this.formData.fsl = divisionCodeRef?.dataItem?.code.fsl || '';
    this.formData.brandCode = divisionCodeRef?.dataItem?.code.brandCode || '';
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
      // this.formData.fsl = '';
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
