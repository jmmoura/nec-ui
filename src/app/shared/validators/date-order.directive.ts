import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, NgModel } from '@angular/forms';

@Directive({
  selector: '[appDateOrder]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateOrderDirective),
      multi: true,
    },
  ],
})
export class DateOrderDirective implements Validator {
  @Input() start!: NgModel; // assignmentDate
  @Input() end!: NgModel;   // completedDate

  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.start || !this.end) return null;

    const startVal = this.toDate(this.start.value);
    const endVal = this.toDate(this.end.value);

    if (!startVal || !endVal) {
      this.clearEndError();
      return null;
    }

    // Turn invalid if completedDate < assignmentDate
    const invalid = endVal.getTime() < startVal.getTime();

    if (invalid) {
      const current = this.end.control?.errors || {};
      this.end.control?.setErrors({ ...current, dateOrder: true });
      return { dateOrder: true };
    } else {
      this.clearEndError();
      return null;
    }
  }

  private clearEndError() {
    const errors = this.end.control?.errors;
    if (!errors) return;
    if ('dateOrder' in errors) {
      delete errors.dateOrder;
      if (Object.keys(errors).length === 0) {
        this.end.control?.setErrors(null);
      } else {
        this.end.control?.setErrors(errors);
      }
    }
  }

  private toDate(val: any): Date | null {
    if (!val) return null;
    // Expecting 'yyyy-MM-dd' from ion-input type="date"
    if (typeof val === 'string') {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(val);
      if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
}
