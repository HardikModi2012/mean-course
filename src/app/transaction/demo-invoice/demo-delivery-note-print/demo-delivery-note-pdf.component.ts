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
  selector: 'app-demo-delivery-note-pdf',
  templateUrl: './demo-delivery-note-pdf.component.html',
  styleUrls: ['./demo-delivery-note-pdf.component.scss'],
  imports: [SharedModule],
  standalone: true
})
export class DemoDeliveryNotePdfComponent implements OnInit {
  @Input() invoiceNo?: string | number;
  @Input() divisionCode?: string | number;
  @Input() openAs?: PDFOpenType;
  @ViewChild('pdf') pdf!: PDFExportComponent;
  dnDetail: SalesInvoicePrint | undefined;
  constructor(private cdr: ChangeDetectorRef, private transactionS: TransactionService, public ds: DesignService) {}
  paymentRemarks = '1. Any discrepancy against this delivery note should be intimated to us by email/fax within 3 working days.';
  returnInstructions1 =
    'Please call Pedigri Technologies \nThe office is open from Monday through Friday from 9:00 till 18:00.  \n\nEmail: darktracelogistics@pedigritechnologies.com  \nContact No.: +971 54 998 2194';
  returnInstructions2 =
    'Please call Pedigri Technologies  \nThe office is open from Sunday through Thursday from 9:00 till 17:00. \n\nEmail: darktracelogistics@pedigritechnologies.com  \nContact No.: +971 54 998 2194';
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
        this.dnDetail = success;

        let totalQty = 0;
        this.dnDetail?.itemData?.forEach((item) => {
          totalQty += +(item?.itemQty || 0);
        });

        if (this.dnDetail.invoiceDetail) {
          this.dnDetail.invoiceDetail.totalQty = totalQty;

          const toWords = new ToWords();
          if (typeof this.dnDetail?.invoiceDetail?.totalQty === 'number') {
            this.dnDetail.invoiceDetail.amountInWords = toWords.convert(this.dnDetail?.invoiceDetail?.totalQty);
          }
        }
        setTimeout(() => {
          pdf
            .export()
            .then((group: Group) => exportPDF(group))
            .then((res) => {
              this.ds.exportBase64PDF(res, type, `DELIVERY_NOTE__${this.invoiceNo}`);
            });
        }, 0);
      },
      error: (error: any) => {
        console.error(error);
        this.ds.showNotification({
          content: `Error While getting new Delivery Note code ${error}`,
          type: 'error'
        });
      }
    });
  }
}
