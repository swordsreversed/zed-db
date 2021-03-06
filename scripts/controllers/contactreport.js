'use strict';

app.controller('ContactreportCtrl', function($rootScope, $scope, $http, $filter, $location, ContactReportService, DepartmentsService, InterestsService, limitToFilter) {

    $scope.contactSearchFormData = {};

    $scope.departments = DepartmentsService.query(function(data, status) {
        $scope.contactSearchFormData.dept_sun = [];
    });

    $scope.interests = InterestsService.query(function(data, status) {
        $scope.contactSearchFormData.interest_sun = [];
    });

    $scope.suburbsuggest = function(suburbName) {
        return $http.get(apiSrc + '/suburbsuggest/' + suburbName).then(function(response) {
            return limitToFilter(response.data, 15);

        });
    };

    $scope.gridContactOptions = {
        data: 'contacts',
        enableCellSelection: false,
        enableRowSelection: false,
        enableCellEdit: false,
        showFilter: true,
        columnDefs: [ {
            field: 'org_nm',
            displayName: 'Organisation'
        }, {
            field: 'contact_nm',
            displayName: 'Contact Name',
            cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()"><span ng-cell-text><a href="/contacts/{{row.entity.contact_no}}">{{COL_FIELD}}</a></span></div>'
        }, {
            field: 'email',
            displayName: 'Email'
        }, {
            field: 'work_ph',
            displayName: 'Phone'
        }]
    };

    $scope.search = function() {

        if ($scope.contactSearchForm.$dirty === true) {

            // search with qstring - return LIST of results from resource
            $scope.contacts = ContactReportService.query($scope.contactSearchFormData, function(data, response) {

                $scope.emailList = function() {
                    var text = '';
                    angular.forEach(data, function(d) {
                        if (d.email == null) {
                        } else {
                            text = text + d.email + ', ';
                        }

                    });

                    text = text.substring(0, text.length - 2);
                    return text;
                }


            });

        } else {
            console.log('no search!');
        }
    };


    $scope.clearForm = function() {
        $scope.contactSearchFormData = {};
        $scope.contactSearchForm.$setPristine();
        $scope.contacts = {};
    };

    $scope.convertDate = function() {

        $scope.ddd = $filter('date')($scope.contactSearchFormData.date_end, 'y-MM-dd');
    }

    $scope.onSuburbChange = function($item, $model, $label) {


        //item = suburb object, model = val (id), label = name
        //$contactSearchFormData.suburbid = $item.suburbid;
        $scope.contactSearchFormData.postcode = $item.postcode;

    };

    $scope.goToPrint = function () {
        $rootScope.printBuffer = $scope.contacts;
        $rootScope.formBuffer = $scope.contactSearchFormData;
        $location.path('print/contacts');
    };

});
