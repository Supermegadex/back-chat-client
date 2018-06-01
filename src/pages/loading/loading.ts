import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage({
  name: 'loading',
  segment: 'auth'
})
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html'
})
export class LoadingPage {

  constructor(
    private nav: NavController,
    private params: NavParams,
    private apollo: Apollo,
    private event: Events,
    private storage: Storage
  ) {
    this.checkToken();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoadingPage');
  }

  checkToken = async () => {
    await this.storage.ready();
    const token = await this.storage.get('token');
    if (token) {
      this.apollo.query({
        query: gql`
          query Authenticate($token: String!) {
            auth(token: $token) {
              status
              server
              user {
                name
              }
            }
          }
        `,
        variables: { token }
      }).subscribe((res: any) => {
        const auth = res.data.auth;
        console.log(auth);
        if (auth.status === 1) {
          if (auth.server) {
            // this.getServerData(auth.server);
            console.log("Good auth. Going to server page...");
            this.nav.setRoot(
              'server',
              { serverId: auth.server },
              { animate: true, direction: 'forward' }
            )
          }
          else {
            this.nav.setRoot(
              'joc',
              { error: auth.status },
              { animate: true, direction: 'forward' }
            )
          }
        }
        else {
          this.nav.setRoot(
            'login',
            { error: auth.status },
            { animate: true, direction: 'forward' }
          )
        }
      })
    }
    else {
      this.nav.setRoot(
        'welcome',
        { },
        { animate: true, direction: 'forward' }
      )
    }
  }

}
