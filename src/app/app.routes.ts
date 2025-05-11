import { Routes } from '@angular/router';
import { SummaryComponent } from './components/summary/summary.component';
import { DetailComponent } from './components/detail/detail.component';

export const routes: Routes = [
    { path: "", component: SummaryComponent },
    { path: "detail", component: DetailComponent },
];
