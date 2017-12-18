import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from '../config.service';

import 'rxjs/add/operator/map';

@Injectable()
export class TweetService {

  constructor(
    private socket: Socket,
    private http: HttpClient,
    private configService: ConfigService
  ) { }

  /**
   * Get tweets
   * @param search
   * @returns {Observable<Object>}
   */
  public getTweets(search: string): Observable<any> {
    return this.http.get(`${this.configService.serverRoot}/search/tweets/${search}`);
  }

  /**
   * Listen to new tweets
   * @returns {Observable<any>}
   */
  public listenToTweets() {
    return this.socket
      .fromEvent<any>('tweet');
  }
}
