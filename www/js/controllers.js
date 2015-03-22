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
.controller('RetalLabNumbersCtrl', function($scope, $state) {
        var MAX_COUNT_PREFORMS_ON_MOLD = 96;
        $scope.numbersList = [];
        for(var i = 1; i <= MAX_COUNT_PREFORMS_ON_MOLD; i++){
            $scope.numbersList.push({ text: i.toString(), checked: false })
        }

        $scope.onClickNext = function(){
            $state.go('comment')
        };

        $scope.getSelectedNumbers = function(numbersList){

            return numbersList
                .filter(function(element, index, array){
                    return element.checked;
                })
                .reduce(function(previousValue, currentValue, index, array){
                    return previousValue + currentValue.text + ';';
                }, "");

        }

})
.controller('RetalLabScanerCtrl',
['QRScanService', '$ionicPopup', '$ionicModal','$scope','CurentData', '$state',
    function (QRScanService, $ionicPopup, $ionicModal, $scope, CurentData, $state) {

       $scope.curentData = CurentData;
       $scope.isDebugMode = ! window.cordova;
       scanIt();

        $scope.onClickSuccess = function(){
            $state.go('home')
        };

        $scope.onClickDefect = function(){
            $state.go('defect')
        };

        $scope.decodeRawQRText = function decodeRawQRText(QRCodeResult) {
            var qrObj = {};
            $scope.curentData.workCenter = "";
            $scope.curentData.mold = "";
            try {
                qrObj = JSON.parse(QRCodeResult);
            } catch (err) {
                qrObj = {};
            }
            if(qrObj.workCenter){
                $scope.curentData.workCenter = qrObj.workCenter;
            }
            if(qrObj.mold){
                $scope.curentData.mold = qrObj.mold;
            }
        };
        function scanIt() {
            if ($scope.isDebugMode){
                $scope.QRCodeResult = '{"workCenter":"M15", "mold":"PET123321"}';
                $scope.scannerError = "Debug mode enabled";
            }else{
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
                        $scope.QRCodeResult = result.text;
                        $scope.decodeRawQRText($scope.QRCodeResult);
                    }
                }, function (error) {
                    $scope.QRCodeResult = "";
                    $scope.scannerError = error;
                });
            }

        };

    }])

;

