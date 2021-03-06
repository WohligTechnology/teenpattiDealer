var updateSocketFunction;

angular
  .module("starter.controllers", [])

  .controller("AppCtrl", function($scope, $ionicModal, $timeout) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal
      .fromTemplateUrl("templates/login.html", {
        scope: $scope
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function() {
        $scope.closeLogin();
      }, 1000);
    };
  })

  .controller("HomeCtrl", function($scope, $stateParams, $ionicPopup, $state) {
    $scope.youlose = function() {
      $ionicPopup.alert({
        cssClass: "removedpopup",
        title: "Sorry",
        template: "You Lose",
        buttons: [
          {
            text: "OK",
            // cssClass: 'leaveApp',
            onTap: function(e) {}
          }
        ]
      });
    };

    $scope.youwin = function() {
      $ionicPopup.alert({
        cssClass: "removedpopup",
        title: "Hurray",
        template: "You Won",
        buttons: [
          {
            text: "OK",
            // cssClass: 'leaveApp',
            onTap: function(e) {}
          }
        ]
      });
    };

    $scope.fold = function() {
      $ionicPopup.alert({
        cssClass: "removedpopup",
        title: "Fold",
        template: "Your cards are folded",
        buttons: [
          {
            text: "OK",
            // cssClass: 'leaveApp',
            onTap: function(e) {}
          }
        ]
      });
    };
  })

  .controller("DealerCtrl", function(
    $scope,
    $stateParams,
    apiService,
    $state,
    $timeout,
    $ionicModal
  ) {
    io.socket.on("ShowWinner", function(data) {});
    $scope.randomCard = function() {
      $scope.promiseRandomCard = apiService.randomCard();
    };
    $scope.playingPlayers = function() {
      var players = _.flatten($scope.playersChunk);
      return _.filter(players, function(player) {
        return player.isActive && !player.isFold;
      });
    };

    updateSocketFunction = function(data) {
      $scope.turnPlayer = _.find(data.playerCards, function(player) {
        return player.isTurn;
      });
      //cardServed
      $scope.cardServed = data.cardServed;
      $scope.communityCards = data.communityCards;
      $scope.gameType = data.currentGameType;
      $scope.playersChunk = _.chunk(data.playerCards, 8);
      $scope.extra = data.extra;
      $scope.hasTurn = data.hasTurn;
      $scope.isCheck = data.isCheck;
      $scope.showWinner = data.showWinner;
      $scope.activePlayers = function() {
        var players = _.flatten($scope.playersChunk);
        return _.filter(players, function(player) {
          return player.isActive;
        });
      };
      console.log($scope.players);
      $scope.activePlayers();
      $scope.playingPlayersAll = $scope.playingPlayers();
      console.log($scope.playingPlayersAll, "Playing");
      if ($scope.playingPlayersAll.length == 1) {
        $state.go("winner");
      }
      // console.log("data making",data)
      $scope.$apply();
      $scope.modal3.hide();
      $scope.modal4.hide();
    };

    io.socket.on("Update", updateSocketFunction);

    // $scope.pageChange = function () {};

    $scope.updatePlayers = function() {
      apiService.getAll(function(data) {
        // check whether dealer is selected or not
        var dealerIndex = _.findIndex(data.data.data.playerCards, function(
          player
        ) {
          return player.isDealer;
        });
        $scope.turnPlayer = _.find(data.data.data.playerCards, function(
          player
        ) {
          return player.isTurn;
        });
        if (dealerIndex < 0) {
          // $scope.noDealer = true;
          $state.go("table");
        }

        $scope.communityCards = data.data.data.communityCards;
        $scope.cardServed = data.data.data.cardServed;
        $scope.gameType = data.data.data.currentGameType;
        $scope.playersChunk = _.chunk(data.data.data.playerCards, 8);
        $scope.hasTurn = data.data.data.hasTurn;
        $scope.isCheck = data.data.data.isCheck;
        $scope.showWinner = data.data.data.showWinner;
        $scope.activePlayers = function() {
          var players = _.flatten($scope.playersChunk);
          return _.filter(players, function(player) {
            return player.isActive;
          });
        };
        $scope.activePlayers();
        $scope.playingPlayersAll = $scope.playingPlayers();
        console.log($scope.playingPlayersAll, "Playing");
        if ($scope.playingPlayersAll.length == 1) {
          $state.go("winner");
        }
      });
    };

    $scope.openJokerCard = function() {
      $scope.promiseBtnapi = apiService.enableOneZanduCard(function(data) {
        $scope.gameType.jokerCards = data.data.data;
      });
    };
    $scope.openJokerCardFlipper = function() {
      $scope.promiseBtnapi = apiService.enableOneFlipperCard(function(data) {
        $scope.gameType.jokerCards = data.data.data;
      });
    };

    $scope.showJokerCards = function() {
      apiService.enableOneZanduCard(function(data) {
        $scope.gameType.jokerCards = data.data.data;
      });
    };

    $scope.updatePlayers();
    $scope.showCards = function() {
      apiService.revealCards(function(data) {});
    };

    io.socket.on("sideShow", function(data) {
      $scope.modal3.show();
      $scope.message = {
        content:
          "Side show has been requested from Player-" +
          data.data.fromPlayer.playerNo +
          " to Player-" +
          data.data.toPlayer.playerNo,
        color: "color-balanced"
      };
      $timeout(function() {
        $scope.modal3.hide();
      }, 1000);
      $timeout(function() {
        $scope.modal4.show();
      }, 1000);
    });

    $scope.confirmModalOkConfirm = function() {
      var players = _.flatten($scope.playersChunk);
      var player1 = _.chain(players)
        .filter(function(player) {
          return player.isTurn;
        })
        .map("playerNo")
        .value();
      var player2 = _.chain(players)
        .filter(function(player) {
          return player.showWinner && !player.isTurn;
        })
        .map("playerNo")
        .value();
      apiService.doSideShow(player1, player2, function(data) {});
    };
    $scope.confirmModalOkConfirmForShow = function(player1, player2) {
      var players = _.flatten($scope.playersChunk);
      var playerNos = _.chain(players)
        .filter(function(player) {
          return player.showWinner || player.isTurn;
        })
        .map("playerNo")
        .value();
      if ($scope.playingPlayers().length > 2) {
        $state.go("winners", { winner1: playerNos[0], winner2: playerNos[1] });
      } else {
        $state.go("winner", { winner1: playerNos[0], winner2: playerNos[1] });
      }
    };

    $scope.cancelSideShow = function() {
      $scope.player.isTurn = true;
      apiService.cancelSideShow(function(data) {});
    };

    io.socket.on("sideShowCancel", function(data) {
      $scope.modal3.show();
      $scope.message = {
        content: "Side show has been denied !!",
        color: "color-assertive"
      };
      $timeout(function() {
        $scope.modal3.hide();
      }, 2000);
    });

    $ionicModal
      .fromTemplateUrl("templates/modal/side-show.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal4 = modal;
      });

    $ionicModal
      .fromTemplateUrl("templates/modal/side-show-select.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal5 = modal;
      });

    $ionicModal
      .fromTemplateUrl("templates/modal/winner-select.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal6 = modal;
      });

    $ionicModal
      .fromTemplateUrl("templates/modal/toastr.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal3 = modal;
      });

    var count = 0;
    var counter = 0;
    $scope.selected = "0-0";
    $scope.currentPlayer = 0;

    // Modal Actions
    $ionicModal
      .fromTemplateUrl("templates/modal/sure.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    $scope.cancelSideShow = function() {
      apiService.cancelSideShow(function(data) {});
    };

    $scope.confirmModalClose = function() {
      $scope.modal.hide();
      $scope.modal4.hide();
      $scope.modal5.hide();
    };
    $scope.sideshowSelectModalClose = function() {
      $scope.modal5.hide();
    };

    $scope.showConfirmationModal = function(value) {
      switch (value) {
        case "sideShow":
          $scope.confirmModalOk = $scope.sideShow;
          $scope.modelActionFor = "Side Show";
          break;
        case "fold":
          $scope.confirmModalOk = $scope.fold;
          $scope.modelActionFor = "Fold";
          break;
        case "newGame":
          $scope.confirmModalOk = $scope.newGame;
          $scope.modelActionFor = "Start New Game";
          break;
        case "undo":
          $scope.confirmModalOk = $scope.undo;
          $scope.modelActionFor = "Undo";
          break;
        case "showWinner":
          $scope.confirmModalOk = $scope.showWinnerPlayer;
          $scope.modelActionFor = "Show";
          break;
        case "openJokerCard":
          $scope.confirmModalOk = $scope.openJokerCard;
          $scope.modelActionFor = "Open Joker Card";
          break;
        case "openJokerCardFlipper":
          $scope.confirmModalOk = $scope.openJokerCardFlipper;
          $scope.modelActionFor = "Open Joker Card";
          break;
      }
      $scope.modal.show();
    };
    //winner selesct Modal
    $scope.winnerSelectModal = function() {
      $scope.modal6.show();
    };
    $scope.winnerSelectModalClose = function() {
      $scope.modal6.hide();
    };
    // Turn Actions
    $scope.allIn = function() {
      apiService.allIn(function(data) {});
    };
    $scope.fold = function() {
      let data = {};
      data.playerNo = $scope.turnPlayer.playerNo;
      $scope.promiseBtnapi = apiService.fold(data, function(data) {
        if (data.data == "Not your turn") {
          console.log("Not your turn", data);
        } else {
          console.log("Packed sucessfully");
        }
      });
    };

    $scope.sideShow = function() {
      $scope.promiseBtnapi = apiService.sideShow(function(data) {});
    };
    $scope.sideShowSelect = function() {
      $scope.modal5.show();
    };

    $scope.makeSeen = function() {
      apiService.makeSeen(function(data) {});
    };

    $scope.move = function() {
      $scope.promiseMovebtn = apiService.move(function(data) {});
    };

    $scope.showWinnerPlayer = function() {
      $state.go("winner");
    };
    // New Game
    $scope.newGame = function() {
      $state.go("table");
    };

    // Undo
    $scope.undo = function() {
      $scope.promiseBtnapi = apiService.undo(function(data) {});
    };

    // Remove Cards
    $scope.removeCard = function(cardNo) {
      apiService.removeCard(cardNo);
    };
    $scope.showRemove = function(cardNo) {
      if ($scope.communityCards && $scope.communityCards.length == 8) {
        if (cardNo === 0) {
          if (
            $scope.communityCards[0].cardValue !== "" &&
            $scope.communityCards[4].cardValue === ""
          ) {
            return true;
          }
        } else if (cardNo === 4) {
          if (
            $scope.communityCards[4].cardValue !== "" &&
            $scope.communityCards[6].cardValue === ""
          ) {
            return true;
          }
        } else if (cardNo === 6) {
          if ($scope.communityCards[6].cardValue !== "") {
            return true;
          }
        }
      }
    };
    $scope.turnPlayer = function() {
      var player = _.flatten($scope.playersChunk);
      return _.find(players, function(player) {
        return player.isTurn;
      });
    };

    $scope.sideShowPlayers = function() {
      var players = _.flatten($scope.playersChunk);
      return _.filter(players, function(player) {
        return player.isActive && !player.isTurn;
      });
    };
    $scope.sideShowObj = { player: null };

    $scope.numberOfWinnerSelected = function() {
      var players = _.flatten($scope.playersChunk);
      return _.filter(players, function(player) {
        return player.showWinner || player.isTurn;
      }).length;
    };
  })

  .controller("TableCtrl", function(
    $scope,
    $stateParams,
    apiService,
    $state,
    $ionicPopup
  ) {
    $scope.dealer = { dealerPlayer: null };
    $scope.jokerText = "Joker enabling amount";
    io.socket.off("Update", updateSocketFunction);
    $scope.newGame = function() {
      $scope.winnerData = {};
      $scope.promiseBtnapi = apiService.newGame(function(data) {
        $scope.updatePlayers();
      });
    };

    $scope.makeGameType = function(data) {
      apiService.makeGameType(data, function() {});
    };

    $scope.newGame();

    $scope.updatePlayers = function() {
      apiService.getAll(function(data) {
        $scope.allPlayers = data.data.data.playerCards;
        $scope.playersChunk = _.chunk(data.data.data.playerCards, 8);
        _.each($scope.allPlayers, function(n) {
          if (n.isDealer) {
            $scope.dealer.dealerPlayer = n.playerNo;
          }
        });
      });
    };

    $scope.makeDealer = function(tabId) {
      apiService.makeDealer(
        {
          tabId: tabId,
          isStraddle: $scope.form.isStraddle && $scope.activePlayers() > 2
        },
        function(data) {
          $state.go("dealer");
        }
      );
    };

    $scope.activePlayers = function() {
      var players = _.flatten($scope.playersChunk);
      return _.filter(players, function(player) {
        return player.isActive;
      });
    };
    $scope.playingPlayers = function() {
      var players = _.flatten($scope.playersChunk);
      return _.filter(players, function(player) {
        return player.isActive && !player.isFold;
      });
    };

    $scope.isDealerPlayerInActive = function(dealerPlayer) {
      var players = _.flatten($scope.playersChunk);
      var dealerPlayerIndex = _.findIndex(players, function(player) {
        return player.isActive && player.playerNo == dealerPlayer;
      });
      if (dealerPlayerIndex >= 0) {
        return true;
      } else {
        return false;
      }
    };
    $scope.form = {
      isStraddle: false
    };

    apiService.getZanduCardEnablingAmount(function(data) {
      $scope.jokerAmount = data.data.data;
    });
    apiService.getFlipperCardEnablingAmount(function(data) {
      $scope.jokerAmountFlipper = data.data.data;
    });

    $scope.saveJokerAmount = function(data) {
      apiService.saveZanduCardEnablingAmount(data, function(err, data) {
        if (data) $scope.jokerAmount = data.data.data;
        if (err) {
          $ionicPopup.alert({
            title: "Error",
            template: "Please check the amount you have entered"
          });
        }
      });
    };
    $scope.saveJokerAmountFlipper = function(data) {
      apiService.saveFlipperCardEnablingAmount(data, function(err, data) {
        if (data) $scope.jokerAmount = data.data.data;
        if (err) {
          $ionicPopup.alert({
            title: "Error",
            template: "Please check the amount you have entered"
          });
        }
      });
    };

    //Settings
    apiService.getSettings(function(data) {
      $scope.settings = data.data.results;
    });
    apiService.getGameType(function(data) {
      $scope.gameType = data.data.results;

      var gameSelected = _.find($scope.gameType, function(data) {
        return data.currentType;
      });
      $scope.gameSelected = gameSelected._id;
    });
    $scope.storeSetting = function(data) {
      apiService.storeSettings($scope.settings, function() {});
      var fData = {};
      fData._id = data;
      apiService.makeGameType(fData, function() {});
    };
    $scope.settingShow = false;
    $scope.toggleSettingShow = function() {
      $scope.settingShow = !$scope.settingShow;
    };
    $scope.form.adminurl = apiService.getAdminUrl();
    $scope.saveAdminUrl = function() {
      apiService.saveAdminUrl($scope.form.adminurl);
      window.location.href = window.location.href.split("#")[0];
    };
  })

  .controller("WinnerCtrl", function($scope, $stateParams, apiService) {
    if ($stateParams.winner1 && $stateParams.winner2) {
      $scope.isTwoWinner = true;
    }
    io.socket.off("Update", updateSocketFunction);
    $scope.showWinner = function() {
      apiService.showWinner(
        function(data) {
          $scope.players = data.data.data.winners;
          $scope.gameType = data.data.data.gameType;
          $scope.winners = _.filter($scope.players, function(player) {
            return player.winner;
          });

          $scope.winnerString = _.join(
            _.map($scope.winners, function(n) {
              return "Player " + n.playerNo;
            }),
            " & "
          );
        },
        $stateParams.winner1,
        $stateParams.winner2
      );
    };
    $scope.showWinner();
  });
