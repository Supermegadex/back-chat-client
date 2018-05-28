import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'joc'
})
@Component({
  selector: 'page-join-or-create',
  templateUrl: 'join-or-create.html',
})
export class JoinOrCreatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinOrCreatePage');
  }

  join() {
    this.navCtrl.push('join');
  }

}
