sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("designerui.controller.HomePage", {
            onInit: function () {

            },
            onAddLayoutPress: function () {
                const oRouter = this.getOwnerComponent().getRouter();
			    oRouter.navTo("newLayout");
            },
            onTree: function()
            {
                const oRouter = this.getOwnerComponent().getRouter();
			    oRouter.navTo("newTree");
            }
        });
    });
