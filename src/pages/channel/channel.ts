import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@IonicPage({
  name: 'channel',
  segment: 'channel/:channelId'
})
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {

  channel = {};
  loading = true;

  constructor(
    private navParams: NavParams,
    private apollo: Apollo
  ) {
    const channelId = navParams.get('channelId');
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
        id: channelId || "5ae3847aa9200541e0363c51"
      }
    }).subscribe((res: any) => {
      this.channel = res.data.channel;
      this.loading = false;
    });
  }

  ionViewOnEnter() {
    console.log('ionViewDidLoad ChannelPage');
  }

}
