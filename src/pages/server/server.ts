import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavParams } from 'ionic-angular';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

@IonicPage({
  name: 'server',
  segment: 'server/:serverId'
})
@Component({
  selector: 'page-server',
  templateUrl: 'server.html',
})
export class ServerPage {

  @ViewChild(Nav) nav: Nav;
  channels: Array<{name: string, id: string}> = [];

  serverId;
  channelId;
  loading = 'true';

  constructor(
    private params: NavParams,
    private apollo: Apollo,

  ) {
    this.serverId = params.get('serverId');
    this.channelId = params.get('channelId');
    this.getServerData(this.serverId);
  }

  getServerData(id) {
    this.apollo.query({
      query: gql`
        query GetChannels($id: String) {
          server(id: $id) {
            channels {
              name
              id
            }
          }
        }
      `,
      variables: { id }
    }).subscribe((res: any) => {
      this.channels = res.data.server.channels;
      this.nav.setRoot(
        'channel',
        { channelId: this.channels[0].id },
        { animate: true, direction: 'forward' }
      );
    })
  }

  openChannel(channel) {
    this.nav.setRoot(
      'channel',
      { channelId: channel.id },
      { animate: true, direction: 'forward' }
    );
  }

}
