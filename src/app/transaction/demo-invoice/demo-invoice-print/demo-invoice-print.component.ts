import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {PDFExportComponent} from '@progress/kendo-angular-pdf-export';
import {Group, exportPDF} from '@progress/kendo-drawing';
import {PDFOpenType} from 'src/app/core/interfaces/generic/pdf-open-type.interface';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {SalesInvoicePrint} from 'src/app/core/interfaces/transaction/sales-invoice-print.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {TransactionService} from 'src/app/core/services/transaction.service';
import {ToWords} from 'to-words';

@Component({
  selector: 'app-demo-invoice-print',
  templateUrl: './demo-invoice-print.component.html',
  styleUrls: ['./demo-invoice-print.component.scss']
})
export class DemoInvoicePrintComponent implements OnInit {
  @Input() invoiceNo?: string | number;
  @Input() divisionCode?: string | number;
  @Input() openAs?: PDFOpenType;
  @ViewChild('pdf') pdf!: PDFExportComponent;

  poDetail: SalesInvoicePrint | undefined;
  userData: UserData | undefined;
  constructor(private cdr: ChangeDetectorRef, private transactionS: TransactionService, public ds: DesignService) {}

  ngOnInit(): void {}

  ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    if (this.openAs === 'EXTERNAL_VIEW' && !!this.invoiceNo && !!this.divisionCode) {
      this.openPdfDialog(this.pdf, 'EXTERNAL_VIEW');
    }
  }

  getHeight(heading: any) {
    return heading.offsetHeight + 'px';
  }
  paymentRemarks = '1. Any discrepancy against this invoice to be intimated to us ny email/fax within 3 working days.';

  openPdfDialog(pdf: PDFExportComponent, type: PDFOpenType) {
    if (!this.invoiceNo || !this.divisionCode) {
      return;
    }
    this.transactionS.getPrintDemoInvoice(this.invoiceNo, this.divisionCode, type).subscribe({
      next: (success: SalesInvoicePrint) => {
        this.poDetail = success;

        let totalQty = 0;
        this.poDetail?.itemData?.forEach((item) => {
          totalQty += +(item?.itemQty || 0);
        });

        if (this.poDetail.invoiceDetail) {
          this.poDetail.invoiceDetail.totalQty = totalQty;

          const toWords = new ToWords();
          if (typeof this.poDetail?.invoiceDetail?.totalAmtUSD === 'number') {
            this.poDetail.invoiceDetail.amountInWords = toWords.convert(this.poDetail?.invoiceDetail?.totalAmtUSD);
          }
        }

        setTimeout(() => {
          pdf
            .export()
            .then((group: Group) => exportPDF(group))
            .then((res) => {
              this.ds.exportBase64PDF(res, type, `INVOICE_${this.invoiceNo}`);
            });
        }, 0);
      },
      error: (error: any) => {
        console.error(error);
        this.ds.showNotification({
          content: `Error While getting new Invoice code ${error}`,
          type: 'error'
        });
      }
    });
  }
}
