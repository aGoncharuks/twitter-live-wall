import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from './config.service';


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
   * @returns {Observable<Tweet[]>}
   */
  public getTweets(search: string): Observable<any> {
    return this.http.get(`${this.configService.serverRoot}/search/tweets/${search}`);
  }

  /**
   * Listen to new tweets
   * @returns {Observable<Tweet>}
   */
  public listenToTweets(): Observable<Tweet> {
    return this.socket
      .fromEvent<any>('tweet');
  }
}
