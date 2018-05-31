import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavParams } from 'ionic-angular';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { SocketService } from '../../providers/socket.service';

@IonicPage({
  name: 'server',
  segment: 'server/:serverId'
})
@Component({
  selector: 'page-server',
  templateUrl: 'server.html',
  providers: [SocketService]
})
export class ServerPage {

  @ViewChild(Nav) nav: Nav;
  channels: Array<{ name: string, id: string }> = [];
  members: Array<{ name: string, email: string }> = [];

  serverId;
  channelId;
  loading = 'true';

  constructor(
    private params: NavParams,
    private apollo: Apollo,
    private socket: SocketService
  ) {
    this.serverId = params.get('serverId');
    this.channelId = params.get('channelId');
    this.initialize();
  }

  initialize = async () => {
    const gatewaySuccess = await this.socket.Join(this.serverId);
    if (gatewaySuccess) {
      this.getServerData(this.serverId);
    }
  };

  getServerData(id) {
    this.apollo.query({
      query: gql`
        query GetChannels($id: String) {
          server(id: $id) {
            channels {
              name
              id
            }
            members {
              name
              email
            }
          }
        }
      `,
      variables: { id }
    }).subscribe((res: any) => {
      this.channels = res.data.server.channels;
      this.members = res.data.server.members;
      this.nav.setRoot(
        'channel',
        { channelId: this.channels[0].id, serverId: this.serverId },
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
