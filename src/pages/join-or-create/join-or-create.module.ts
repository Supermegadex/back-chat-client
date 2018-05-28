import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JoinOrCreatePage } from './join-or-create';

@NgModule({
  declarations: [
    JoinOrCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(JoinOrCreatePage),
  ],
})
export class JoinOrCreatePageModule {}
