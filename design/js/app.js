/**
 * Application by modules
*/
var apps = angular.module('codproxApp', ['ngMaterial', 'ngMessages']); 

apps.factory('PostService',function($http, $q){
	return {   
		get: function(file){
			// const appPath = remote.app.getAppPath() ;
			return $http.get(file).then(function(data){
				return data.data
			})
		},
		_getCookise: function(key){
			var user = localStorage.getItem(key);
			return user && JSON.parse(user);
		},
		_setCookise: function(key,value){
			localStorage.setItem(key, JSON.stringify(value));
			return 1;
		},
		_destroyCookise: function(key){
			localStorage.removeItem(key);
			return 1;
		}, 
		destroyallCookise: function(key){
			localStorage.clear();
			return 1;
		}, 
		_isExist: function(dt){
			if(this._getCookise(dt)) return true; else return false;
		},
	}
})
apps.run(function($location){
    // 
})
apps.controller('rootCtrl', function($scope,PostService){
	$scope.changeState_ = function(){ $.apply(); $scope.$applyAsync(); }
	$scope.reloadRoute_ = function(){ $route.reload(); }
	$scope.changeroute  = function (route, reload=null){ 
		$location.path('/'+route);  
		if(reload !=null){
			$scope.reloadRoute_();  
		}
	} 

	var db = 'dbapps.json';
	var ca = 'category.json';
	$scope.listApps = [];
	$scope.category = [];
    PostService.get(db).then(function(data){
		console.log(data)
		$scope.listApps = data;
		$scope.changeState_();
	})
    PostService.get(ca).then(function(data){
		console.log(data)
		$scope.category = data;
		$scope.changeState_();
	})
})
