import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateRandomComponent } from './generate-random/generate-random.component';
import { ReportComponent } from './report/report.component';

const routes: Routes =  [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: GenerateRandomComponent },
  { path: 'report', component: ReportComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
