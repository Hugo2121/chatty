let app = angular.module('chatty');

app.directive('panel', [
  'RoomManager',
  (RoomManager) => {

    const ENTER_KEY_CODE = 13;

    return {
      controller: [
        '$scope',
        ($scope) => {
          let controller = {};

          controller.sendMessage = (message) => {
            if (!message) {
              return;
            }

            RoomManager.send(message);
            $scope.message = null;
          }

          controller.onKeyPress = (message, event) => {
            if (event.keyCode == ENTER_KEY_CODE) {
              controller.sendMessage(message);
            }
          }

          controller.setup = () => {
            $scope.messages = [];
            $scope.attr = {};
            $scope.attr.userId = window.Chatty.userId;

            RoomManager.on('message', (payload) => {
              $scope.$apply(() => {
                $scope.messages.push(payload);
              })
            })
          }

          controller.setup()
          return controller;
        }
      ],
      controllerAs: 'panelCtrl',
      templateUrl: '/panel_index.html'
    }
  }
])