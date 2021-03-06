import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { ENV } from "@app/env";
import { APP_BASE_HREF } from '@angular/common';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      locationStrategy: ENV.mode === "Development" ? 'hash' : 'path'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
  public debug = ENV.mode === "Development";

  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({ uri: this.debug ? 'http://localhost:4000/graphql' : 'https://api.back-chat.com/graphql' }),
      cache: new InMemoryCache(),
    });
  }
}
