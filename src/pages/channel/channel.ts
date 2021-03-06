import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Storage } from "@ionic/storage";
import * as md5 from 'md5';
import { SocketService } from '../../providers/socket.service';

@IonicPage({
  name: 'channel',
  segment: 'channel/:channelId'
})
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
  providers: [SocketService]
})
export class ChannelPage {

  channel: any = {};
  channelName = "";
  messages = [];
  loading = true;
  message = "";
  channelId = "";
  channelQuery = gql`
    query GetChannel($id: String) {
      channel(id: $id) {
        id
        name
        messages {
          id
          text
          author {
            name
            email
          }
        }
      }
    }
  `;

  constructor(
    private navParams: NavParams,
    private apollo: Apollo,
    private storage: Storage,
    private socket: SocketService
  ) {
    console.log('wat');
    this.channelId = navParams.get('channelId');
    apollo.query({
      query: this.channelQuery,
      variables: {
        id: this.channelId
      }
    }).subscribe((res: any) => {
      const channel = res.data.channel;
      this.channelName = channel.name;
      this.messages = channel.messages.map(d => d);
      this.loading = false;
    });
    this.socket.onNewMessage().subscribe((message: any) => {
      if (message.channel === this.channelId) {
        if (!this.messages.find(msg => msg.id === message.id)) {
          this.messages.push(message);
        }
      }
    });
  }

  ionViewOnEnter() {
    console.log('ionViewDidLoad ChannelPage');
  }

  sendMessage = async () => {
    console.log(this.channel);
    this.socket.Debug();
    this.apollo.mutate({
      mutation: gql`
        mutation SendMessage($token: String!, $channelId: String!, $message: String!) {
          sendMessage(text: $message, token: $token, channel: $channelId) {
            status
            message {
              id
              text
              author {
                name
                email
              }
            }
          }
        }
      `,
      variables: {
        token: await this.storage.get('token'),
        channelId: this.channelId,
        message: this.message
      },
      // refetchQueries: [{
      //   query: this.channelQuery,
      //   variables: { id: this.channelId }
      // }]
    }).subscribe((res: any) => {
      const message = res.data.sendMessage;
      if (message.status === 1) {
        console.log(this.messages);
        this.messages.push(message.message);
      }
    })
  };

  ionViewWillLeave() {
    this.socket.Disconnect();
  }

  getAvatar(email) {
    const emailRegex = new RegExp(["[a-z0-9!#$%&'*+/=?^_`{|}~-]+",
      "(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)",
      "*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+",
      "[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"].join(''));
    const urlRegex = new RegExp(["([a-z]{1,2}tps?):\\/\\/((((?!\\/).)+)(?:(\\/.+\\/))?",
      "(?:(((?!(\\.|$|\\?|#)).)+))?(?:(\\.((?!(\\?|$|#)).)+))?(?:(\\?.+))?(?:(#.+))?)"].join(''));

    if (emailRegex.test(email)) {
      return `https://www.gravatar.com/avatar/${md5(email)}?d=retro`;
    }
    else if (urlRegex.test(email)) {
      return email;
    }
    else {
      return "http://via.placeholder.com/350x350";
    }
  }
}
