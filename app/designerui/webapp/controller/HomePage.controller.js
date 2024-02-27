


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
            onLayoutPress: function (oEvent) {
                const oRouter = this.getOwnerComponent().getRouter();
                var getID = oEvent.oSource.getProperty('info');
                 // Replace with your layout ID
                var url = "https://port4004-workspaces-ws-6pbtq.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Layout(" + getID + ")?$expand=controls($expand=controlProperties)";

                $.ajax({
                    url: url,
                    method: 'GET',
                    success: function (data) {
                        // Handle the successful response and work with the data
                        console.log("Data:")
                        var controlData=data.controls;
                        console.log(controlData);
                        
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        // Handle the error
                        console.error("Error:", errorThrown);
                    }
                });


                oRouter.navTo("newLayout", {
                    id: getID
                });

            },

            onAddLayoutPress: function (oEvent) {

                var oButton = oEvent.getSource();
                var oPopover = this.getView().byId("layoutPopOver");



                oPopover.openBy(oButton);



            },
            // onTree: function()
            // {
            //     const oRouter = this.getOwnerComponent().getRouter();
            //     oRouter.navTo("newTree");
            // },
            onSavingLayout: function (oEvent) {
                var that = this;
                var user = this.getView().byId("layoutIDforSavingDatbase");
                var value = user.getValue();

                console.log(value);
                const oRouter = this.getOwnerComponent().getRouter();
                var layout_id = that.generateUUID();


                var data = {

                    "layout_name": value

                };
                var url = 'https://port4004-workspaces-ws-6pbtq.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Layout';
                $.ajax(
                    {
                        url: url,
                        method: 'post',
                        contentType: 'application/json',
                        data: JSON.stringify(data),
                        success: function (res) {
                            console.log(res);
                            oRouter.navTo("newLayout", {
                                id: res.layout_id
                            });

                        },
                        error: function (er) {
                            console.log(er);
                        }


                    }
                )
            },
            generateUUID: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
        });
    });
