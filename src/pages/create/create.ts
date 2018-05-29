import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage({
  name: 'create'
})
@Component({
  selector: 'page-create',
  templateUrl: 'create.html',
})
export class CreatePage {

  name;

  constructor(
    private navCtrl: NavController,
    private navParams: NavParams,
    private apollo: Apollo
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatePage');
  }

  create() {
    this.apollo.mutate({
      mutation: gql`
        mutation CreateServer($name: String!) {
          createServer(name: $name) {
            id
            code
          }
        }
      `
    })
  }

}
