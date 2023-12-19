import {ChangeDetectorRef, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DesignService} from 'src/app/core/services/design.service';

@Component({
  selector: 'app-view-external-pdf',
  templateUrl: './view-external-pdf.component.html',
  styleUrls: ['./view-external-pdf.component.scss']
})
export class ViewExternalPdfComponent {
  data: any = {};

  page:
    | 'sales-commercial-invoice'
    | 'philips-delivery-note'
    | 'delivery-note-pdf'
    | 'demo-delivery-note-pdf'
    | 'demo-commercial-invoice'
    | '' = '';

  openPdf: boolean = false;

  constructor(public ds: DesignService, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.data = {};

    // console.log('🚀 ~ this.route:', this.route);

    const route = this.route?.snapshot?.routeConfig?.path;

    switch (route) {
      case 'philips-delivery-note':
      case 'delivery-note-pdf':
      case 'demo-delivery-note-pdf':
      case 'demo-commercial-invoice':
      case 'sales-commercial-invoice': {
        this.page = route;
        const encryptedString = this.route.snapshot.queryParamMap.get('s');

        if (!!encryptedString) {
          this.data.invoiceNo = encryptedString;
          this.data.divisionCode = encryptedString;
          this.openPdf = true;
          this.cdr.detectChanges();
        }
        break;
      }

      default:
        break;
    }
  }
}
