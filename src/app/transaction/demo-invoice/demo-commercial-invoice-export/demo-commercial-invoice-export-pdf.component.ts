import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {PDFExportComponent} from '@progress/kendo-angular-pdf-export';
import {Group, exportPDF} from '@progress/kendo-drawing';
import {PDFOpenType} from 'src/app/core/interfaces/generic/pdf-open-type.interface';
import {SalesInvoicePrint} from 'src/app/core/interfaces/transaction/sales-invoice-print.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {TransactionService} from 'src/app/core/services/transaction.service';
import {SharedModule} from 'src/app/shared/shared.module';
import {ToWords} from 'to-words';

@Component({
  selector: 'app-demo-commercial-invoice-export-pdf',
  templateUrl: './demo-commercial-invoice-export-pdf.component.html',
  styleUrls: ['./demo-commercial-invoice-export-pdf.component.scss'],
  imports: [SharedModule],
  standalone: true
})
export class DemoCommercialInvoiceExportPdfComponent implements OnInit {
  @Input() invoiceNo?: string | number;
  @Input() divisionCode?: string | number;
  @Input() openAs?: PDFOpenType;
  @ViewChild('pdf') pdf!: PDFExportComponent;
  poDetail: SalesInvoicePrint | undefined;
  constructor(private cdr: ChangeDetectorRef, private transactionS: TransactionService, public ds: DesignService) {}
  paymentRemarks = '1. Any discrepancy against this invoice to be intimated to us by email/fax within 3 working days.';
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

  openPdfDialog(pdf: PDFExportComponent, type: PDFOpenType) {
    if (!this.invoiceNo || !this.divisionCode) {
      return;
    }
    this.transactionS.getPrintDemoInvoice(this.invoiceNo, this.divisionCode, type).subscribe({
      next: (success: SalesInvoicePrint) => {
        this.poDetail = success;

        let totalQty = 0;
        let totalAmt = 0;
        this.poDetail?.itemData?.forEach((item) => {
          totalQty += +(item?.itemQty || 0);
          totalAmt += +(item?.amount || 0);
        });

        if (this.poDetail.invoiceDetail) {
          this.poDetail.invoiceDetail.customerAddress = success?.invoiceDetail?.customerAddress?.replace('\r', '\r\n');
          this.poDetail.invoiceDetail.footNotes = success?.invoiceDetail?.footNotes?.replace('\r', '\r\n');
          this.poDetail.invoiceDetail.totalQty = totalQty;
          this.poDetail.invoiceDetail.totalAmtAED = totalAmt;

          const toWords = new ToWords();
          this.poDetail.invoiceDetail.amountInWords = toWords.convert(totalAmt);
        }

        setTimeout(() => {
          pdf
            .export()
            .then((group: Group) => exportPDF(group))
            .then((res) => {
              this.ds.exportBase64PDF(res, type, `COMMERCIAL_INVOICE_EXPORT_${this.invoiceNo}`);
            });
        }, 0);
      },
      error: (error: any) => {
        console.error(error);
        this.ds.showNotification({
          content: `Error While getting new Commercial Invoice code ${error}`,
          type: 'error'
        });
      }
    });
  }
}
