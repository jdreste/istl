/* Main JS File */



var appModule = angular.module('app', ['onsen', 'ngResource', 'ngWebAudio']);
	
	appModule.service('nowPlaying', function ($rootScope, WebAudio) {
		this.currentURL = '';
		this.isPlaying = false;
		this.audio = WebAudio('http://1601.live.streamtheworld.com:80/WGNUAM_SC', {buffer: false});
		
		this.udpateURL = function( url ) {
			this.currentURL = url;
		};
		
		this.playLiveStream = function() {
			this.audio.stop();
			this.audio = {};
			this.audio = WebAudio('http://1601.live.streamtheworld.com:80/WGNUAM_SC', {buffer: false});
			this.audio.play();
		};
		
		this.playPodCast = function() {
			this.audio.stop();
			this.audio = {};
			this.audio = WebAudio(this.currentURL, {buffer: false});
			this.audio.play();
		};
		
		this.stopAudio = function() {
			this.audio.stop();
		};
		
		this.pauseAudio = function() {
			this.audio.pause();
		};
		
	
	});
	
	appModule.controller('playerController', function ($rootScope, $scope, WebAudio, nowPlaying) {
		
		//var audioURL = (nowPlaying.currentURL !== '') ? nowPlaying.currentURL : 'http://www.insidestlaudio.com/ITD_Audio/111115-4TMA.mp3'; 
		$scope.listenbtntext = nowPlaying.currentURL;
	    
          $scope.buffer = function() {

          }
          
          $scope.playLive = function() {
          	$scope.listenbtntext = "Live Stream";
          	nowPlaying.playLiveStream();
          }
          $scope.play = function() {
            $scope.listenbtntext = "Buffering...";
            nowPlaying.playPodCast();
          }
          $scope.pause = function() {
			nowPlaying.pauseAudio();
			$scope.listenbtntext = "Paused";
          }
          $scope.stop = function() {
			nowPlaying.stopAudio();
            $scope.listenbtntext = "Stopped";
          }
	});
	
	appModule.factory('FeedLoader', function ($resource) {
		return $resource('http://ajax.googleapis.com/ajax/services/feed/load', {}, {
			fetch: { method: 'JSONP', params: {v: '1.0', callback: 'JSON_CALLBACK'} }
		});
	})
	.service('FeedList', function ($rootScope, FeedLoader) {
		
		this.get = function( podurl) {
			var feeds = [];
			var feed = {};
			
			FeedLoader.fetch({q: podurl, num: 10}, {}, function (data) {
				var feed = data.responseData.feed;
				feeds.push(feed);
			});

			return feeds;
		};
	})
	.controller('podcastController', function ($scope, FeedList, nowPlaying) {
		
		$scope.feeds = FeedList.get(app.podnav.getCurrentPage().options.url);
		
		$scope.class = app.podnav.getCurrentPage().options.class;
		
		$scope.openPodCast = function(link) {
			nowPlaying.udpateURL(link);
			app.podnav.pushPage("home.html");
			nowPlaying.playPodCast();
		};
		
	});

	appModule.controller('showlistController', function ($scope, $http) {
		$http.get('data/showlist.json')
       		.success(function(data){
          		$scope.shows = data;                
        });
        
		$scope.gotoShow = function(pditem) {
			app.podnav.pushPage("podcasts.html", { name: pditem.name, class: pditem.class, url: pditem.podcast});
		};
	});
