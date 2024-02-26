


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
            onAddLayoutPress: function (oEvent) {

                var oButton = oEvent.getSource();
                var oPopover = this.getView().byId("layoutPopOver");



                oPopover.openBy(oButton);

              
             
            },
            onTree: function()
            {
                const oRouter = this.getOwnerComponent().getRouter();
			    oRouter.navTo("newTree");
            },
            onSavingLayout: function()
            {
                var user = this.getView().byId("layoutIDforSavingDatbase");
                var value=user.getValue();
               
                console.log(value);
                const oRouter = this.getOwnerComponent().getRouter();
		
                var data={
                    
                    "layout_name":value
                    
                };
                var url='https://port4004-workspaces-ws-6pbtq.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Layout';
                $.ajax(
                    {
                        url :url,
                        method: 'post',
                        contentType: 'application/json',
                        data: JSON.stringify(data), 
                        success : function(res)
                        {
                            console.log(res);
                            oRouter.navTo("newLayout");
                            
                        },
                        error: function(er)
                        {
                            console.log(er);
                        }


                    }
                )
            }
        });
    });
