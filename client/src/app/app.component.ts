import { Component, OnDestroy } from '@angular/core';
import { TweetService } from './services/tweet.service';
import { Subscription } from 'rxjs/Subscription';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

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
    if (!search) {
      this.snackBar.open('Please enter you search criteria!', 'Got it', {
        duration: 5000
      });
      return;
    }
    this.tweetService.getTweets(search)
      .subscribe((tweets: Tweet[]) => {
        if (!tweets || !tweets.length ) {
          this.snackBar.open('Sorry, no tweets found! Please try changing search criteria!', 'Got it', {
            duration: 10000
          });
          return;
        }
        this.snackBar.dismiss();
        this.tweets = tweets;

        if (!this._tweetSubscription) {
          this._subscribeToTweets();
        }
      },
      (error) => {
        this.snackBar.open('Error on getting tweets! Please try again!', 'Got it', {
          duration: 5000
        });
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
      },
      (error) => {
        this.snackBar.open('Error on subscribing to tweets! Please try again!', 'Got it', {
          duration: 5000
        });
      });
  }

  ngOnDestroy() {
    this._tweetSubscription.unsubscribe();
  }
}
