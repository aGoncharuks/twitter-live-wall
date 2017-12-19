import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { TweetService } from './services/tweet.service';
import { SocketIoConfig, SocketIoModule } from 'ng-socket-io';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ConfigService } from './services/config.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

describe('AppComponent', () => {

  const socketConfig: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
  const tweetsMock = [
    {
      text: 'tweet text 1',
      username: 'username 1',
      avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
    },
    {
      text: 'tweet text 2',
      username: 'username 2',
      avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
    }
  ];
  const newTweetMock = {
    text: 'tweet text 3',
    username: 'username 3',
    avatar: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
  };
  const tweetsObservableMock = Observable.of(tweetsMock);
  const newTweetObservableMock = Observable.of(newTweetMock);

  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let view: HTMLElement;
  let tweetService: TweetService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        SocketIoModule.forRoot(socketConfig),
        HttpClientModule,
        BrowserAnimationsModule,
        MaterialModule
      ],
      providers: [
        TweetService,
        ConfigService
      ],
      declarations: [
        AppComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    view = fixture.debugElement.nativeElement;
    tweetService = fixture.debugElement.injector.get(TweetService);
  });

  it('Should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it(`Should initially have empty tweets array`, async(() => {
    expect(component.tweets).toEqual([]);
  }));

  it('Should have empty search input in view', async(() => {
    fixture.detectChanges();
    expect(view.querySelector('input').value).toBe('');
  }));

  it('Should call tweet service and return tweets', async(() => {
    spyOn(tweetService, 'getTweets').and.returnValue(tweetsObservableMock);
    component.searchTweets('string');
    expect(component.tweets).toEqual(tweetsMock);
  }));

  it('Should show nothing if no tweets found', async(() => {
    spyOn(tweetService, 'getTweets').and.returnValue(Observable.of([]));
    component.searchTweets('string');
    fixture.detectChanges();
    const viewTweets = view.querySelectorAll('.tweet-list-item');
    expect(viewTweets.length).toBe(0);
  }));

  it('Should display found tweets on the screen', async(() => {
    spyOn(tweetService, 'getTweets').and.returnValue(tweetsObservableMock);
    component.searchTweets('string');
    fixture.detectChanges();
    const viewTweets = view.querySelectorAll('.tweet-list-item');
    const firstViewTweetText = viewTweets[0].querySelector('.tweet-text').textContent;
    expect(viewTweets.length).toBe(tweetsMock.length);
    expect(firstViewTweetText).toBe(tweetsMock[0].text);
  }));

  it('Should update tweets list when new tweet arrives', async(() => {
    spyOn(tweetService, 'getTweets').and.returnValue(tweetsObservableMock);
    spyOn(tweetService, 'listenToTweets').and.returnValue(newTweetObservableMock);
    component.searchTweets('string');
    fixture.detectChanges();
    const viewTweets = view.querySelectorAll('.tweet-list-item');
    const firstViewTweetText = viewTweets[0].querySelector('.tweet-text').textContent;
    const lastViewTweetText = viewTweets[viewTweets.length - 1].querySelector('.tweet-text').textContent;
    expect(viewTweets.length).toBe(tweetsMock.length);
    expect(firstViewTweetText).toBe(newTweetMock.text);
    expect(lastViewTweetText).toBe(tweetsMock[1].text);
  }));
});
