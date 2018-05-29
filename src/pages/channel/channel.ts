import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Storage } from "@ionic/storage";
import * as md5 from 'md5';

@IonicPage({
  name: 'channel',
  segment: 'channel/:channelId'
})
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {

  channel: any = {};
  channelName = "";
  messages = [];
  loading = true;
  message = "";
  channelId = "";

  constructor(
    private navParams: NavParams,
    private apollo: Apollo,
    private storage: Storage
  ) {
    console.log('wat');
    this.channelId = navParams.get('channelId');
    apollo.query({
      query: gql`
        query GetChannel($id: String) {
          channel(id: $id) {
            name
            messages {
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
        id: this.channelId
      }
    }).subscribe((res: any) => {
      const channel = res.data.channel;
      this.channelName = channel.name;
      this.messages = channel.messages.map(d => d);
      this.loading = false;
    });
  }

  ionViewOnEnter() {
    console.log('ionViewDidLoad ChannelPage');
  }

  sendMessage = async () => {
    console.log(this.channel);
    this.apollo.mutate({
      mutation: gql`
        mutation SendMessage($token: String!, $channelId: String!, $message: String!) {
          sendMessage(text: $message, token: $token, channel: $channelId) {
            status
            message {
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
      }
    }).subscribe((res: any) => {
      const message = res.data.sendMessage;
      if (message.status === 1) {
        console.log(this.messages);
        this.messages.push(message.message);
      }
    })
  };


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
