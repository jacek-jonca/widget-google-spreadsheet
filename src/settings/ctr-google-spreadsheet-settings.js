angular.module("risevision.widget.googleSpreadsheet.settings")
  .controller("spreadsheetSettingsController", ["$scope", "$window", "$log", "googleSheet", "columns",
    function ($scope, $window, $log, googleSheet, columns) {

      $scope.showPreview = false;
      $scope.sheets = [];
      $scope.currentSheet = null;
      $scope.columns = [];

      $scope.getColumns = function (url) {
        columns.getColumns(url)
          .then(function (columns) {
            if (columns.length > 0) {
              $scope.columns = columns;
            }
          })
          .then(null, $log.error);
      };

      function getWorkSheets(fileId) {
        googleSheet.getWorkSheets(fileId)
          .then(function (sheets) {
            $log.debug("Worksheets", sheets);
            $scope.published = true;
            $scope.sheets = sheets;
            $scope.currentSheet = sheets[$scope.settings.additionalParams.spreadsheet.tabId - 1];
          })
          .then(null, function () {
            $scope.published = false;
            $scope.sheets = [];
            $scope.currentSheet = null;
            $scope.settings.additionalParams.spreadsheet.tabId = 1;
          });
      }

      $scope.$watch("currentSheet", function (currentSheet) {
        if (currentSheet) {
          $scope.settings.additionalParams.spreadsheet.tabId = currentSheet.value;
        }
      });

      $scope.published = true;

      $scope.$watch("settings.additionalParams.spreadsheet.fileId", function (fileId) {
        if (typeof fileId === "undefined" || !fileId) {
          $scope.settingsForm.$setValidity("fileId", false);
        }
        else {
          $scope.showPreview = true;
          $scope.settingsForm.$setValidity("fileId", true);

          if ($scope.settings.additionalParams.spreadsheet.selection === "key") {
            $scope.settings.additionalParams.spreadsheet.url =
              "https://docs.google.com/spreadsheets/d/" + fileId + "/edit#gid=0";
          }

          getWorkSheets(fileId);
        }
      });

      $scope.$watch("settings.additionalParams.spreadsheet.url", function (newUrl, oldUrl) {
        if (typeof newUrl !== "undefined") {
          if (newUrl !== oldUrl) {
            $scope.columns = [];

            if (typeof oldUrl !== "undefined" && oldUrl !== "") {
              // Widget settings have already gone through initialization. Safe to reset columns array.
              $scope.settings.additionalParams.format.columns = [];
            }

            if (newUrl !== "") {
              $scope.getColumns(newUrl);
            }
          }
        }
      });

      $scope.$watch("published", function (value) {
        if (typeof value !== "undefined" && $scope.settings.additionalParams.spreadsheet &&
          $scope.settings.additionalParams.spreadsheet.fileId &&
          $scope.settings.additionalParams.spreadsheet.fileId !== "") {
          $scope.settingsForm.$setValidity("fileId", value);
        }
      });

      $scope.$on("picked", function (event, data) {
        $scope.showPreview = true;
        $scope.settings.additionalParams.spreadsheet.selection = "drive";
        $scope.settings.additionalParams.spreadsheet.docName = data[0].name;
        $scope.settings.additionalParams.spreadsheet.url = encodeURI(data[0].url);
        $scope.settings.additionalParams.spreadsheet.fileId = data[0].id;
      });

      $scope.setSelection = function() {
        $scope.showPreview = true;
        $scope.settings.additionalParams.spreadsheet.selection = "key";
      };

      $scope.previewFile = function () {
        $window.open($scope.settings.additionalParams.spreadsheet.url, "_blank");
      };

      $scope.retryFile = function () {
        if ($scope.settings.additionalParams.spreadsheet.fileId &&
          $scope.settings.additionalParams.spreadsheet.fileId !== "") {
          $scope.published = true;
          getWorkSheets($scope.settings.additionalParams.spreadsheet.fileId);
        }
      };

      $scope.clearSelection = function () {
        $scope.published = true;

        if ($scope.settings.additionalParams.spreadsheet.selection === "drive") {
          $scope.settings.additionalParams.spreadsheet.docName = "";
        }

        $scope.settings.additionalParams.spreadsheet.url = "";
        $scope.settings.additionalParams.spreadsheet.fileId = "";
      };

    }])
  .value("defaultSettings", {
    params: {},
    additionalParams: {
      format: {
        body: {
          fontStyle:{
            font:{
              family:"tahoma,arial,helvetica,sans-serif",
              type:"standard",
              url:""
            },
            size:"18px",
            customSize:"",
            align:"left",
            verticalAlign: "middle",
            bold:false,
            italic:false,
            underline:false,
            forecolor:"black",
            backcolor:"transparent"
          }
        },
        columns: [],
        evenRowColor: "rgba(255, 255, 255, 0)",
        header: {
          fontStyle:{
            font:{
              family:"tahoma,arial,helvetica,sans-serif",
              type:"standard",
              url:""
            },
            size:"18px",
            customSize:"",
            align:"left",
            verticalAlign: "middle",
            bold:false,
            italic:false,
            underline:false,
            forecolor:"black",
            backcolor:"transparent"
          }
        },
        oddRowColor: "rgba(255, 255, 255, 0)",
        rowHeight: 50
      },
      scroll: {},
      spreadsheet: {
        selection: "drive",
        docName: "",
        url: "",
        fileId: "",
        cells: "sheet",
        range: {
          startCell: "",
          endCell: ""
        },
        tabId: 1,
        hasHeader: false,
        refresh: 5
      }
    }
  });
