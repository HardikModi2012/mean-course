import {ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PDFExportComponent} from '@progress/kendo-angular-pdf-export';
import {Group, exportPDF} from '@progress/kendo-drawing';
import {UserData} from 'src/app/core/interfaces/generic/user-data.interface';
import {DeliveryNoteSHSPrint} from 'src/app/core/interfaces/transaction/delivery-note-shs-prnt.interface';
import {DesignService} from 'src/app/core/services/design.service';
import {TransactionService} from 'src/app/core/services/transaction.service';
import {ToWords} from 'to-words';

@Component({
  selector: 'app-delivery-note-shs-pdf',
  templateUrl: './delivery-note-shs-pdf.component.html',
  styleUrls: ['./delivery-note-shs-pdf.component.scss']
})
export class DeliveryNoteShsPdfComponent implements OnInit {
  @Input() docNo?: string;
  @Input() encryptedString?: string;
  dnsDetail: DeliveryNoteSHSPrint | undefined;
  userData: UserData | undefined;

  @ViewChild('pdf') pdf!: PDFExportComponent;

  constructor(
    private cdr: ChangeDetectorRef,
    private transactionS: TransactionService,
    public ds: DesignService,
    private route: ActivatedRoute
  ) {}
  paymentRemarks = '1. Any discrepancy against this delivery note should be intimated to us by email to uptime@siemens-healthineers.com';
  ngOnInit(): void {}

  ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    const invoiceNo = this.route.snapshot.paramMap.get('invoiceNo');

    if (!!invoiceNo) {
      this.openPdfDialog(this.pdf, 'EXTERNAL_VIEW', invoiceNo);
    }
  }

  getHeight(heading: any) {
    return heading.offsetHeight + 'px';
  }

  openPdfDialog(pdf: PDFExportComponent, type: 'DOWNLOAD' | 'PRINT' | 'VIEW' | 'EXTERNAL_VIEW', encryptedString?: string) {
    const encryptedS = decodeURIComponent(encryptedString || '');
    this.transactionS.getPrintDeliveryNoteSHS(this.docNo, encryptedS, type).subscribe({
      next: (success: DeliveryNoteSHSPrint) => {
        this.dnsDetail = success;

        let totalQty = 0;
        this.dnsDetail?.itemData?.forEach((item) => {
          totalQty += +(item?.qty || 0);
        });

        if (this.dnsDetail.invoiceDetail) {
          this.dnsDetail.invoiceDetail.totalQty = totalQty;

          const toWords = new ToWords();
          if (typeof this.dnsDetail?.invoiceDetail?.totalQty === 'number') {
            this.dnsDetail.invoiceDetail.amountInWords = toWords.convert(this.dnsDetail?.invoiceDetail?.totalQty);
          }
        }

        this.cdr.detectChanges();

        setTimeout(() => {
          pdf
            .export()
            .then((group: Group) => exportPDF(group))
            .then((res) => {
              this.ds.exportBase64PDF(res, type, `DELIVERY_NOTE__${this.dnsDetail?.invoiceDetail.invoiceNo}`);
            });
        }, 0);
      },
      error: (error: any) => {
        console.error(error);
        this.ds.showError(error);
      }
    });
  }
}
