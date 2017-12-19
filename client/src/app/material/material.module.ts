import { NgModule } from '@angular/core';
import {
  MatCardModule, MatFormFieldModule, MatInputModule, MatListModule,
  MatToolbarModule, MatIconModule, MatButtonModule, MatSnackBarModule
} from '@angular/material';


@NgModule({
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class MaterialModule { }
