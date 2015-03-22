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
factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]).
service('CurrentData',['DataSet',function(DataSet){
    var obj = {
        'data':{},
        'storeData':storeData
    };
    obj.data = getClearDataObj();
    return obj;

    function storeData(){
        DataSet.storeData(this.data);
        this.data.date = new Date();
        this.data = getClearDataObj();
    }

    function getClearDataObj(){
        return {
            'controlType': 'Visual control',
            'workCenter': '',
            'mold': '',
            'date': '',
            'comment': '',
            'numbers': '',
            'defect': '',
            'factory': 'Retal Dnepr',
            'user': 'Operator 1'
        }
    }
}]).

service('DataSet',['$localstorage',function($localstorage){
        var obj =  {
            'unSyncData':[],
            'storeData':storeData,
            'sync':syncDemo
        };
        obj.unSyncData = $localstorage.getObject('RetalMobileLab.unSyncData');
        if(! angular.isArray(obj.unSyncData)){
            obj.unSyncData = [];
        }
        return obj;

        function syncDemo(){
            this.unSyncData = [];
            $localstorage.setObject('RetalMobileLab.unSyncData', this.unSyncData);
        }

        function storeData(dataObj){
            this.unSyncData.push(dataObj);
            if(!!window.localStorage){
                $localstorage.setObject('RetalMobileLab.unSyncData', this.unSyncData);
                console.log('Data stored', dataObj);
            }
        }
}]).
factory('QRScanService', [function () {

    return {
        scan: function(success, fail) {
            /** @namespace window.cordova.plugins.barcodeScanner */
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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  //Disable controllers cashing because storing data in services
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider
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
      controller: 'RetalLabCommentCtrl'
  })
  .state('defect', {
      url: '/defect',
      templateUrl: 'templates/retalLab-defect.html',
      controller: 'RetalLabDefectCtrl'
  })
    .state('sync', {
        url: '/sync',
        templateUrl: 'templates/retalLab-sync.html',
        controller: 'RetalLabSyncCtrl'
    });
    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');

});
