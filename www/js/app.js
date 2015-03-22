// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ng-cordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}).
service('CurentData',[function(){
    return {
        'controlType':'',
        'workCenter':'',
        'mold':'',
        'user':'',
        'dateTime':'',
        'comment':'',
        'numbers':''


    };
}]).
factory('QRScanService', [function () {

    return {
        scan: function(success, fail) {
            if(window.cordova && window.cordova.plugins.barcodeScanner){
                window.cordova.plugins.barcodeScanner.scan(
                    function (result) { success(result); },
                    function (error) { fail(error); }
                );
            }else{
                fail("Camera isn't initialized. Enter data manualy");
            }

        }
    };

}])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
//.state('tab', {
//    url: "/tab",
//    abstract: true,
//    templateUrl: "templates/tabs.html"
//  })
//
  // Each tab has its own nav history stack:
  .state('home', {
      url: '/home',
      templateUrl: 'templates/retalLab-home.html',
      controller: 'RetalLabHomeCtrl'
  })
  .state('scan', {
      url: '/scan',
      templateUrl: 'templates/retalLab-scan.html',
      controller: 'RetalLabScanerCtrl'
  })
  .state('numbers', {
      url: '/numbers',
      templateUrl: 'templates/retalLab-numbers.html',
      controller: 'RetalLabNumbersCtrl'
  })
  .state('comment', {
      url: '/comment',
      templateUrl: 'templates/retalLab-comment.html',
      controller: 'DashCtrl'
  })
  .state('defect', {
      url: '/defect',
      templateUrl: 'templates/retalLab-defect.html',
      controller: 'DashCtrl'
  })
    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});
