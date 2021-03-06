import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Counter } from '../_models/counter';
import { AlertifyService } from '../_services/alertify.service';
import { ReportService } from '../_services/report.service';
import { SignalrService } from '../_services/signalr.service';
import { NgxSpinnerService } from "ngx-spinner";
import { ValueConverter } from '@angular/compiler/src/render3/view/template';


@Component({
  selector: 'app-generate-random',
  templateUrl: './generate-random.component.html',
  styleUrls: ['./generate-random.component.css']
})
export class GenerateRandomComponent implements OnInit {

  counter: Counter = { counter1: 0, counter2: 0, counter3: 0 };

  form: FormGroup;
  enableStop: boolean = false;
  enableReportGen: boolean = false;
  error: string;
  configurable: boolean = false;

  Data: Array<any> = [
    { name: 'Numeric', value: 0 },
    { name: 'Alphanumeric', value: 1 },
    { name: 'Float', value: 2 }
  ];

  constructor(private fb: FormBuilder,
    private router: Router,
    private _reportService: ReportService,
    public _signalrService: SignalrService,
    private alertify: AlertifyService,
    private _spinnerService: NgxSpinnerService) {

    this.form = this.fb.group({
      checkArray: this.fb.array([], [Validators.required]),
      fileSize: [1, [Validators.required, Validators.min(1)]],
      numericP: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      alphaNumericP: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      floatP: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    },
      {
        validators: [this.CustomValidator]
      });
  }

  CustomValidator(group: FormGroup) {
    let sum = 0;
    sum += group.get('numericP')?.value;
    sum += group.get('alphaNumericP')?.value;
    sum += group.get('floatP')?.value;

    return sum > 100 ? { notValid: true } : null
  }

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  ngOnInit(): void {
    this._spinnerService.show();
    setTimeout(() => {
      this._spinnerService.hide();
    }, 3000);
  }

  submitForm() {
    if (this.form.valid) {
      this.enableStop = true;
      this._signalrService.counter.subscribe((counter: Counter) => {
        this.counter = counter;
      });

      this._signalrService.connection
        .invoke('GenerateRandomNumber')
        .catch(error => {
          console.log(`Signalr error: ${error}`);
          // alert('Signalr  error!, see console for details.');
        }
        );

      const payload = {
        selectedOptions: this.form.value.checkArray.map(Number),
        fileSize: +this.form.value.fileSize,//+ for converting string to int
        numericP: +this.form.value.numericP,
        alphaNumericP: +this.form.value.alphaNumericP,
        floatP: +this.form.value.floatP,
      }

      this.alertify.success("Started");

      this._reportService.generateRandom(payload).subscribe((result: any) => {
        if (result != null) {
          this.alertify.success("Genarate Completed");
          this.enableStop = false;
          this.enableReportGen = true;
        }
      },
        error => {
          this.error = error;
        });
    }
  }

  stopGenerateRandom() {
    this._reportService.stopRandom().subscribe((result: any) => {
      if (result != null) {
        console.log(result);
        this.alertify.warning("Stoped");
      }
    },
      error => {
        this.error = error;
      });
  }

  reportGenerate() {
    this.router.navigate(['/report']);
  }
  setDistribution() {
    this.configurable = true;
  }

  get fileSize() {
    return this.form.get('fileSize') as FormControl;
  }

  get numericP() {
    return this.form.get('numericP') as FormControl;
  }

  get alphaNumericP() {
    return this.form.get('alphaNumericP') as FormControl;
  }
  get floatP() {
    return this.form.get('floatP') as FormControl;
  }
}
