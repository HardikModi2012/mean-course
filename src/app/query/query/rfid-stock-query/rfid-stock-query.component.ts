import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import {GridComponent, GridDataResult} from '@progress/kendo-angular-grid';
import {PageChangeEvent} from '@progress/kendo-angular-pager';
import {encodeBase64, saveAs} from '@progress/kendo-file-saver';
import {AccessKey} from 'src/app/core/constants/access-key.constants';
import {BreadCrumbItemList} from 'src/app/core/interfaces/generic/breadcrumb.interface';
import {ComboItem, ComboItemList} from 'src/app/core/interfaces/generic/combobox-options.interface';
import {GetDataAPI} from 'src/app/core/interfaces/generic/get-data-api.interface';
import {HeaderList} from 'src/app/core/interfaces/generic/grid.interface';
import {CurrentScreen} from 'src/app/core/interfaces/generic/screen-list.interface';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {RFIDStockQuery} from 'src/app/core/interfaces/query/rfid-stock-query.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {QueryService} from 'src/app/core/services/query/query.service';
import {SubSink} from 'subsink';
import {debounce} from 'typescript-debounce-decorator';

@Component({
  selector: 'app-rfid-stock-query',
  templateUrl: './rfid-stock-query.component.html',
  styleUrls: ['./rfid-stock-query.component.scss']
})
export class RfidStockQueryComponent implements OnInit {
  userData: UserData | undefined;
  breadcrumbItems: BreadCrumbItemList;
  currentScreen!: CurrentScreen;
  @Input() allowedMultipleLabelPrint: boolean = false;

  flags = {
    isTableLoading: false,
    isFieldsSearch: false,
    selectAllLabel: false
  };
  comboData: {[key in string]: ComboItemList} = {};
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
  formData = new RFIDStockQuery();
  searchTable: string = '';
  private subSink = new SubSink();
  originalData!: GetDataAPI<RFIDStockQuery>;
  gridData: GridDataResult = {
    data: [],
    total: 0
  };
  accessKey = AccessKey;

  gridHeaderList: HeaderList<RFIDStockQuery> = [
    {field: 'itemCode', title: 'Item Code', width: 150},
    {field: 'itemDesc', title: 'Item Description', width: 300},
    {field: 'coo', title: 'COO', width: 100},
    {field: 'vendor', title: 'Vendor', width: 120},
    {field: 'vendorName', title: 'Vendor Name', width: 300},
    {field: 'brandCode', title: 'Brand', width: 150},
    {field: 'brandName', title: 'Brand Name', width: 150},
    {field: 'locationCode', title: 'Location Code', width: 150},
    {field: 'divisionCode', title: 'Division Code', width: 150},
    {field: 'fsl', title: 'FSL', width: 100},
    {field: 'wareHouse', title: 'Warehouse', width: 150},
    {field: 'aisle', title: 'Aisle', width: 100},
    {field: 'rack', title: 'Rack', width: 100},
    {field: 'binLocation', title: 'Bin Location', width: 200},
    {field: 'rfid', title: 'RFID', width: 200},
    {field: 'flpn', title: 'FLPN', width: 150},
    {field: 'qty', title: 'Qty', width: 100, align: 'RIGHT'},
    {field: 'shipmentBatchNo', title: 'Shipment Batch No.', width: 200},
    {field: 'originalPONo', title: 'Original PO No.', width: 200},
    {field: 'sapNo', title: 'SAP No.', width: 100},
    {field: 'inBoundDate', title: 'Inbound Date', width: 160, type: 'DATE_TIME'},
    {field: 'vendorSerialNo', title: 'Vendor Serial No.', width: 200},
    {field: 'batchRef', title: 'Batch/Lot', width: 130},
    {field: 'expDate', title: 'Expiry Date', width: 160, type: 'DATE_TIME'},
    {field: 'shelfLife', title: 'Shelf Life', width: 150},
    {field: 'vendorPartCode', title: 'Vendor Part Code', width: 300}
  ];

  constructor(public ds: DesignService, private activatedRoute: ActivatedRoute, private queryService: QueryService) {
    const screenDetail = this.ds.setBreadcrumbItems(this.activatedRoute);
    this.breadcrumbItems = screenDetail.breadcrumbItems;
    this.currentScreen = screenDetail.currentScreen;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.onGetTableData('LOAD_DATA', 1);
  }

  onGetTableData(
    type: 'LOAD_DATA' | 'EXCEL' | 'CSV' = 'LOAD_DATA',
    pageNumber: number = this.paging.pageNumber,
    data: any = {},
    form: any = {}
  ): void {
    this.flags.isTableLoading = true;
    const pageSize = data.pageSize !== undefined ? data.pageSize : this.paging.pagesize;
    const searchString = !!this.searchTable ? this.searchTable : '';
    let divisionCode = this.formData.divisionCode ? this.formData.divisionCode : '';
    let locationCode = this.formData.locationCode ? this.formData.locationCode : '';
    let separateSearch: any = '';
    if (
      this.formData.binLocation ||
      this.formData.flpn ||
      this.formData.rfid ||
      this.formData.vendorSerialNo ||
      this.formData.flpn ||
      this.formData.shipmentBatchNo ||
      this.formData.originalPONo ||
      this.formData.sapNo ||
      this.formData.vendorPartCode
    ) {
      separateSearch =
        this.formData.binLocation ||
        this.formData.flpn ||
        this.formData.rfid ||
        this.formData.vendorSerialNo ||
        this.formData.flpn ||
        this.formData.shipmentBatchNo ||
        this.formData.originalPONo ||
        this.formData.sapNo ||
        this.formData.vendorPartCode;
    }

    this.subSink.sink = this.queryService
      .getRFIDStockQueryList(pageNumber, pageSize, searchString, divisionCode, locationCode, data.value, separateSearch)
      .subscribe({
        next: (success: GetDataAPI<RFIDStockQuery>) => {
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

  private setSelectAllSwitch() {
    let items = this.gridData.data.filter((x) => !!!x.print);

    if (items.length > 0) {
      this.flags.selectAllLabel = false;
    } else {
      this.flags.selectAllLabel = true;
    }
  }

  @debounce(300)
  selectLabelToPrint(value: boolean, type: 'SELECT_ALL' | 'SINGLE_SELECT') {
    if (type === 'SELECT_ALL') {
      this.gridData.data.forEach((item) => {
        if (!(item.hasPrinted == true && this.allowedMultipleLabelPrint == false)) {
          item.print = value;
        }
      });
    } else {
      let firstValue = false;
      let isValueChange = false;
      this.gridData.data.forEach((item, index) => {
        if (index === 0) {
          firstValue = item.print;
        } else {
          if (firstValue !== item.print) {
            isValueChange = true;
          }
        }
      });

      this.flags.selectAllLabel = isValueChange ? false : firstValue;
    }
  }

  setDefaultDivision(comboData: ComboItemList) {
    setTimeout(() => {
      this.formData.divisionCode = this.userData?.divisionCode || '';
      const selected = comboData.find((ele: {value: string}) => ele.value === this.userData?.divisionCode);
      this.formData.vendor = selected?.code?.vendor;
    }, 0);
  }

  onDivisionCodeChange(divisionCodeRef: ComboBoxComponent) {
    this.formData.locationCode = divisionCodeRef?.dataItem?.code.locationCode || '';
    this.formData.vendor = divisionCodeRef?.dataItem?.code.vendor || '';
    this.formData.fsl = divisionCodeRef?.dataItem?.code.fsl || '';
    this.formData.brandCode = divisionCodeRef?.dataItem?.code.brandCode || '';
  }

  setDefaultFSL() {
    setTimeout(() => {
      this.formData.fsl = this.userData?.fslCode || '';
    }, 0);
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

  setDefaultBrand(comboData: ComboItemList) {
    if (!!comboData && comboData?.length === 1) {
      this.formData.brandCode = comboData[0]?.value || '';
    }
  }

  onVendorChange(vendor: string, divisionCodeRef: ComboBoxComponent, vendorRef: ComboBoxComponent) {
    if (!vendorRef?.dataItem?.value) {
      this.formData.brandCode = '';
    }
    if (divisionCodeRef?.dataItem?.code.vendor !== vendor.toString()) {
      this.formData.divisionCode = '';
      this.formData.fsl = '';
    }
  }

  onBinLocationChange(bin: string) {
    const binLocation = this.splitBinLocation(bin);

    this.formData.wareHouse = binLocation.warehouse || '';
    this.formData.aisle = binLocation.aisle || '';
    this.formData.rack = binLocation.rack || '';
  }

  splitBinLocation(binLocation: string) {
    if (!binLocation) {
      return {binLocation: '', fsl: '', warehouse: '', aisle: '', rack: ''};
    }
    const binLoc = binLocation?.split('-') || [];
    const fsl = binLoc[0] || '';
    const warehouse = binLoc[1] || '';
    const aisle = binLoc[2] || '';
    const rack = binLoc[3] || '';

    return {binLocation, fsl, warehouse, aisle, rack};
  }

  onPageChange(event: PageChangeEvent, form: NgForm): void {
    this.paging.skip = event.skip;
    this.paging.pagesize = event.take;
    this.paging.pageNumber = event.skip / this.paging.pagesize + 1;

    this.onGetTableData('LOAD_DATA', this.paging.pageNumber, form);
  }

  @debounce(300)
  onFilter(form: NgForm) {
    this.onGetTableData('LOAD_DATA', 1, form);
    this.paging.skip = 0;
  }

  @debounce(300, {leading: true})
  fetchDataForExcel(grid: GridComponent, form: NgForm) {
    this.onGetTableData('EXCEL', 1, {grid, pageSize: 0}, form);
  }

  @debounce(300, {leading: true})
  onExportToCsv() {
    this.onGetTableData('CSV', 1, {pageSize: 0});
  }

  clearSelectedOptions() {
    this.formData.binLocation = '';
    this.formData.flpn = '';
    this.formData.rfid = '';
    this.formData.vendorSerialNo = '';
    this.formData.flpn = '';
    this.formData.shipmentBatchNo = '';
    this.formData.originalPONo = '';
    this.formData.sapNo = '';
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

  callPrintLabel(isSmallLabel: any) {
    var printItems = this.gridData.data.filter((x) => x.print) as RFIDStockQuery[];

    if (printItems.length <= 0) {
      this.ds.showNotification({
        content: `Please Select Items To Print`,
        type: 'error'
      });
      return;
    }

    if (isSmallLabel) {
      printItems = printItems.filter((x) => x.smallItem == '1');

      if (printItems.length <= 0) {
        this.ds.showNotification({
          content: `Please Select Small Items To Print`,
          type: 'error'
        });
        return;
      }
    } else {
      printItems = printItems.filter((x) => x.smallItem != '1');

      if (printItems.length <= 0) {
        this.ds.showNotification({
          content: `Please Select Items To Print`,
          type: 'error'
        });
        return;
      }
    }

    this.subSink.sink = this.queryService
      .getRfidStockQueryPrintLabelData({
        itemData: printItems,
        isSmallLabel: isSmallLabel
      })
      .subscribe({
        next: (label: string) => {
          if (label.trim() == '') {
            this.ds.showNotification({
              content: `Something went wrong`,
              type: 'error'
            });
            return;
          }

          this.ds.printBase64Text(encodeBase64(label), 'RFIDStockQuery');

          saveAs('data:text/plain;base64,' + encodeBase64(label), 'RFIDStockQuery.txt');
        },
        error: (error: any) => {
          this.ds.showError(error);
        }
      });
  }
}
