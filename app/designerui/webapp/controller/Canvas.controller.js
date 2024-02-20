sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("designerui.controller.HomePage", {
            onInit: function () {
                    this.fetchContainers();
            },
            fetchContainers: function()
            {

                var aContainerNames = {
                    "containers": [
                        { "name": "VBox" },
                        { "name": "HBox" },
                        { "name": "FlexBox" },
                        { "name": "Grid" },
                        { "name": "Form" }
                    ]
                };
            
                var oModel = new JSONModel(aContainerNames);
                this.getView().setModel(oModel);

            },
            onTreeSelectionChange : function(oEvent) {

        }
            
         
        });
    });
