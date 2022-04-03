import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportInfo } from '../_models/report-info';
import { ReportService } from '../_services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  error: string;
  loaded: boolean = false;
  report: ReportInfo = { numericPercentage: 0, alphaNumericPercentage: 0, floatPercentage: 0 };

  NumericPercentage: number;
  AlphaNumericPercentage: number;
  FloatPercentage: number;

  constructor(private _reportService: ReportService,
    private _spinnerService: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this._spinnerService.show();
    setTimeout(() => {
      this._spinnerService.hide();
      this.loaded = true;
    }, 2000);
    this._reportService.getReportInfo().subscribe((res: any) => {
      console.log(res.data);
      this.report = res.data;
    },
      error => {
        this.error = error;
      });
  }

}
