import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = '';
  name = "";

  channels: Array<{name: string, id: string}> = [];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public apollo: Apollo,
    public event: Events,
    public storage: Storage
  ) {
    this.initializeApp();
    event.subscribe('bc:join', serverId => {
      this.nav.setRoot(
        'server',
        { serverId: serverId },
        { animate: true, direction: 'forward' }
      )
    });
  }

  initializeApp = async () => {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    console.log(this.nav);
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
  };

  // getServerData(id) {
  //   this.apollo.query({
  //     query: gql`
  //       query GetChannels($id: String) {
  //         server(id: $id) {
  //           channels {
  //             name
  //             id
  //           }
  //         }
  //       }
  //     `,
  //     variables: { id }
  //   }).subscribe((res: any) => {
  //     this.channels = res.data.server.channels;
  //     this.nav.setRoot(
  //       'channel',
  //       { channelId: this.channels[0].id },
  //       { animate: true, direction: 'forward' }
  //     );
  //   })
  // }
  //
  // openChannel(channel) {
  //   this.nav.setRoot(
  //     'channel',
  //     { channelId: channel.id },
  //     { animate: true, direction: 'forward' }
  //   );
  // }
}
