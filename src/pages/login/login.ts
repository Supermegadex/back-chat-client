import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage({
  name: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  name = "";
  email = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apollo: Apollo,
    public storage: Storage,
    public event: Events
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    this.apollo.mutate({
      mutation: gql`
        mutation Login($name: String!, $email: String) {
          login(name: $name, email: $email) {
            status
            token
          }
        }
      `,
      variables: {
        name: this.name,
        email: this.email
      }
    }).subscribe((res: any) => {
      const login = res.data.login;
      if (res.data.login.status === 1) {
        this.storage.set('token', login.token).then(() => {
          this.navCtrl.setRoot(
            'joc',
            {},
            { animate: true, direction: 'forward' }
          );
        });
      }
    })
  }

}
