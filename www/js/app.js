/* Main JS File */



var appModule = angular.module('app', ['onsen', 'ngResource']);
	
	appModule.controller('playerController', function ($scope) {
		$scope.listenbtntext = "Listen Live";
		
		$scope.playAudio = function() {
			$scope.listenbtntext = "Playing";
		};
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
	.controller('podcastController', function ($scope, FeedList) {
		
		$scope.feeds = FeedList.get(app.podnav.getCurrentPage().options.url);
		
		$scope.class = app.podnav.getCurrentPage().options.class;
		
		
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
