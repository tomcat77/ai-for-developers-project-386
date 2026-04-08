import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { EventType, CreateEventTypeRequest, UpdateEventTypeRequest } from '../../../../core/models';

interface DialogData {
  mode: 'create' | 'edit';
  eventType?: EventType;
}

@Component({
  selector: 'app-event-type-dialog',
  templateUrl: './event-type-dialog.component.html',
  styleUrls: ['./event-type-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ]
})
export class EventTypeDialogComponent {
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', Validators.required],
    durationMinutes: [30, [Validators.required, Validators.min(1), Validators.max(480)]],
    color: ['#ff9800', Validators.required]
  });

  constructor(
    public dialogRef: MatDialogRef<EventTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    if (data.mode === 'edit' && data.eventType) {
      this.form.patchValue({
        name: data.eventType.name,
        description: data.eventType.description,
        durationMinutes: data.eventType.durationMinutes,
        color: data.eventType.color
      });
    }
  }

  get isEdit(): boolean {
    return this.data.mode === 'edit';
  }

  get title(): string {
    return this.isEdit ? 'Редактировать тип события' : 'Создать тип события';
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (!this.form.valid) {
      return;
    }

    const formValue = this.form.value;

    if (this.isEdit && this.data.eventType) {
      const updateData: UpdateEventTypeRequest = {
        id: this.data.eventType.id,
        name: formValue.name,
        description: formValue.description,
        durationMinutes: formValue.durationMinutes,
        color: formValue.color
      };
      this.dialogRef.close(updateData);
    } else {
      const createData: CreateEventTypeRequest = {
        name: formValue.name,
        description: formValue.description,
        durationMinutes: formValue.durationMinutes,
        color: formValue.color
      };
      this.dialogRef.close(createData);
    }
  }
}