import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { TweetService } from './services/tweet.service';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';

/**
 * Socket IO config
 */
const socketConfig: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(socketConfig),
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [ConfigService, TweetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
