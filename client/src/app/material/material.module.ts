import { NgModule } from '@angular/core';
import {
  MatCardModule, MatFormFieldModule, MatInputModule, MatListModule,
  MatToolbarModule, MatIconModule, MatButtonModule
} from '@angular/material';


@NgModule({
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class MaterialModule { }
