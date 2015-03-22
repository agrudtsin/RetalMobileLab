angular.module('starter.controllers', [])
.controller('RetalLabHomeCtrl', function($scope, $ionicHistory, CurrentData) {
        $ionicHistory.clearHistory();
        $scope.currentData = CurrentData.data;
})
.controller('RetalLabDefectCtrl', function($scope, CurrentData, $state) {
        $scope.currentData = CurrentData.data;
        $scope.currentData.defect = "";
        $scope.defects = [];

        for(var i=1; i<=150; i+=1){
            $scope.defects.push(
                {'text':'Defect '+ i.toString()}
            )
        };
        $scope.onClickNext = function(){
            $state.go('numbers')
        };

})
.controller('RetalLabCommentCtrl', function($scope,$state, CurrentData) {
    $scope.currentData = CurrentData.data;
    $scope.currentData.comment = "";
    $scope.onClickNext = function(){
        $state.go('home');
        CurrentData.storeData();
    };
})
.controller('RetalLabNumbersCtrl', function($scope, $state, CurrentData) {
        var MAX_COUNT_PREFORMS_ON_MOLD = 96;
        $scope.numbersList = [];
        for(var i = 1; i <= MAX_COUNT_PREFORMS_ON_MOLD; i++){
            $scope.numbersList.push({ text: i.toString(), checked: false })
        }

        $scope.onClickNext = function(){
            $state.go('comment')
        };

        $scope.getSelectedNumbers = function(numbersList){

            CurrentData.data.numbers =
                numbersList.filter(function(element, index, array){
                    return element.checked;
                })
                .reduce(function(previousValue, currentValue, index, array){
                    return previousValue + currentValue.text + ';';
                }, "");
            return CurrentData.data.numbers;

        }

})

.controller('RetalLabScanerCtrl',
['QRScanService', '$ionicPopup', '$ionicModal','$scope','CurrentData', '$state',
    function (QRScanService, $ionicPopup, $ionicModal, $scope, CurrentData, $state) {

       console.log('RetalLabScanerCtrl', "New ctrl init");

       $scope.currentData = CurrentData.data;
       $scope.currentData.mold = "";
       $scope.currentData.workCenter = "";
       $scope.isDebugMode = ! window.cordova;
       scanIt();

        $scope.onClickSuccess = function(){
            $state.go('home');
            CurrentData.storeData();
        };

        $scope.onClickDefect = function(){
            $state.go('defect')
        };

        $scope.decodeRawQRText = function decodeRawQRText(QRCodeResult) {
            var qrObj = {};
            $scope.currentData.workCenter = "";
            $scope.currentData.mold = "";
            try {
                qrObj = JSON.parse(QRCodeResult);
            } catch (err) {
                qrObj = {};
            }
            if(qrObj.workCenter){
                $scope.currentData.workCenter = qrObj.workCenter;
            }
            if(qrObj.mold){
                $scope.currentData.mold = qrObj.mold;
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

