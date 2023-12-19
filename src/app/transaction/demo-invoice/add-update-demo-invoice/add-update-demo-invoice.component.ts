import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {DialogRef, DialogService} from '@progress/kendo-angular-dialog';
import {ComboBoxComponent} from '@progress/kendo-angular-dropdowns';
import * as moment from 'moment';
import {
  NozomiVendorConst,
  PhilipsVendorConst,
  SHSVendorConst,
  StrykerVendorConst,
  UnitedImagingHealthcareVendorConst,
  WiwynnDivisionConst
} from 'src/app/core/constants/validation.constants';
import {Operation} from 'src/app/core/enums/items.enum';
import {TransactionType} from 'src/app/core/enums/transaction-type.enum';
import {ComboItem, ComboItemList, ComboboxOptions} from 'src/app/core/interfaces/generic/combobox-options.interface';
import {CRUD} from 'src/app/core/interfaces/generic/crud.interface';
import {CurrentScreen} from 'src/app/core/interfaces/generic/screen-list.interface';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {DemoInvoice} from 'src/app/core/interfaces/transaction/demo-invoice.interface';
import {ItemsTableConfig} from 'src/app/core/interfaces/transaction/items-table';
import {BatchForm, OrderItem, TotalValues} from 'src/app/core/interfaces/transaction/order-item.interface';
import {ComboBoxService} from 'src/app/core/services/combo-box.service';
import {DesignService} from 'src/app/core/services/design.service';
import {LoaderService} from 'src/app/core/services/loader.service';
import {TransactionService} from 'src/app/core/services/transaction.service';
import {SubSink} from 'subsink';
import {debounce} from 'typescript-debounce-decorator';

@Component({
  selector: 'app-add-update-demo-invoice',
  templateUrl: './add-update-demo-invoice.component.html',
  styleUrls: ['./add-update-demo-invoice.component.scss']
})
export class AddUpdateDemoInvoiceComponent implements OnInit, OnDestroy {
  private subSink = new SubSink();

  private modelRef: DialogRef | null = null;

  @ViewChild('notificationTemplate', {read: TemplateRef}) notificationTemplate: TemplateRef<unknown> | undefined;

  pendingRfidDetails: Array<string> = [];

  errors = {
    pendingRfidDetails: false
  };

  popupMode: CRUD = 'READ';

  userData: UserData | undefined;

  totalValues: TotalValues = {};

  itemsTableConfig: ItemsTableConfig = new ItemsTableConfig();

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

  flags = {
    isTableLoading: false,
    performingAction: false,
    deliveryDateFieldDisabled: false,
    deliveryTimeFieldsDisabled: false,
    customerCountryDisabled: false,
    custNameDisabled: false,
    rfidDialog: false,
    rfidTableLoading: false,
    isDriveMode: false,
    showIfWiwynnDivision: () => WiwynnDivisionConst.includes(this.formData.divisionCode),
    enableOrderInfoIfDivisionCode: () => !['45', '09', '15'].includes(this.formData.divisionCode),
    showIfShsVendor: () => SHSVendorConst.includes(this.formData.vendor),
    showIfNozomiVendor: () => [...NozomiVendorConst, ...StrykerVendorConst].includes(this.formData.vendor),
    showIfUnitedImagingHealthcareVendor: () => UnitedImagingHealthcareVendorConst.includes(this.formData.vendor),
    showIfPhilipsVendor: () => PhilipsVendorConst.includes(this.formData.vendor)
  };

  formData: DemoInvoice = new DemoInvoice();
  deletedItems: Array<OrderItem> = [];
  extraData: any = {
    countryCode: '',
    cityCode: ''
  };

  title: string = '';

  comboData: {[key in string]: ComboItemList} = {};

  currentScreen: CurrentScreen;

  rfidDetails: any = [];

  pattern = /^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*;{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/;

  demoPeriodList: ComboItemList = [];

  constructor(
    public ds: DesignService,
    private transactionService: TransactionService,
    private comboBoxS: ComboBoxService,
    private activatedRoute: ActivatedRoute,
    private loader: LoaderService
  ) {
    const screenDetail = this.ds.setBreadcrumbItems(this.activatedRoute);
    this.currentScreen = screenDetail.currentScreen;

    const comboboxOptions: ComboboxOptions = {
      type: 'DEMO_PERIOD'
    };
    this.comboBoxS.switchApi(comboboxOptions).subscribe({
      next: (comboItemList: ComboItemList) => {
        this.demoPeriodList = comboItemList;
      },
      error: (error: any) => {
        console.error(error);
        this.ds.showNotification({
          content: `Error While getting new Demo Invoice No ${error}`,
          type: 'error'
        });
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.setItemsTableConfig();
  }

  setItemsTableConfig() {
    this.itemsTableConfig.calcField = 'itemQty';
    this.itemsTableConfig.headerList = [
      {
        field: 'itemCode',
        title: 'Item Code',
        width: 200,
        editConfig: {
          templateName: 'e_itemCode'
        }
      },
      {
        field: 'itemDesc',
        title: 'Item Description',
        width: 300,
        editConfig: {
          templateName: 'e_itemDesc'
        }
      },
      {
        field: 'itUnit',
        title: 'Unit',
        width: 150,
        editConfig: {
          templateName: 'e_itUnit'
        }
      },
      {
        field: 'itemQty',
        title: 'Qty',
        width: ['CREATE', 'UPDATE'].includes(this.popupMode) ? 200 : 100,
        type: 'CUSTOM',
        typeConfig: {
          templateName: '_qtyWithBatchForm'
        },
        editConfig: {
          templateName: 'e_itemQtyWithBatchForm',
          footerTemplateName: 'f_itemQty'
        }
      },
      {
        field: 'accessories',
        title: 'Accessories',
        hideFun: () => !this.flags.showIfNozomiVendor(),
        width: 200,
        type: 'CUSTOM',
        typeConfig: {
          templateName: '_accessories'
        },
        editConfig: {
          templateName: 'e_accessories'
        }
      },
      {
        field: 'rate',
        title: `Rate [${this.formData.currencyCode || ''}]`,
        width: 100,
        type: 'NUMBER',
        typeConfig: {
          decimal: this.ds.foreignCurrencyDecimal
        },
        editConfig: {
          templateName: 'e_itemRate'
        }
      },
      {
        field: 'amtFC',
        title: `Amount [${this.formData.currencyCode || ''}]`,
        width: 100,
        type: 'NUMBER',
        typeConfig: {
          decimal: this.ds.foreignCurrencyDecimal
        },
        editConfig: {
          footerTemplateName: 'f_amtFC'
        }
      },
      {
        field: 'amtBC',
        title: `Amount [${this.ds.baseCurrencyConstant}]`,
        width: 100,
        type: 'NUMBER',
        typeConfig: {
          decimal: this.ds.baseCurrencyDecimal
        },
        editConfig: {
          footerTemplateName: 'f_amtBC'
        }
      }
    ];
    this.itemsTableConfig.showToolbar = true;
    this.itemsTableConfig.showActionColumn = true;
    this.itemsTableConfig.showAddBtn = true;
    this.itemsTableConfig.showDeleteBtn = true;
    this.itemsTableConfig.showEditBtn = true;
    this.itemsTableConfig.showFooter = true;
    this.itemsTableConfig.showBatchFormDialogBtn = true;
    this.itemsTableConfig.showStockLocation = true;

    this.itemsTableConfig.itemCodePopupListName = 'GET_TRANSACTION_ITEM_LIST';
    this.itemsTableConfig.editableColList = ['itemCode', 'itemQty', 'accessories', 'partReturnable', 'customerOrderType'];

    if (this.userData?.allowEdit === true) {
      this.itemsTableConfig.editableColList.push('rate');
    }
  }

  public static Open(modelService: DialogService, popupMode: CRUD, data: any | null) {
    let ref = modelService.open({
      title: '',
      content: AddUpdateDemoInvoiceComponent,
      width: '100%',
      cssClass: 'customKendoDialog'
    });

    let component = ref.content.instance as AddUpdateDemoInvoiceComponent;
    component.popupMode = popupMode;
    component.modelRef = ref;
    switch (popupMode) {
      case 'CREATE':
        component.onAddPopup();
        break;
      case 'READ':
      case 'UPDATE':
        component.onEditOrViewPopup(data ?? ({} as any));
        break;
    }

    return ref;
  }

  onClose(data: any = null) {
    if (this.modelRef) {
      this.modelRef.close(data);
    }
  }

  private resetData(value: any | undefined = undefined) {
    if (value?.docDate && typeof value?.docDate === 'string') {
      value.docDate = new Date(value.docDate);
    }

    if (value?.expectedDeliveryDate && typeof value?.expectedDeliveryDate === 'string') {
      value.expectedDeliveryDate = new Date(value.expectedDeliveryDate);
    }

    if (value?.orderReceivedDate && typeof value?.orderReceivedDate === 'string') {
      value.orderReceivedDate = new Date(value.orderReceivedDate);
    }

    if (value?.awbDate && typeof value?.awbDate === 'string') {
      value.awbDate = new Date(value.awbDate);
    }

    this.formData = {
      divisionCode: value?.divisionCode || '',
      divisionName: value?.divisionName || '',

      docNo: value?.docNo || '',
      docDate: value?.docDate || new Date(),
      invoiceRef: value?.invoiceRef || '',
      orderRef: value?.orderRef || '',

      vendor: this.formData?.vendor || '',
      brandCode: value?.brandCode || '',

      customerCode: value?.customerCode || '',
      custName: value?.custName || '',
      contactPerson: value?.contactPerson || '',
      contactNo: value?.contactNo || '',
      area: value?.area || '',
      custLatitude: value?.custLatitude || '',
      custLongitude: value?.custLongitude || '',
      custAddress: value?.custAddress || '',
      custEmail: value?.custEmail || '',
      demoPeriod: value?.demoPeriod || '',

      deliveryTypeCode: value?.deliveryTypeCode || '',
      custCountry: value?.custCountry || '',
      custRegion: value?.custRegion || '',
      custRegionCode: value?.custRegionCode || '',
      expectedDeliveryDate: value?.expectedDeliveryDate || '',

      stockLocationCode: value?.stockLocationCode || '',
      locationName: this.userData?.locationCode || '',
      remarks: value?.remarks || '',

      itemData: value?.itemData || [],

      volume: value?.volume || '',
      weight: value?.weight || '',
      // distance: value?.distance || '',

      currencyCode: value?.currencyCode || '',
      exchangeRate: value?.exchangeRate || '',
      deliveryMode: value?.deliveryMode || '',
      deliveryModeCode: value?.deliveryModeCode || '',
      awbNo: value?.awbNo || '',
      awbDate: value?.awbDate || '',

      customerDebit: value?.customerDebit || '',
      customerDebitAfterVat: value?.customerDebitAfterVat || '',
      byPassRFID: value?.byPassRFID || false,

      editMode: this.popupMode === 'UPDATE' ? true : false,
      type: this.currentScreen?.transType || '',
      incoterms: value?.incoterms || '',
      accountNo: value?.accountNo || '',
      orderReceivedDate: value?.orderReceivedDate || '',
      distance: value?.distance || 0,
      pocId: value?.pocId || '',
      pocName: value?.pocName || '',
      shipmentName: value?.shipmentName || '',
      isIntegrated: value?.isIntegrated || false,
      fslCode: value?.fslCode || ''
    };

    this.setCustomerCountry('SETUP');

    return this.formData;
  }

  private onAddPopup() {
    if (this.popupMode === 'CREATE') {
      this.title = `Add ${this.currentScreen.name}`;

      this.setDefaultCountryAndCity();

      this.formData = this.resetData();
      this.totalValues = {};

      this.subSink.sink = this.transactionService.getNewOrderNumber(TransactionType.DEMO_INVOICE).subscribe({
        // need to update API
        next: (success: string) => {
          // set order not
          this.formData.docNo = success;
          this.formData.docDate = new Date();
        },
        error: (error: any) => {
          console.error(error);
          this.ds.showNotification({
            content: `Error While getting new Demo Invoice No ${error}`,
            type: 'error'
          });
        }
      });
    }
  }

  private onEditOrViewPopup(value: any) {
    if (!['READ', 'UPDATE'].includes(this.popupMode)) {
      return;
    }

    this.title = this.popupMode === 'UPDATE' ? 'Update Demo Invoice' : 'View Demo Invoice';

    this.getDemoInvoiceByCode(value.docNo);
    this.setDefaultCountryAndCity();
  }

  private getDemoInvoiceByCode(docNo: string) {
    this.subSink.sink = this.transactionService.getDemoInvoiceByCode(docNo).subscribe({
      next: (result: any) => {
        this.totalValues = {};
        this.formData = this.resetData(result);
        this.setItemsTableConfig();
        this.setDistance();
      },
      error: (error: any) => {
        this.ds.showError(error);
      }
    });
  }

  setCurrency(comboData: ComboItemList) {
    if (this.formData.currencyCode && ['CREATE'].includes(this.popupMode)) {
      const value = comboData.find((item) => item.value === this.formData.currencyCode);
      this.formData.exchangeRate = value?.code?.exchangeRate || '';
    }
  }

  setDefaultDivision(comboData: ComboItemList) {
    setTimeout(() => {
      if (!!comboData) {
        this.formData.divisionCode = this.userData?.divisionCode || '';
        const selected = comboData.find((ele: {value: string}) => ele.value === this.userData?.divisionCode);
        this.formData.vendor = selected?.code?.vendor;
      }
    }, 0);
  }

  setDefaultBrand(comboData: ComboItemList) {
    if (!!comboData && comboData?.length === 1 && this.popupMode === 'CREATE') {
      this.formData.brandCode = comboData[0]?.value || '';
    }
  }

  setDefaultLocation(comboData: any, locationCodeRef: ComboBoxComponent) {
    if (!!comboData && this.popupMode === 'CREATE') {
      this.formData.stockLocationCode = this.userData?.locationCode || '';
      locationCodeRef.writeValue(this.formData.stockLocationCode);
    }
  }

  @debounce(300)
  setCustomerDetail(customerCodeRef: ComboBoxComponent) {
    if (!customerCodeRef.value) return;

    this.transactionService.getCustomerDetails(customerCodeRef.value).subscribe({
      next: (success: any) => {
        this.formData.currencyCode = success?.currencyCode;
        this.formData.exchangeRate = success?.exchangeRate;
        if (!!customerCodeRef?.dataItem?.isFlag) {
          this.flags.custNameDisabled = false;
          this.formData.custName = '';
          this.formData.area = '';
          this.formData.contactNo = '';
          this.formData.contactPerson = '';
          this.formData.custAddress = '';
          this.formData.custEmail = '';
          this.formData.custLatitude = '0';
          this.formData.custLongitude = '0';
          setTimeout(() => {
            this.setItemsTableConfig();
          }, 0);
          this.setDistance();
          return;
        }

        this.formData.area = success?.area || '';
        this.formData.contactNo = success?.contactNo || '';
        this.formData.contactPerson = success?.contactPerson || '';
        this.formData.custAddress = success?.custAddress || '';
        this.formData.custEmail = success?.custEmail || '';
        this.formData.custLatitude = success?.latitude || '0';
        this.formData.custLongitude = success?.longitude || '0';
        this.formData.custName = success?.custName || '';
        this.flags.custNameDisabled = true;

        setTimeout(() => {
          this.setItemsTableConfig();
        }, 0);
        this.setDistance();
      },
      error: (error: any) => {
        console.error(error);
        this.ds.showNotification({
          content: `Error While getting new ${this.currentScreen.name} code ${error}`,
          type: 'error'
        });
      }
    });
  }

  @debounce(300)
  setCustomerCountry(type: 'UPDATE' | 'SETUP') {
    if (this.formData.deliveryTypeCode === '001') {
      this.flags.customerCountryDisabled = true;

      if (type === 'UPDATE') {
        this.formData.custCountry = this.extraData.countryCode;
      }

      this.comboData['SALES_DELIVERY_MODE'].forEach((item: ComboItem) => {
        item.DISABLED = false;
      });
    } else if (this.formData.deliveryTypeCode === '002') {
      this.flags.customerCountryDisabled = false;

      if (type === 'UPDATE') {
        this.formData.custCountry = '';
        this.formData.deliveryModeCode = '';
      }

      this.comboData['COUNTRY']?.forEach((item: ComboItem) => {
        if (item.value === this.extraData.countryCode) {
          item.DISABLED = true;
        } else {
          item.DISABLED = false;
        }
      });

      this.comboData['SALES_DELIVERY_MODE'].forEach((item: any) => {
        if (item.isDriveMode) {
          item.DISABLED = true;
        } else {
          item.DISABLED = false;
        }
      });
    }

    this.setDistance();
  }

  setDefaultCountryAndCity() {
    this.subSink.sink = this.transactionService.getLocationInfo().subscribe({
      next: (success: any) => {
        this.extraData.countryCode = success?.country || '';
        this.extraData.cityCode = success?.city || '';
      },
      error: (error: any) => {
        console.error(error);
        this.ds.showNotification({
          content: `Error While getting new ${this.currentScreen.name} code ${error}`,
          type: 'error'
        });
      }
    });
  }

  @debounce(100, {leading: true})
  onSubmit(form: NgForm) {
    if (!['CREATE', 'UPDATE'].includes(this.popupMode) || !form?.valid || !this.totalValues.totalItemQty) {
      return;
    }

    if (this.flags.performingAction) {
      this.ds.showNotification({
        content: 'Please Save or Cancel Item Changes',
        type: 'error'
      });
      return;
    }

    if (this.flags.isDriveMode === true && !this.formData.distance) {
      this.ds.showNotification({
        content: 'Please enter distance',
        type: 'error'
      });
      return;
    }

    this.formData.editMode = this.popupMode == 'UPDATE' ? true : false;

    this.formData.custLatitude = this.formData.custLatitude.toString();
    this.formData.custLongitude = this.formData.custLongitude.toString();
    this.formData.amtBC = this.totalValues.totalAmtBC;
    this.formData.amtFC = this.totalValues.totalAmtFC;

    this.pendingRfidDetails = [];
    this.formData.itemData.forEach((item: OrderItem, itemIndex: number) => {
      if (!item.itemQty) item.itemQty = 0;
      if (!item.batchForm) item.batchForm = [];

      if (item.itemQty === 0 || item.itemQty !== item.batchForm?.length) {
        this.pendingRfidDetails.push(item.itemCode);
      }
    });

    if (this.pendingRfidDetails.length > 0) {
      this.errors.pendingRfidDetails = true;
      this.ds.showNotification({
        content: this.notificationTemplate,
        type: 'danger',
        closable: true,
        position: {horizontal: 'right', vertical: 'top'}
      });
      return;
    } else {
      this.errors.pendingRfidDetails = false;
    }

    let maxIndex = this.formData.itemData.reduce((max: number, item) => {
      const index = +(item?.slNo || 0) > max ? +(item?.slNo || 0) : max;
      return index;
    }, 0);

    const findMaxIndex = (batchForm: BatchForm[] | undefined): number => {
      return (
        batchForm?.reduce((max: number, item) => {
          const index = +(item?.slNo || 0) > max ? +(item?.slNo || 0) : max;
          return index;
        }, 0) || 0
      );
    };

    this.formData.itemData.forEach((item, itemIndex) => {
      if (['CREATE'].includes(this.popupMode)) {
        item.operation = Operation.CREATE;
        item.slNo = itemIndex + 1;
        item.batchForm?.forEach((batchItem, batchIndex) => {
          batchItem.operation = Operation.CREATE;
          batchItem.slNo = batchIndex + 1;
          batchItem.mslNo = item.slNo;
        });
      }

      if (['UPDATE'].includes(this.popupMode) && item.operation === Operation.CREATE) {
        item.slNo = maxIndex + 1;
        maxIndex++;

        let maxIndexBatch = 0;
        item.batchForm?.forEach((batchItem, batchIndex: number) => {
          if (batchItem.operation === Operation.CREATE) {
            batchItem.slNo = +(maxIndexBatch === 0 ? findMaxIndex(item?.batchForm) : maxIndexBatch) + 1;
            batchItem.mslNo = item.slNo;
            maxIndexBatch = batchItem.slNo;
          }
        });
      }
    });

    this.formData.itemData.forEach((item) => {
      item.batchForm = item.batchForm || [];
      if (item.deletedBatchForm) {
        item.batchForm = [...item.deletedBatchForm, ...item.batchForm];
      }
    });

    this.formData.itemData = [...this.deletedItems, ...this.formData.itemData];

    const apiData = {...this.formData};

    this.loader.open();

    this.subSink.sink = this.transactionService.addOrUpdateDemoInvoice(apiData).subscribe({
      next: (docNo: string) => {
        this.loader.close();
        this.ds.showNotification({
          content: `${this.currentScreen.name} No :- ${docNo} ${['UPDATE'].includes(this.popupMode) ? 'Updated' : 'Added'} Successfully`,
          type: 'success'
        });
      },
      error: (error) => {
        this.loader.close();
        this.ds.showError(error);
      },
      complete: () => {
        this.loader.close();
        this.onClose({
          isItemAdded: true
        });
      }
    });
  }

  openRfidDialog() {
    this.flags.rfidDialog = true;
    this.flags.rfidTableLoading = true;
    const data = {
      docType: 'DSAL',
      docNo: this.formData.docNo || '',
      locationCode: this.formData.stockLocationCode
    };
    this.transactionService.getRfidList(data).subscribe({
      next: (success: any) => {
        this.rfidDetails = success;
      },
      error: (error) => {
        this.ds.showError(error);
      },
      complete: () => {
        this.flags.rfidTableLoading = false;
      }
    });
  }

  closeRfidDialog() {
    this.flags.rfidDialog = false;
  }

  currentMonth(): Date {
    return !!this.popupMode && ['CREATE'].includes(this.popupMode) ? moment().startOf('month').toDate() : moment('01-01-1900').toDate();
  }

  disabledPreviousDates(date: Date): boolean {
    return date < moment().subtract(1, 'd').toDate();
  }

  onCurrencyCodeChange(exchangeRate: any) {
    this.formData.exchangeRate = exchangeRate;
    setTimeout(() => {
      this.setItemsTableConfig();
    }, 0);
  }

  onBatchFormItemsChange() {
    if (!this.formData.itemData) {
      return;
    }

    let volume = 0;
    let weight = 0;
    this.formData.itemData.forEach((element: any) => {
      volume +=
        +this.ds.fixDecimal(element.volume, this.ds.volumeDecimal) * +this.ds.fixDecimal(element.itemQty ?? 1, this.ds.volumeDecimal);
      weight +=
        +this.ds.fixDecimal(element.weight ?? 0, this.ds.weightDecimal) * +this.ds.fixDecimal(element.itemQty ?? 1, this.ds.weightDecimal);
    });

    this.formData.volume = +this.ds.fixDecimal(volume, this.ds.weightDecimal);
    this.formData.weight = +this.ds.fixDecimal(weight, this.ds.weightDecimal);
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  @debounce(300)
  setDistance() {
    if (this.formData?.deliveryModeCode && this.comboData['SALES_DELIVERY_MODE'] && this.comboData['SALES_DELIVERY_MODE'].length > 0) {
      let delMode = this.comboData['SALES_DELIVERY_MODE'].find((x: any) => x.value == this.formData.deliveryModeCode) as any;
      if (delMode != null && delMode.isDriveMode) {
        this.flags.isDriveMode = true;
      } else {
        this.flags.isDriveMode = false;
      }
      if (!!delMode && delMode?.isDriveMode && this.formData?.custLatitude && this.formData?.custLongitude) {
        this.subSink.sink = this.transactionService
          .getDistance(
            this.formData.custLatitude + ',' + this.formData.custLongitude,
            this.formData?.fslCode || this.userData?.fslCode || ''
          )
          .subscribe({
            next: (distance: any) => {
              this.flags.isDriveMode = true;
              this.formData.distance = +this.ds.fixDecimal(distance, 2);
            },
            error: (error: any) => {
              this.loader.close();
              this.ds.showError(error);
            }
          });
      } else {
        this.flags.isDriveMode = false;
        this.formData.distance = 0;
      }
    }
  }
}
