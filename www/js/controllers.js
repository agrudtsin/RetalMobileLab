angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('RetalLabHomeCtrl', function($scope) {

})
.controller('RetalLabScanerCtrl',
['QRScanService', '$ionicPopup', '$ionicModal',
    function (QRScanService, $ionicPopup, $ionicModal) {

        //this.scanIt = function () {
        QRScanService.scan(function (result) {
            if (result.cancelled) {
                // this is a super hack. When QR scan gets cancelled by
                // clicking the back button on android, the app quits...
                // doing a blank modal to catch the back button press event
                $ionicModal.fromTemplate('').show().then(function () {
                    $ionicPopup.alert({
                        title: 'QR Scan Cancelled',
                        template: 'You cancelled it!'
                    });
                });
            } else {
                $ionicPopup.alert({
                    template: 'Result: ' + result.text
                });
            }
        }, function (error) {
            $ionicPopup.alert({
                title: 'Unable to scan the QR code',
                template: 'Too bad, something went wrong.'
            });
        });
        //};

    }])

;

