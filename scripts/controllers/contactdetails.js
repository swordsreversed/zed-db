'use strict';

app.controller('ContactdetailsCtrl', function($scope, $stateParams, $http, ContactService, ContactCategoriesService, DepartmentsService, InterestsService, $dialog, $location, limitToFilter, contact, $anchorScroll, $timeout) {

		//set vars for constants
		$scope.locked = false;
		$scope.alerts = [];
		$scope.consuggest = [];
		$scope.submitType = ($location.path() == '/contacts/new/contact') ? 'Add Contact' : 'Update';

		if ($stateParams.id) {
				$scope.contact = contact;
		} else {
				$scope.contact = new ContactService();
		}

		$scope.suburbsuggest = function(suburbName) {
				return $http.get(apiSrc + '/suburbsuggest/' + suburbName).then(function(response) {
						return limitToFilter(response.data, 15);

				});
		};

		$scope.conCheck = function(org_nm) {
				if (org_nm.length >= 3) {
					$http.get(apiSrc + '/concheck/' + org_nm).then(function(response) {
							$scope.consuggest = response.data;
					});
				}
		};

		$scope.departments = DepartmentsService.query();
		$scope.interests = InterestsService.query();
		$scope.contactcats = ContactCategoriesService.query(function() {
				if ($scope.contact.contactcategories) {
						var fakeInit = function() {
								$scope.csArr = _.pluck($scope.contact.contactcategories, 'id');
						}
						$timeout(fakeInit, 300);
				}
		});


		$scope.saveContact = function() {
				$scope.contact.contactcategories = $scope.csArr;
				$scope.locked = true;

				if ($stateParams.id) {
						//update
						$scope.contact.$update({
								id: $stateParams.id
						}, function success(response) {

								$scope.locked = false;
								if ($scope.alerts.length > 0) {
										$scope.alerts.splice(0, 1);
								}
								$scope.alerts.push({
										msg: 'Contact ' + $stateParams.id + ' Updated!'
								});

								$scope.contact = ContactService.get({
										id: $stateParams.id
								});
								$anchorScroll();

						}, function err() {
								console.log('Couldnt update!');
						});

				} else {
						//insert
						$scope.contact.$save(function() {

								$scope.locked = false;
								alert('Contact added');
								$location.path('/contacts/' + $scope.contact.contact_no);
						});
				}
		};



		$scope.deleteContact = function() {
				var title = 'Warning';
				var msg = 'Are you sure you wish to delete this record?';
				var btns = [{
						result: 'cancel',
						label: 'Cancel'
				}, {
						result: 'ok',
						label: 'OK',
						cssClass: 'btn-primary'
				}];


				$dialog.messageBox(title, msg, btns)
						.open()
						.then(function(result) {
								if (result === 'ok') {
										$scope.contact.$delete({
												id: $stateParams.id
										}, function() {

												alert('Record deleted');
												$location.path('/contacts');

										});
								}
						});
		};


		$scope.closeAlert = function(index) {
				$scope.alerts.splice(index, 1);
		};

		$scope.onSuburbChange = function($item, $model, $label) {

				//item = suburb object, model = val (id), label = name

				$scope.contact.postcode = $item.postcode;
				$scope.contact.state = $item.state;
		};

});
