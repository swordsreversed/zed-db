'use strict';

app.controller('ReleaseCtrl', function($rootScope, $scope, $http, $location, $stateParams, ReleaseService, GenresService, ThemesService, limitToFilter, $filter, promiseTracker) {



	$scope.releaseSearchFormData = {};
	$scope.rTracker = promiseTracker('rTracker');

	if ($rootScope.releaseParams) {
		$scope.releases = ReleaseService.query($rootScope.releaseParams, function() {
			//set order of display
			$scope.predicate = 'release_year';
			$scope.releaseSearchFormData = $rootScope.releaseParams;
			//delete $rootScope.releaseParams;
		});
	}

	$scope.ausnz = ["A", "NZ"];
	$scope.format = ["CD", "DIGITAL", "VINYL"];
	$scope.extendedFormats = [{
		format_srch: 'CD',
		format_desc: 'CD'
	}, {
		format_srch: 'DIGITAL',
		format_desc: 'DIGITAL'
	}, {
		format_srch: 'LP',
		format_desc: 'VINYL LP'
	}, {
		format_srch: '7"',
		format_desc: 'VINYL 7"'
	}];

	$scope.genres = GenresService.query();
	$scope.themes = ThemesService.query();

	$scope.artists = function(artistName) {
		return $http.get(apiSrc + '/artistsuggest/' + artistName).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};

	$scope.titles = function(title) {
		return $http.get(apiSrc + '/titlesuggest/' + title).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};

	$scope.labels = function(label) {
		return $http.get(apiSrc + '/labelsuggest/' + label).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};

	$scope.apra = function(apra) {
		return $http.get(apiSrc + '/aprasuggest/' + apra).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};

	$scope.hometown = function(hometown) {
		return $http.get(apiSrc + '/hometownsuggest/' + hometown).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};

	$scope.country = function(country) {
		return $http.get(apiSrc + '/countrysuggest/' + country).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};



	$scope.search = function($element) {


		if ($scope.releaseSearchForm.$dirty === true) {
			var params = $scope.releaseSearchFormData;

			$scope.releases = ReleaseService.query(params);
			$scope.rTracker.addPromise($scope.releases);
			$scope.releases.$then(function(u, getResponseHeaders) {

				//set order of display
				$scope.predicate = 'release_year';
				$scope.artistname = $stateParams.name;
				$rootScope.releaseParams = params;

			});
		} else {
			console.log('no search shit!');

		}
	};


	$scope.clearForm = function() {
		$location.path('/releases');
		$scope.releaseSearchFormData = {};
		$scope.releaseSearchForm.$setPristine();
		delete $rootScope.releaseParams;
		$scope.releases = {};
	};


	//add new
	$scope.add = function() {
		if ($scope.releaseSearchFormData.artist_nm) {
			$location.path('/releases/new/release/' + $scope.releaseSearchFormData.artist_nm);
		} else {
			$location.path('/releases/new/release');
		}
	};

	$scope.convertDate = function(date) {
		console.log(date);
		$scope.cDate = $filter('date')(new Date(date), 'y-MM-dd');
	};
});
