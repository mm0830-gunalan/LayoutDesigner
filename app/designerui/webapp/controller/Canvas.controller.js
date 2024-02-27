



sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";
        var temp;
        var globaloEvent;
        var idLayout;
        var controlType;


        return Controller.extend("designerui.controller.HomePage", {
            onInit: function () {
                var oModel = new sap.ui.model.json.JSONModel({
                    items: [

                    ],


                });

                // Set the model to the view
                this.getView().setModel(oModel);
                this.getView().getModel().setProperty("/containerSelected", false);
                this.getView().getModel().setProperty("/leafSelected", false);

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("newLayout").attachPatternMatched(this.onObjectMatched, this);




            },


            onObjectMatched: function (oEvent) {
                var that = this;
                var oArgs = oEvent.getParameter("arguments");
                var itemId = oArgs.id;
                idLayout = itemId;
                console.log(idLayout);
                var view = that.getView().byId("designCanvas");
                view.destroyContent();
                this.bindingData();
            },
            bindingData() {

                var oModel = this.getView().getModel();
                this.getView().getModel().setProperty("/items", []);
                var that = this;

                var url = "https://port4004-workspaces-ws-6pbtq.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Layout(" + idLayout + ")?$expand=controls($expand=controlProperties)";

                $.ajax({
                    url: url,
                    method: 'GET',
                    success: function (data) {


                        console.log("Data:")
                        var controlsArray = data.controls;
                        // console.log(controlsArray);

                        var customData = [];
                        var childControls = [];
                        // Loop through the controls array
                        data.controls.forEach(function (control) {

                            if (control.isContainer === true) {
                                var customItem = {
                                    text: control.controltype,
                                    ref: "sap-icon://add",
                                    ParentID: control.ParentID,
                                    parentId: control.controlId, // Assuming you want to use controlId as parentId
                                    isContainer: control.isContainer,
                                    nodes: []
                                }
                            }
                            else {
                                var customItem = {
                                    text: control.controltype,
                                    ref: "sap-icon://add",
                                    ParentID: control.ParentID,
                                    parentId: control.controlId, // Assuming you want to use controlId as parentId
                                    isContainer: control.isContainer,
                                    buttonEnabled: true,
                                    nodes: []

                                }
                            }

                            // Check if ParentID is null, then add to customData
                            if (control.ParentID !== null) {
                                var parentItem = that.findItemById(oModel.getData().items, control.ParentID);



                                // // Add the custom item to the parent's nodes array
                                parentItem.nodes.push(customItem);
                            } else {
                                customData.push(customItem);

                                oModel.getData().items.push(customItem);
                            }
                        });


                        // Set the customData array to the model
                        //    oModel.setProperty({ items: customData });

                        // Refresh the model to reflect the changes
                        that.getView().getModel().refresh();
                        console.log("child contols");
                        console.log(childControls);
                        that.fromAPIrenderingLayout(controlsArray);

                    },
                    error: function (errorThrown) {
                        // Handle the error
                        console.error("Error:", errorThrown);
                    }
                });


            },
            fromAPIrenderingLayout: function (controlsArray) {
                var that = this;
                console.log("api function working");

                controlsArray.forEach(function (item) {
                    if (item.ParentID == null) {
                        that.fetchParentContainer(item);
                    } else {
                        that.fetchChildNodes(item);
                    }
                })
            },
            fetchParentContainer: function (item) {
                const containerName = item.controltype;
                var oContainer;
                var gettingID = (item.controlId);
                switch (containerName) {
                    case "HBox":
                        oContainer = new sap.m.HBox({ id: gettingID });
                        break;
                    case "VBox":
                        oContainer = new sap.m.VBox({ id: gettingID });
                        break;

                    default:

                        break;
                }
                var oCenterPage = this.getView().byId("designCanvas");

                oCenterPage.addContent(oContainer);
                console.log(oContainer.getId());



            },
            fetchChildNodes: function (item) {
                var childNodeName = item.controltype;
                var oContainer;
                switch (childNodeName) {
                    case "Input":
                        oContainer = new sap.m.Input({ placeholder: "Enter text", id: item.controlId });
                        break;
                    case "Button":
                        oContainer = new sap.m.Button({ text: "Press me", id: item.controlId });
                        break;
                    case "Text":
                        oContainer = new sap.m.Text({ text: "Sample text", id: item.controlId });
                        break;
                    case "CheckBox":
                        oContainer = new sap.m.CheckBox({ text: "Check me", id: item.controlId });
                        break;
                    case "DatePicker":
                        oContainer = new sap.m.DatePicker({ id: item.controlId });
                        break;
                    case "Slider":
                        oContainer = new sap.m.Slider({ id: item.controlId });
                        break;
                    case "ComboBox":
                        oContainer = new sap.m.ComboBox({ id: item.controlId });
                        break;
                    case "List":
                        oContainer = new sap.m.List({ id: item.controlId });
                        break;
                    case "Link":
                        oContainer = new sap.m.Link({ text: "Open link", id: item.controlId });
                        break;
                    case "Switch":
                        oContainer = new sap.m.Switch({ id: item.controlId });
                        break;
                    case "RadioButton":
                        oContainer = new sap.m.RadioButton({ text: "Option 1", id: item.controlId });
                        break;
                    case "HBox":
                        oContainer = new sap.m.HBox({ id: item.controlId });
                        break;
                    case "VBox":
                        oContainer = new sap.m.VBox({ id: item.controlId });
                        break;
                }
                var oParentContainer = sap.ui.getCore().byId(item.ParentID);

                // Check if the parent container reference exists
                if (oParentContainer) {


                    // Add the new control to the parent container
                    oParentContainer.addItem(oContainer);
                } else {


                    console.error("Parent container not found.");
                }


            },
            findItemById: function (items, targetId) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].parentId === targetId) {
                        return items[i];
                    }
                    if (items[i].nodes && items[i].nodes.length > 0) {
                        var foundItem = this.findItemById(items[i].nodes, targetId);
                        if (foundItem) {
                            return foundItem;
                        }
                    }
                }
                return null;
            },


            AddContainerAsPlusButton: function (oEvent) {

                temp = true;

                globaloEvent = oEvent;

                var oBindingContext = oEvent.getSource().getBindingContext();
                console.log("true mode getting path");
                console.log(oBindingContext);
                var oContext = oEvent.getSource().getBindingContext();

                // Retrieve the value of the 'text' property from the context
                // var sTextValue = oContext.getProperty("text");

                // Use the retrieved value as needed
                //console.log("Text Value:", sTextValue);


                this.pDialog ??= this.loadFragment({
                    name: "designerui.view.Control"
                });

                this.pDialog.then((oDialog) => oDialog.open());
            },




            AddContainer: function (oEvent) {



                temp = false;

                console.log(oEvent);
                this.pDialog ??= this.loadFragment({
                    name: "designerui.view.Control"
                });

                this.pDialog.then((oDialog) => oDialog.open());

                // var oButton = oEvent.getSource();
                // var oPopover = this.getView().byId("dropDown");



                // oPopover.openBy(oButton);

            },
            onContainerOptionPress: function (type) {



                var sContainerType = type;
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
            onControlOptionPress: function (type) {
                var that = this;
                var oModel = this.getView().getModel();


                var sContainerType = type;
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
                        "parentId": oContainer.getId(),
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

                console.log(aItems);


                let that = this

                // Construct the payload to be sent to the backend
                var oPayload = {

                    controls: [] // Array to store controls and their properties
                };

                // layoutID is coming from paramter as a Global variable
                oPayload.layout_id = idLayout;

                // Iterate over each item in the layout
                aItems.forEach(function (item) {
                    // Check if the item represents a control
                    if (item.isContainer !== undefined) {
                        // Create a new Control entity
                        var oControl = {
                            controlId: item.parentId,
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






                function childLeaf(item, flattenedNodes) {
                    if (item.nodes && item.nodes.length > 0) {
                        item.nodes.forEach(function (node) {
                            flattenedNodes.push(node);
                            childLeaf(node, flattenedNodes);
                        });
                    }
                }


                var allNodes = [];


                oModel.getProperty("/items").forEach(function (item) {
                    // Add the current item to allNodes


                    // Getting child nodes using recursion
                    childLeaf(item, allNodes);
                });

                console.log("printign child");

                console.log(allNodes);

                allNodes.forEach(function (item) {
                    // Check if the item represents a control
                    if (item.isContainer !== undefined) {
                        // Create a new Control entity
                        var oControl = {
                            controlId: item.parentId,
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

                var url = "https://port4004-workspaces-ws-6pbtq.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Layout(" + idLayout + ")";
                // TO save the layout on the Database
                $.ajax({
                    url: url,
                    //  url: that.getOwnerComponent().getModel().getServiceUrl() + 'Layout(' + idLayout + ')',
                    method: 'PATCH',
                    contentType: 'application/json',
                    data: JSON.stringify(oPayload),
                    success: function (res) {
                        console.log("Layout saved successfully:", res);
                        MessageBox.success("Saved Successfully !", {
                            title: "Success",
                            //  onClose: null,                                       

                            actions: sap.m.MessageBox.Action.OK,
                            emphasizedAction: sap.m.MessageBox.Action.OK,


                        });

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
            },


            //working for fragment
            onOpenDialog() {
                // create dialog lazily
                this.pDialog ??= this.loadFragment({
                    name: "designerui.view.Control"
                });

                this.pDialog.then((oDialog) => oDialog.open());
            },
            onSelectedControls: function (oEvent) {
                var selectedContainerType = oEvent.getParameter('value');
                controlType = selectedContainerType;
                console.log(controlType);

            },
            onCloseDialog: function () {
                var that = this;
                var containerBoolean = this.getView().getModel().getProperty("/containerSelected");


                if (containerBoolean) {
                    that.onContainerOptionPress(controlType);
                } else {
                    that.onControlOptionPress(controlType);

                }


                this.byId("containerList").close();
            },
            onRadioButtonSelect: function (oEvent) {
                var bContainerSelected = oEvent.getParameter("selectedIndex") === 0; // Index 0 is for Container
                var bLeafSelected = !bContainerSelected;


                this.getView().getModel().setProperty("/containerSelected", bContainerSelected);
                this.getView().getModel().setProperty("/leafSelected", bLeafSelected);
                var data = this.getView().getModel().getProperty("/containerSelected");
                console.log(data);
            },






















        });
    });
