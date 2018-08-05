let app = angular.module('chatty')

app.directive('userList', [
  'RoomManager',
  'RoomsResource',
  'FriendsResource',
  (RoomManager, RoomsResource, FriendsResource) => {
    return {
      controller: [
        '$scope',
        ($scope) => {

          let DEFAULT_THEME_COLOR = "#39446e";

          let controller = {};

          controller.setup = () => {
            $scope.roomEncrypted = $scope.room.encrypted
            $scope.activeUsers = RoomManager.getActiveUsers()

            RoomManager.on('presence', (state) => {
              $scope.$apply(()=> {
                $scope.activeUsers = state
              })
            })

            // Use timeout to push call to end of the rendering stack
            setTimeout(() => {
              $("#colorPicker").spectrum({
                showPaletteOnly: true,
                showPalette: true,
                color: $scope.room.color || DEFAULT_THEME_COLOR,
                palette: [
                  ['black', 'white', 'blanchedalmond', 'rgb(255, 128, 0);', 'hsv 100 70 50'],
                  ['red', 'yellow', 'green', 'blue', 'violet']
                ]
              })
            })
          }

          controller.onSetRoomColor = (room) => {
            let roomAttr = {
              room_id: $scope.room.roomId,
              color: room.color
            }

            RoomsResource.save(roomAttr)
          }

          controller.onSetEncryption = (encrypted) => {
            let room = {
              encrypted: encrypted,
              room_id: $scope.room.roomId
            }

            RoomsResource.save(room).$promise.then((room) => {
              RoomManager.onEncryptedChange($scope, room)
            }, () => {
              $scope.roomEncrypted = false
            })
          }

          controller.addFriend = (user) => {
            FriendsResource.save({ friend_id: user.user_id }).$promise
          }

          controller.setup()
          return controller
        }
      ],
      templateUrl: '/user_lists_index.html',
      controllerAs: 'userCtrl'
    }
  }
])
