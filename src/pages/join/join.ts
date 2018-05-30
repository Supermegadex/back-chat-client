import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'join'
})
@Component({
  selector: 'page-join',
  templateUrl: 'join.html'
})
export class JoinPage {


  code = "";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apollo: Apollo,
    public storage: Storage,
    public event: Events
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinPage');
  }

  join = async () => {
    this.apollo.mutate({
      mutation: gql`
        mutation JoinServer($code: String!, $token: String!) {
          joinServer(code: $code, token: $token) {
            status
            server {
              id
            }
          }
        }
      `,
      variables: {
        code: this.code,
        token: await this.storage.get('token')
      }
    }).subscribe(async (res: any) => {
      const join = res.data.joinServer;
      if (join.status === 1) {
        this.event.publish('bc:join', join.server.id);
      }
    })
  }
}
