(function (){

'use strict';

var app = angular.module("NarrowItDownApp", []);

app.controller("NarrowItDownController", NarrowItDownController);
app.service("MenuSearchService", MenuSearchService);
app.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");
app.directive('foundItems', FoundItemsDirective);
NarrowItDownController.$inject = ['MenuSearchService'];
MenuSearchService.$inject = ['$http', 'ApiBasePath', '$q'];



function FoundItemsDirective(){
  var ddo = {
         restrict: 'E',
        templateUrl: 'foundItems.html',
        scope: {
                foundItems: '<',
                onRemove: '&'
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'foundList',
        bindToController: true

  }

  return ddo;
}

function FoundItemsDirectiveController() {
  var foundList = this;
}

function NarrowItDownController(MenuSearchService){
	var menu = this;
  menu.dataNotFound = false;
  menu.displayMenu = false;
  menu.found;
  menu.search = function(){
    var searchStr = menu.searchStr;

    if(searchStr == ""){
        menu.found = [];
        menu.dataNotFound = true;
        menu.displayMenu = false;
        return;
    }

    var promise = MenuSearchService.getMatchedMenuItems(searchStr);
    promise.then(function (response) {
      menu.found = response.data;
      if(menu.found.length == 0){
        menu.dataNotFound = true;
         menu.displayMenu = false;
      }else{
        menu.dataNotFound = false;
         menu.displayMenu = true;
      }
    })
    .catch(function (error) {
      console.log(error);
    })
  };

  menu.removeItem = function(index){
      menu.found.splice(index, 1);

  };

};

function MenuSearchService($http, ApiBasePath, $q){
	var service = this;



	service.getMatchedMenuItems = function (searchTerm){
      var deferred = $q.defer();
	 		$http({
  						method: "GET",
      					url: (ApiBasePath + "/menu_items.json")
    				}).then(function(response){
    						var menuArr = response.data.menu_items;
                var found = [];
                for (var i = 0; i < menuArr.length; i++ ) {
                      if(menuArr[i].description.toLowerCase().indexOf(searchTerm) !== -1){
                          found.push(menuArr[i]);
                      }

                };
                response.data = found
                deferred.resolve(response);

    				},function(error){
                deferred.reject(error);
    				});

            return deferred.promise;


	}
}

})();
