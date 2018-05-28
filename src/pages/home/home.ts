import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@IonicPage({
  name: 'home'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public modal: ModalController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  openLogin() {
    const login = this.modal.create('login'); 
    login.present();
  }

}
