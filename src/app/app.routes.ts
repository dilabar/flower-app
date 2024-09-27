import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BaseComponent } from './base/base.component';
import { LoginComponent } from './login/login.component';
import { RegisterStep1Component } from './register-step1/register-step1.component';
import { RegisterStep2Component } from './register-step2/register-step2.component';
import { RegisterStep3Component } from './register-step3/register-step3.component';
import { EventsComponent } from './events/events.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { CreateEventComponent } from './create-event/create-event.component'; 
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { EventDesignComponent } from './event-design/event-design.component';
import { ColorsComponent } from './colors/colors.component'; 
import { ArrangementsComponent } from './arrangements/arrangements.component'; 
import { EmailComponent } from './email/email.component';
import { EmailContentComponent } from './email-content/email-content.component';
import { FlowerComponent } from './flower/flower.component';
import { AccountComponent } from './account/account.component';
import { ProfileComponent } from './account/profile/profile.component';
import { SecretKeyComponent } from './account/secret-key/secret-key.component';
import { LaborCostComponent } from './account/labor-cost/labor-cost.component';
import { BreakDownPriceComponent } from './account/break-down-price/break-down-price.component';
import { TransferPriceComponent } from './account/transfer-price/transfer-price.component';
import { DeliverySetUpPriceComponent } from './account/delivery-set-up-price/delivery-set-up-price.component';
import { PlanCardComponent } from './account/plan-card/plan-card.component';
import { SettingsComponent } from './account/settings/settings.component';
import { ManageItemsComponent } from './account/manage-items/manage-items.component';
import { ArrangementTypeComponent } from './account/arrangement-type/arrangement-type.component';
import { CsvImportExportComponent } from './csv-import-export/csv-import-export.component';

// Define routes
export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: '', component: HomeComponent, canActivate: [AuthGuard] },
      { path: 'register-step1', component: RegisterStep1Component, canActivate: [LoginGuard] },
      { path: 'register-step2', component: RegisterStep2Component, canActivate: [LoginGuard] },
      { path: 'register-step3', component: RegisterStep3Component, canActivate: [LoginGuard] },
      { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
      { path: 'events', component: EventsComponent, canActivate: [AuthGuard] },
      { path: 'event-details/:id', component: EventDetailsComponent, canActivate: [AuthGuard] },
      { path: 'create-event', component: CreateEventComponent, canActivate: [AuthGuard] },
      { path: 'event-design/:eventId', component: EventDesignComponent, canActivate: [AuthGuard] },
      { path: 'colors', component: ColorsComponent, canActivate: [AuthGuard] },  
      { path: 'arrangements', component: ArrangementsComponent, canActivate: [AuthGuard] },
      { path: 'emails', component: EmailComponent, canActivate: [AuthGuard] },
      { path: 'email-content/:emailId', component: EmailContentComponent, canActivate: [AuthGuard] },
      { path: 'flowers', component: FlowerComponent, canActivate: [AuthGuard] },
      { path: 'csv-import-export', component: CsvImportExportComponent, canActivate: [AuthGuard] },
      { 
        path: 'account', 
        component: AccountComponent, 
        canActivate: [AuthGuard],
        children: [
          { path: 'profile', component: ProfileComponent },
          { path: 'secret_key', component: SecretKeyComponent },
          { path: 'labor_cost', component: LaborCostComponent },
          { path: 'break_down_price', component: BreakDownPriceComponent },
          { path: 'transfer_price', component: TransferPriceComponent },
          { path: 'delivery_set_up_price', component: DeliverySetUpPriceComponent },
          { path: 'plan_card', component: PlanCardComponent },
          { path: 'settings', component: SettingsComponent },
          { path: 'manage_items', component: ManageItemsComponent },
          { path: 'arrangement_type', component: ArrangementTypeComponent }
        ] 
      }
    ]
  }
];

// Export the RouterModule for use in standalone components
export const AppRouting = RouterModule.forRoot(routes);
