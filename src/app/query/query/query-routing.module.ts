import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {MsalGuard} from '@azure/msal-angular';
import {ScreenIdList} from '../core/enums/screen-id-list.enum';
import {RoleGuard} from '../core/guards/role.guard';
import {InboundTrackingComponent} from '../query/inbound-tracking/inbound-tracking.component';
import {OutboundTrackingComponent} from '../query/outbound-tracking/outbound-tracking.component';
import {IntermediateComponent} from '../shared/components/intermediate/intermediate.component';
import {AuditReportComponent} from './audit-report/audit-report.component';
import {BinVolumeQueryComponent} from './bin-volume-query/bin-volume-query.component';
import {DeliveryOrderQueryComponent} from './delivery-order-query/delivery-order-query.component';
import {DeliveryOrderStatusComponent} from './delivery-order-status/delivery-order-status.component';
import {DemoOrderStatusComponent} from './demo-order-status/demo-order-status.component';
import {QueryComponent} from './query.component';
import {RfidStockQueryComponent} from './rfid-stock-query/rfid-stock-query.component';
import {ShipmentTrackingComponent} from './shipment-tracking/shipment-tracking.component';
import {StockQueryComponent} from './stock-query/stock-query.component';
import {TrackAndTraceComponent} from './track-and-trace/track-and-trace.component';

const routes: Route[] = [
  {
    path: '',
    component: QueryComponent,
    children: [
      {
        path: '',
        component: IntermediateComponent,
        pathMatch: 'full',
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.QUERIES}
      },
      {
        path: 'inbound-tracking',
        component: InboundTrackingComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.INBOUND_TRACKING}
      },
      {
        path: 'outbound-tracking',
        component: OutboundTrackingComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.OUTBOUND_TRACKING}
      },
      {
        path: 'rfid-stock-query',
        component: RfidStockQueryComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.RFID_STOCK_QUERY}
      },
      {
        path: 'stock-query',
        component: StockQueryComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.STOCK_QUERY}
      },
      {
        path: 'stock-query-bin-location',
        component: StockQueryComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.STOCK_QUERY_BIN_LOCATION}
      },
      {
        path: 'bin-volume-query',
        component: BinVolumeQueryComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.BIN_VOLUME_QUERY}
      },
      {
        path: 'stock-query-location-wise',
        component: BinVolumeQueryComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.STOCK_QUERY_LOCATION_WISE}
      },
      {
        path: 'delivery-order-status',
        component: DeliveryOrderStatusComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.DELIVERY_ORDER_STATUS}
      },
      {
        path: 'delivery-order-query',
        component: DeliveryOrderQueryComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.DELIVERY_ORDER_QUERY}
      },
      {
        path: 'demo-order-status',
        component: DemoOrderStatusComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.DEMO_ORDER_STATUS}
      },
      {
        path: 'shipment-tracking',
        component: ShipmentTrackingComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.SHIPMENT_TRACKING}
      },
      {
        path: 'audit-report',
        component: AuditReportComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.AUDIT_REPORT}
      },
      {
        path: 'track-and-trace',
        component: TrackAndTraceComponent,
        canActivate: [MsalGuard, RoleGuard],
        data: {screenCode: ScreenIdList.TRACK_AND_TRACE}
      },
      {path: '**', redirectTo: '/error/404'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueryRoutingModule {}
