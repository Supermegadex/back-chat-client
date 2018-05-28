import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

@IonicPage({
  name: 'welcome'
})
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  slides = [
    {
      title: "Log in with your name and email.",
      description: `By providing an email, you get a cool custom-generated avatar
        from <a href="https://gravatar.com">Gravatar</a>, but we understand
        your privacy concerns, so you can leave it out if you choose.`
    },
    {
      title: "Create or join a server.",
      description: [
        `In Back Chat, communities are centered around <i>servers</i>.
        Servers have multiple <i>channels</i>, which is where messages live.`,
        `Anyone can create a server, and anyone can join a server as long
        as they have the unique server code.`
      ]
    },
    {
      title: "Send messages.",
      description: `When you are in a server, you can send messages to any channel
        that is part of the server. Select the channel on the right side,
        and the messages that are part of that channel will show up.
        If you send a message, it will go to that channel.`
    }
  ];

  @ViewChild(Slides) slider: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  getMulti(desc) {
    return typeof desc === 'object';
  }

  slideToEnd() {
    const length = this.slider.length();
    this.slider.slideTo(length - 1);
  }

  login() {
    this.navCtrl.setRoot('login', {}, {
      animate: true,
      direction: 'forward'
    })
  }

}
