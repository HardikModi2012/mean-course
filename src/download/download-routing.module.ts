import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {MsalGuard} from '@azure/msal-angular';
import {DeliveryNoteShsPdfComponent} from './delivery-note-shs-pdf/delivery-note-shs-pdf.component';
import {DownloadFileComponent} from './download-file/download-file.component';
import {DownloadComponent} from './download.component';
import {ViewExternalPdfComponent} from './view-external-pdf/view-external-pdf.component';

const routes: Route[] = [
  {
    path: '',
    component: DownloadComponent,
    children: [
      {
        path: 'file/:id',
        component: DownloadFileComponent,
        canActivate: [MsalGuard]
      },
      {
        path: 'delivery-note/:invoiceNo',
        component: DeliveryNoteShsPdfComponent,
        canActivate: [MsalGuard]
      },
      {
        path: 'sales-commercial-invoice',
        component: ViewExternalPdfComponent,
        canActivate: [MsalGuard]
      },
      {
        path: 'philips-delivery-note',
        component: ViewExternalPdfComponent,
        canActivate: [MsalGuard]
      },
      {
        path: 'delivery-note-pdf',
        component: ViewExternalPdfComponent,
        canActivate: [MsalGuard]
      },
      {
        path: 'demo-delivery-note-pdf',
        component: ViewExternalPdfComponent,
        canActivate: [MsalGuard]
      },
      {
        path: 'demo-commercial-invoice',
        component: ViewExternalPdfComponent,
        canActivate: [MsalGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadRoutingModule {}
