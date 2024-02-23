

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";
        var temp;
        var globaloEvent;



        return Controller.extend("designerui.controller.HomePage", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel({
                    items: [

                    ],
                    nodes: null // Initialize with an empty array
                });

                // Set the model to the view
                this.getView().setModel(oModel);



            },
            AddContainerAsPlusButton: function (oEvent) {
                console.log("this is og Event");
                console.log(oEvent);
                temp = true;
                console.log("clone");
                globaloEvent = oEvent;
                console.log(globaloEvent);
                var oBindingContext = oEvent.getSource().getBindingContext();
                console.log("true mode getting path");
                console.log(oBindingContext);
                var oContext = oEvent.getSource().getBindingContext();

                // Retrieve the value of the 'text' property from the context
                var sTextValue = oContext.getProperty("text");

                // Use the retrieved value as needed
                console.log("Text Value:", sTextValue);


                console.log(oEvent);

                var oButton = oEvent.getSource();
                var oPopover = this.getView().byId("dropDown");



                oPopover.openBy(oButton);
            },




            AddContainer: function (oEvent) {



                temp = false;

                console.log(oEvent);

                var oButton = oEvent.getSource();
                var oPopover = this.getView().byId("dropDown");



                oPopover.openBy(oButton);

            },
            onContainerOptionPress: function (oEvent) {

                var sContainerType = oEvent.oSource.mProperties.title
                var oModel = this.getView().getModel();

                var oSelectedNode = this.getView().getModel().getProperty("/selectedNode");
                console.log(oSelectedNode);



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

                if (temp === false) {
                    // Add the container to the center page
                    var oCenterPage = this.getView().byId("designCanvas");
                    oCenterPage.addContent(oContainer);
                    // console.log("Added");

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
                    // console.log("after pushing into the array");
                    // console.log(aItems);


                    oModel.setProperty("/items", aItems);


                } else {
                    console.log("cant add");
                    console.log("printing global event");
                    console.log(globaloEvent);
                    var oBindingContext = globaloEvent.getSource().getBindingContext();
                    console.log("true mode");
                    console.log(oBindingContext);

                    // Get the model
                    var oModel = this.getView().getModel();

                    // Create a new node
                    var oNewNode = {
                        text: sContainerType,
                        ref: "sap-icon://add",
                        nodes: []
                    };

                    // Get the path of the pressed button in the model
                    var sPath = oBindingContext.getPath();

                    // Get the nodes array from the model
                    var aNodes = oModel.getProperty(sPath + "/nodes") || [];

                    // Add the new node to the nodes array
                    aNodes.push(oNewNode);

                    // Set the updated nodes array back to the model
                    oModel.setProperty(sPath + "/nodes", aNodes);

                    // Update the model
                    oModel.refresh(true);

                }







                this.getView().byId("addContainerPopover").close();
                console.log(temp);
            },
            onChange: function (oEvent) {
                var selectedItemKey = oEvent.getParameter("selectedItem").getKey();


                // Close the previously opened popover if it exists
                var oPreviousPopover = this.getView().byId("addContainerPopover");
                var oPreviousPopover1 = this.getView().byId("addControl");
                if (oPreviousPopover && oPreviousPopover.isOpen()) {
                    oPreviousPopover.close();
                } else if ((oPreviousPopover1 && oPreviousPopover1.isOpen())) {
                    oPreviousPopover1.close();
                }

                //Open new Popover
                if (selectedItemKey === "Container") {
                    var oContainerPopover = this.getView().byId("addContainerPopover");
                    oContainerPopover.openBy(oEvent.getSource());
                } else if (selectedItemKey === "LeafNode") {
                    var oControlPopover = this.getView().byId("addControl");
                    oControlPopover.openBy(oEvent.getSource());
                }
                // var dropView=this.getView().byId("dropDown");
                // dropView.close();

            },
            onControlOptionPress: function (oEvent) {
                var oModel = this.getView().getModel();


                var sContainerType = oEvent.oSource.mProperties.title
                // console.log(sel);

                var oContainer;
                switch (sContainerType) {
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
                if (temp === true) {
                    console.log("printing global event");
                    console.log(globaloEvent);
                    var oBindingContext = globaloEvent.getSource().getBindingContext();
                    console.log("true mode");
                    console.log(oBindingContext);
                    // Get the model
                    var oModel = this.getView().getModel();

                    // Create a new node
                    var oNewNode = {
                        text: sContainerType,
                        ref: "sap-icon://add",
                        nodes: [],
                        buttonEnabled: true
                    };

                    // Get the path of the pressed button in the model
                    var sPath = oBindingContext.getPath();

                    // Get the nodes array from the model
                    var aNodes = oModel.getProperty(sPath + "/nodes") || [];

                    // Add the new node to the nodes array
                    aNodes.push(oNewNode);

                    // Set the updated nodes array back to the model
                    oModel.setProperty(sPath + "/nodes", aNodes);


                    // Update the model
                    oModel.refresh(true);
                }

                this.getView().byId("addControl").close();
            },




            // for adding as a child



        




















        });
    });
