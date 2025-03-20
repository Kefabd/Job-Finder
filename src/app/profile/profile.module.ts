import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ProfileComponent } from './profile.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@NgModule({
  declarations: [ProfileComponent, EditProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class ProfileModule {}
