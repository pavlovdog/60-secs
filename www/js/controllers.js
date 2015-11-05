angular.module('starter.controllers', ['firebase'])

.controller('CommentsCtrl', ['$scope', '$firebaseObject', '$firebaseAuth', '$timeout',
  function($scope, $firebaseObject, $firebaseAuth, $timeout){

    $scope.counter = 60;
    
    $scope.onTimeout = function(){
      if($scope.counter>0){
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout,1000);
      }
      else{
        $scope.stop();
      }
    }
    // var mytimeout = $timeout($scope.onTimeout,1000);

    $scope.disableButton = function(){
      setTimeout(function() {
          document.getElementById('button').disabled = false;
      }, 30000);
    }

    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }

    var fbRef = new Firebase('https://easymoneyapp.firebaseio.com/');
    var authObj = $firebaseAuth(fbRef);
 
    $scope.authData = authObj.$getAuth();

    $scope.addClick = function(){
      try{
        $scope.stop();
      }
        catch(e){      
      }

      setTimeout(function() {
          document.getElementById('button').disabled = null;
      }, 3000);      

      $scope.counter=60;
      var mytimeout = $timeout($scope.onTimeout,1000);

      // Send new click
      var newTime = Date.now();
      $scope.newTime = newTime;

      // Get list of clicks after user press the button
      var dataObj = $firebaseObject(fbRef.orderByChild('time').startAt(newTime));
      dataObj.$loaded(function(){
        dataObj.$bindTo($scope, 'dataBind')

        var newClick = $firebaseObject(fbRef.child(newTime))
        newClick.$value = {
          username: $scope.authData.twitter.username,
          time: newTime,
          authPic: $scope.authData.twitter.profileImageURL
        }
        newClick.$save();

      })
    }



}])

.controller('LoginCtrl', ['$scope', '$firebaseAuth', '$state',
  function($scope, $firebaseAuth, $state){
    $scope.debug = 'Login';

    var fbRef = new Firebase('https://easymoneyapp.firebaseio.com/');
    var authObj = $firebaseAuth(fbRef);
    console.log(authObj.$getAuth())
    if(authObj.$getAuth()){
        $state.go('comments');
    }

    $scope.login = function(provider){
      authObj.$authWithOAuthRedirect(provider).then(function(authData) {
        console.log("Logged in as:", authData);
        $state.go('comments');
      }).catch(function(error) {
        console.error("Authentication failed:", error);
      });
    }
}]);
