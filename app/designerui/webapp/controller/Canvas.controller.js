

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
                    nodes: [] // Initialize with an empty array
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
                        oContainer = new sap.m.HBox({ id: "container_" + new Date().getTime() });
                        break;
                    case "VBox":
                        oContainer = new sap.m.VBox({ id: "container_" + new Date().getTime() });
                        break;
                    case "Input":
                        oContainer = new sap.m.Input({ placeholder: "Enter text", id: "control_" + new Date().getTime() });
                        break;
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
                    console.log(aItems);



                    var te = {
                        "text": sContainerType,
                        "ref": "sap-icon://add",
                        "ParentID": null,
                        "parentId": oContainer.getId(),
                        "isContainer": true

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
                    var sPath = oBindingContext.getPath();
                    var sParentContainerId = oModel.getProperty(sPath + "/parentId");
                    console.log("printing theID");
                    console.log(sParentContainerId);

                    // Create a new node
                    var oNewNode = {
                        text: sContainerType,
                        ref: "sap-icon://add",
                        "ParentID": sParentContainerId,
                        "parentId": oContainer.getId(),
                        "isContainer": true,
                        buttonEnabled: false

                    };

                    // Get the path of the pressed button in the model


                    // Get the nodes array from the model
                    var aNodes = oModel.getProperty(sPath + "/nodes") || [];

                    // Add the new node to the nodes array
                    aNodes.push(oNewNode);


                    var oParentContainer = sap.ui.getCore().byId(sParentContainerId);

                    // Check if the parent container reference exists
                    if (oParentContainer) {
                        // Add the new control to the parent container
                        oParentContainer.addItem(oContainer);
                    } else {
                        // Handle the case when the parent container reference is not found
                        console.error("Parent container not found.");
                    }



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
                var that=this;
                var oModel = this.getView().getModel();


                var sContainerType = oEvent.oSource.mProperties.title
                // console.log(sel);

                var oContainer;
                switch (sContainerType) {
                    case "Input":
                        oContainer = new sap.m.Input({ placeholder: "Enter text", id: "control_" + that.generateUUID() });
                        break;
                    case "Button":
                        oContainer = new sap.m.Button({ text: "Press me", id: "control_" + that.generateUUID() });
                        break;
                    case "Text":
                        oContainer = new sap.m.Text({ text: "Sample text", id: "control_" + that.generateUUID() });
                        break;
                    case "CheckBox":
                        oContainer = new sap.m.CheckBox({ text: "Check me", id: "control_" + that.generateUUID() });
                        break;
                    case "DatePicker":
                        oContainer = new sap.m.DatePicker({ id: "control_" + that.generateUUID() });
                        break;
                    case "Slider":
                        oContainer = new sap.m.Slider({ id: "control_" + that.generateUUID() });
                        break;
                    case "ComboBox":
                        oContainer = new sap.m.ComboBox({ id: "control_" + that.generateUUID() });
                        break;
                    case "List":
                        oContainer = new sap.m.List({ id: "control_" + that.generateUUID() });
                        break;
                    case "Link":
                        oContainer = new sap.m.Link({ text: "Open link", id: "control_" + that.generateUUID() });
                        break;
                    case "Switch":
                        oContainer = new sap.m.Switch({ id: "control_" + that.generateUUID() });
                        break;
                    case "RadioButton":
                        oContainer = new sap.m.RadioButton({ text: "Option 1", id: "control_" + that.generateUUID() });
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

                    var sPath = oBindingContext.getPath();

                    var sParentContainerId = oModel.getProperty(sPath + "/parentId");
                    console.log("printing theID");
                    console.log(sParentContainerId);

                    // Create a new node
                    var oNewNode = {
                        text: sContainerType,
                        ref: "sap-icon://add",
                        ParentID: sParentContainerId,
                        "parentid": oContainer.getId(),
                        "isContainer": false,
                        buttonEnabled: true

                    };

                    // Get the path of the pressed button in the model

                    // Get the nodes array from the model
                    var aNodes = oModel.getProperty(sPath + "/nodes") || [];

                    // Add the new node to the nodes array
                    aNodes.push(oNewNode);

                    // Set the updated nodes array back to the model
                    oModel.setProperty(sPath + "/nodes", aNodes);


                    var oParentContainer = sap.ui.getCore().byId(sParentContainerId);

                    // Check if the parent container reference exists
                    if (oParentContainer) {
                        // Add the new control to the parent container
                        oParentContainer.addItem(oContainer);
                    } else {
                        // Handle the case when the parent container reference is not found
                        console.error("Parent container not found.");
                    }



                    // Update the model
                    oModel.refresh(true);

                    // testing 

                    // var oParentContainer = oModel.getProperty(sPath + "/parent");

                    // // Check if the parent container reference exists
                    // if (oParentContainer) {
                    //     // Add the new control to the parent container
                    //     oParentContainer.addContent(oContainer);
                    // } else {
                    //     // Handle the case when the parent container reference is not found
                    //     console.error("Parent container not found.");
                    // }
                }

                this.getView().byId("addControl").close();
            },




            //Data basepart 

            onPress: function () {
                // Get the model and the current state of the layout
                var oModel = this.getView().getModel();
                var aItems = oModel.getProperty("/items");
                var bItems = oModel.getProperty("/nodes");
                console.log(aItems);
                console.log(bItems);

                let that = this

                // Construct the payload to be sent to the backend
                var oPayload = {
                    layout_name: "YourLayoutName", // Replace with the actual layout name
                    controls: [] // Array to store controls and their properties
                };

                // Create a unique layout_id
                oPayload.layout_id = that.generateUUID();

                // Iterate over each item in the layout
                aItems.forEach(function (item) {
                    // Check if the item represents a control
                    if (item.isContainer !== undefined) {
                        // Create a new Control entity
                        var oControl = {
                            controlId: that.generateUUID(),
                            layout_id: oPayload.layout_id,
                            ParentID: item.ParentID || null,
                            isContainer: item.isContainer,
                            controltype: item.text
                        };

                        // Create an array to store control properties
                        oControl.controlProperties = [];

                        // Add control properties if available
                        if (item.properties) {
                            item.properties.forEach(function (property) {
                                // Create a new ControlProperty entity
                                var oControlProperty = {
                                    controlID: oControl.controlId,
                                    propertyName: property.name,
                                    propertyValue: property.value
                                };

                                // Add the control property to the array
                                oControl.controlProperties.push(oControlProperty);
                            });
                        }

                        // Add the control to the controls array in the payload
                        oPayload.controls.push(oControl);
                    }
                });
                bItems.forEach(function (item) {
                    // Check if the item represents a control
                    if (item.isContainer !== undefined) {
                        // Create a new Control entity
                        var oControl = {
                            controlId: that.generateUUID(),
                            layout_id: oPayload.layout_id,
                            ParentID: item.ParentID || null,
                            isContainer: item.isContainer,
                            controltype: item.text
                        };

                        // Create an array to store control properties
                        oControl.controlProperties = [];

                        // Add control properties if available
                        if (item.properties) {
                            item.properties.forEach(function (property) {
                                // Create a new ControlProperty entity
                                var oControlProperty = {
                                    controlID: oControl.controlId,
                                    propertyName: property.name,
                                    propertyValue: property.value
                                };

                                // Add the control property to the array
                                oControl.controlProperties.push(oControlProperty);
                            });
                        }

                        // Add the control to the controls array in the payload
                        oPayload.controls.push(oControl);
                    }
                });
                console.log("Printing payload");
                console.log(oPayload);

                // Make an AJAX call to your backend to save the layout
                $.ajax({
                    url: this.getOwnerComponent().getModel().getServiceUrl() + 'Layout',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(oPayload),
                    success: function (res) {
                        console.log("Layout saved successfully:", res);
                    },
                    error: function (err) {
                        console.error("Error saving layout:", err);
                    }
                });
            },

            // Function to generate a UUID (replace this with your UUID generation logic)
            generateUUID: function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

























        });
    });
