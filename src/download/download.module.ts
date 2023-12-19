import {NgModule} from '@angular/core';
import {CoreModule} from '../core/core.module';
import {SharedModule} from '../shared/shared.module';
import {DeliveryNoteShsPdfComponent} from './delivery-note-shs-pdf/delivery-note-shs-pdf.component';

import {DemoCommercialInvoiceExportPdfComponent} from '../transaction/demo-invoice/demo-commercial-invoice-export/demo-commercial-invoice-export-pdf.component';
import {DemoDeliveryNotePdfComponent} from '../transaction/demo-invoice/demo-delivery-note-print/demo-delivery-note-pdf.component';
import {CommercialInvoiceExportPdfComponent} from '../transaction/sales-invoice/commercial-invoice-export/commercial-invoice-export-pdf/commercial-invoice-export-pdf.component';
import {DeliveryNotePdfComponent} from '../transaction/sales-invoice/delivery-note-print/delivery-note-pdf/delivery-note-pdf.component';
import {DownloadFileComponent} from './download-file/download-file.component';
import {DownloadRoutingModule} from './download-routing.module';
import {DownloadComponent} from './download.component';
import {ViewExternalPdfComponent} from './view-external-pdf/view-external-pdf.component';

@NgModule({
  declarations: [DownloadFileComponent, DownloadComponent, DeliveryNoteShsPdfComponent, ViewExternalPdfComponent],
  imports: [
    DownloadRoutingModule,
    CoreModule,
    SharedModule,
    CommercialInvoiceExportPdfComponent,
    DeliveryNotePdfComponent,
    DemoCommercialInvoiceExportPdfComponent,
    DemoDeliveryNotePdfComponent
  ]
})
export class DownloadModule {}
