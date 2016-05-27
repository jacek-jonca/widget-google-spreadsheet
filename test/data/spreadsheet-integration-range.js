(function(window) {

  "use strict";

  window.gadget = window.gadget || {};

  window.gadget.settings = {
    "params": {},
    additionalParams: {
      format: {
        body: {
          fontStyle:{
            font:{
              family:"verdana,geneva,sans-serif",
              type:"standard",
              url:""
            },
            size:"18px",
            customSize:"",
            align:"left",
            bold:false,
            italic:false,
            underline:false,
            forecolor:"black",
            backcolor:"transparent"
          }
        },
        evenRowColor: "rgb(246, 247, 248)",
        header: {
          fontStyle:{
            font:{
              family:"verdana,geneva,sans-serif",
              type:"standard",
              url:""
            },
            size:"18px",
            customSize:"",
            align:"left",
            bold:false,
            italic:false,
            underline:false,
            forecolor:"black",
            backcolor:"transparent"
          }
        },
        oddRowColor: "rgb(255, 255, 255)"
      },
      scroll: {},
      spreadsheet: {
        selection: "drive",
        docName: "",
        url: "",
        fileId: "xxxxxxxxxx",
        cells: "range",
        range: {
          startCell: "B2",
          endCell: "C3"
        },
        tabId: 1,
        hasHeader: false,
        refresh: 5
      }
    }
  };

  window.innerWidth = 600;
  window.innerHeight = 400;

})(window);
