import {NgModule} from '@angular/core';
import {LayoutModule} from '../layout/layout.module';
import {InboundTrackingComponent} from '../query/inbound-tracking/inbound-tracking.component';
import {SharedModule} from '../shared/shared.module';
import {AgeingAnalysisComponent} from './ageing-analysis/ageing-analysis.component';
import {AuditReportComponent} from './audit-report/audit-report.component';
import {BinVolumeQueryComponent} from './bin-volume-query/bin-volume-query.component';
import {DeliveryOrderQueryComponent} from './delivery-order-query/delivery-order-query.component';
import {DeliveryChildGridComponent} from './delivery-order-status/delivery-child-grid/delivery-child-grid.component';
import {DeliveryOrderStatusComponent} from './delivery-order-status/delivery-order-status.component';
import {ChildGridComponent} from './demo-order-status/child-grid/child-grid.component';
import {DemoOrderStatusComponent} from './demo-order-status/demo-order-status.component';
import {OutboundTrackingComponent} from './outbound-tracking/outbound-tracking.component';
import {QueryRoutingModule} from './query-routing.module';
import {QueryComponent} from './query.component';
import {RfidStockQueryComponent} from './rfid-stock-query/rfid-stock-query.component';
import {SalesQueryComponent} from './sales-query/sales-query.component';
import {ShipmentTrackingComponent} from './shipment-tracking/shipment-tracking.component';
import {StockQueryComponent} from './stock-query/stock-query.component';

@NgModule({
  declarations: [
    InboundTrackingComponent,
    QueryComponent,
    OutboundTrackingComponent,
    RfidStockQueryComponent,
    StockQueryComponent,
    BinVolumeQueryComponent,
    SalesQueryComponent,
    DeliveryOrderStatusComponent,
    DeliveryOrderQueryComponent,
    ShipmentTrackingComponent,
    DemoOrderStatusComponent,
    ChildGridComponent,
    DeliveryChildGridComponent,
    AuditReportComponent,
    AgeingAnalysisComponent
  ],
  imports: [QueryRoutingModule, LayoutModule, SharedModule]
})
export class QueryModule {}
