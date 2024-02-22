sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";



        return Controller.extend("designerui.controller.HomePage", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel({
                    items: [
                    ]  // Initialize with an empty array
                });

                // Set the model to the view
                this.getView().setModel(oModel);

               

            },



            AddContainer: function (oEvent) {

                var oButton = oEvent.getSource();
                var oPopover = this.getView().byId("dropDown");



                oPopover.openBy(oButton);
            },
            onContainerOptionPress: function (oEvent) {

                var sContainerType = oEvent.oSource.mProperties.title
                // console.log(sel);

                var oContainer;

                // Create container based on the selected type
                switch (sContainerType) {
                    case "HBox":
                        oContainer = new sap.m.HBox();
                        break;
                    case "VBox":
                        oContainer = new sap.m.VBox();
                        break;
                     case "Input":
                            // Add an Input control directly
                            oContainer = new sap.m.Input({ placeholder: "Enter text" });
                            break;    
                    // Add cases for other container types as needed
                    // ...
                    default:
                        // Handle unknown container type
                        break;
                }


                // Add the container to the center page
                var oCenterPage = this.getView().byId("designCanvas"); // replace with your actual ID
                oCenterPage.addContent(oContainer);
                console.log("Added");

                // // For displaying in the left side panel
                // var oCustomTreeItem = this.createCustomTreeItem(sContainerType);

                console.log("tree item");
                // console.log(oCustomTreeItem);

                // Get the model and add the new item to the 'items' array
                var oModel = this.getView().getModel();
                var aItems = oModel.getProperty("/items");

                var te = {
                    "text": sContainerType,
                    "ref": "sap-icon://add"
                };
                aItems.push(te);
                console.log("after pushing into the array");
                console.log(aItems);


                oModel.setProperty("/items", aItems);










                this.getView().byId("addContainerPopover").close();
            },
            onChange: function (oEvent) {
                var selectedItemKey = oEvent.getParameter("selectedItem").getKey();
                

                // Close the previously opened popover if it exists
                var oPreviousPopover = this.getView().byId("addContainerPopover");
                var oPreviousPopover1 = this.getView().byId("addControl");
                if (oPreviousPopover && oPreviousPopover.isOpen()) {
                    oPreviousPopover.close();
                }else if((oPreviousPopover1 && oPreviousPopover1.isOpen()))
                {
                    oPreviousPopover1.close();
                }

                //Open new Popover
                if (selectedItemKey === "Container") {
                    var oContainerPopover = this.getView().byId("addContainerPopover");
                    oContainerPopover.openBy(oEvent.getSource());
                } else if(selectedItemKey === "LeafNode") {
                    var oControlPopover = this.getView().byId("addControl");
                    oControlPopover.openBy(oEvent.getSource());
                }
               
            },
            onControlOptionPress: function(oEvent)
            {   
                
                var sContainerType = oEvent.oSource.mProperties.title
                // console.log(sel);

                var oContainer;
                switch(sContainerType)
                {
                case "Input":
                    oContainer = new sap.m.Input({ placeholder: "Enter text" });
                    break;
                case "Button":
                    oContainer = new sap.m.Button({ text: "Press me" });
                    break;
                case "Text":
                    oContainer = new sap.m.Text({ text: "Sample text" });
                    break;
                case "CheckBox":
                    oContainer = new sap.m.CheckBox({ text: "Check me" });
                    break;
                case "DatePicker":
                    oContainer = new sap.m.DatePicker();
                    break;
                case "Slider":
                    oContainer = new sap.m.Slider();
                    break;
                case "ComboBox":
                    oContainer = new sap.m.ComboBox();
                    break;
                case "List":
                    oContainer = new sap.m.List();
                    break;
                case "Link":
                    oContainer = new sap.m.Link({ text: "Open link" });
                    break;
                case "Switch":
                    oContainer = new sap.m.Switch();
                    break;
                case "RadioButton":
                    oContainer = new sap.m.RadioButton({ text: "Option 1" });
                    break;

                }
                
                this.getView().byId("addControl").close();
            },














           


            



        });
    });
