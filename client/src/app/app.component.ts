import { Component } from '@angular/core';
import { TweetService } from './services/tweet.service';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private _tweetSubscription: Subscription;
  public tweets: Tweet[] = [];

  constructor(
    private tweetService: TweetService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Search tweets by search term
   * Once tweets found - create subscription to new tweets if not yet
   * @param search
   */
  public searchTweets(search: string): void {
    this.tweetService.getTweets(search)
      .subscribe((tweets: Tweet[]) => {
        if (!tweets || !tweets.length ) {
          this.snackBar.open('Sorry, no tweets found! Please try changing search term!', 'Got it', {
            duration: 10000
          });
          return;
        }
        this.snackBar.dismiss();
        this.tweets = tweets;

        if (!this._tweetSubscription) {
          this._subscribeToTweets();
        }
      });
  }

  /**
   * Subscribe to new tweet flow
   * When new tweet arrives - replace oldest tween in list with new one following FIFO rule
   * @private
   */
  private _subscribeToTweets(): void {
    this._tweetSubscription = this.tweetService.listenToTweets()
      .subscribe((tweet: Tweet) => {
        this.tweets.pop();
        this.tweets.unshift(tweet);
      });
  }
}
