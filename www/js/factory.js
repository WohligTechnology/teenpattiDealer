myApp = angular.module("starter");

myApp.factory("apiService", function($http, $q, $timeout) {
  return {
    // This is a demo Service for POST Method.
    callApiWithData: function(url, data, callback) {
      $http.post(adminurl + url, data).then(function(data) {
        callback(data);
      });
    },
    revealCards: function(callback) {
      $http.post(adminurl + "Player/revealCards").then(function(data) {
        callback(data);
      });
    },
    getAll: function(callback) {
      $http.post(adminurl + "Player/getAll").then(function(data) {
        callback(data);
      });
    },
    newGame: function(callback) {
      $http.post(adminurl + "Player/newGame").then(function(data) {
        callback(data);
      });
    },
    move: function(callback) {
      $http.post(adminurl + "Player/moveTurn").then(function(data) {
        callback(data);
      });
    },
    fold: function(data, callback) {
      $http.post(adminurl + "Player/fold", data).then(function(data) {
        callback(data);
      });
    },
    addTab: function(data, callback) {
      $http.post(adminurl + "Player/addTab", data).then(function(data) {
        callback(data);
      });
    },
    makeDealer: function(data, callback) {
      $http.post(adminurl + "Player/makeDealer", data).then(function(data) {
        callback(data);
      });
    },
    removeTab: function(data, callback) {
      $http.post(adminurl + "Player/removeTab", data).then(function(data) {
        callback(data);
      });
    },
    showWinner: function(callback, winner1, winner2) {
      $http
        .post(adminurl + "Player/showWinner", { playerNos: [winner1, winner2] })
        .then(function(data) {
          callback(data);
        });
    },
    allIn: function(callback) {
      $http.post(adminurl + "Player/allIn").then(function(data) {
        callback(data);
      });
    },
    raise: function(callback) {
      $http.post(adminurl + "Player/raise").then(function(data) {
        callback(data);
      });
    },
    randomCard: function() {
      var cardValue = cards[_.random(0, cards.length - 3)].name;
      $http
        .post(adminurl + "Player/randomServe", {
          card: cardValue
        })
        .then(function(data) {
          console.log(data.data);
        });
    },
    removeCard: function(cardNo) {
      $http
        .post(adminurl + "CommunityCards/removeCards", {
          cardIndex: cardNo
        })
        .then(function(data) {
          console.log(data.data);
        });
    },
    undo: function(callback) {
      $http.post(adminurl + "GameLogs/undo").then(function(data) {
        console.log(data.data);
      });
    },
    getSettings: function(callback) {
      $http.post(adminurl + "Setting/search", {}).then(function(data) {
        callback(data.data);
      });
    },
    storeSettings: function(data, callback) {
      $http.post(adminurl + "Setting/store", data).then(function(data) {
        callback(data.data);
      });
    },
    makeSeen: function(callback) {
      $http.post(adminurl + "Player/makeSeen", {}).then(function(data) {
        callback(data.data);
      });
    },
    sideShow: function(callback) {
      $http.post(adminurl + "Player/sideShow", {}).then(function(data) {
        callback(data.data);
      });
    },
    getGameType: function(callback) {
      $http.post(adminurl + "GameType/search", {}).then(function(data) {
        callback(data.data);
      });
    },
    makeGameType: function(data, callback) {
      $http
        .post(adminurl + "GameType/makeCurrentType", data)
        .then(function(data) {
          callback(data.data);
        });
    },
    doSideShow: function(player1, player2, callback) {
      $http
        .post(adminurl + "Player/doSideShow", { playerNo: player2 })
        .then(function(data) {
          callback(data);
        });
    },
    cancelSideShow: function(callback) {
      $http.post(adminurl + "Player/cancelSideShow").then(function(data) {
        callback(data);
      });
    },
    saveZanduCardEnablingAmount: function(data, callback) {
      $http.post(adminurl + "GameType/saveZanduCardEnablingAmount", data).then(
        function(data) {
          callback(null, data);
        },
        function(err) {
          callback(err);
        }
      );
    },
    saveFlipperCardEnablingAmount: function(data, callback) {
      $http
        .post(adminurl + "GameType/saveFlipperCardEnablingAmount", data)
        .then(
          function(data) {
            callback(null, data);
          },
          function(err) {
            callback(err);
          }
        );
    },
    getZanduCardEnablingAmount: function(callback) {
      $http
        .get(adminurl + "GameType/getZanduCardEnablingAmount")
        .then(function(data) {
          callback(data);
        });
    },
    getFlipperCardEnablingAmount: function(callback) {
      $http
        .get(adminurl + "GameType/getFlipperCardEnablingAmount")
        .then(function(data) {
          callback(data);
        });
    },
    enableOneZanduCard: function(callback) {
      $http.get(adminurl + "GameType/enableOneZanduCard").then(function(data) {
        callback(data);
      });
    },
    enableOneFlipperCard: function(callback) {
      $http
        .get(adminurl + "GameType/enableOneFlipperCard")
        .then(function(data) {
          callback(data);
        });
    },
    getAdminUrl: function() {
      return $.jStorage.get("adminurl");
    },
    saveAdminUrl: function(adminurl) {
      $.jStorage.set("adminurl", adminurl);
    },
    getTeenPattiRate: function(cards, callback) {
      $http
        .post("http://localhost:3000/TeenPattiOdds/getRates", {
          cards: cards
        })
        .then(function(data) {
          callback(data);
        });
    }
  };
});
myApp.filter("declareWinner", function() {
  return function(input, data) {
    if (data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].player == input) {
          return true;
        }
      }
    }
    return false;
  };
});
