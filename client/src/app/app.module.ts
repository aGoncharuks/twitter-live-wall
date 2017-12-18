import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { TweetService } from './services/tweet/tweet.service';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';

/**
 * Socket IO config
 */
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [ConfigService, TweetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
