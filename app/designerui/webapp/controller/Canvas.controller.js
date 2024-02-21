sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";
        selectedContainerName: "";


        return Controller.extend("designerui.controller.HomePage", {
            onInit: function () {
                var oTreeTableModel = new JSONModel({
                    containers: []
                });
                this.getView().setModel(oTreeTableModel, "treeTableData");

                var aControlNames = {
                    "controls": [
                        { "name": "Input" },
                        { "name": "Button" },
                        { "name": "VBox" }

                    ]
                };

                var oModel = new JSONModel(aControlNames);
                this.getView().setModel(oModel, "controlModel");

                this.fetchContainers();
                this.fetchContainerProperties();
            },
            fetchContainers: function () {

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
            fetchContainerProperties: function () {
                // Fetch container properties from a service or API
                var containerPropertiesData = {
                    "VBox": [
                        { name: "width", type: "sap.ui.core.CSSSize", defaultValue: "100%" },
                        { name: "height", type: "sap.ui.core.CSSSize", defaultValue: "auto" },
                        // ... other properties for VBox
                    ],

                };

                var oPropertiesModel = new JSONModel(containerPropertiesData);
                this.getView().setModel(oPropertiesModel, "properties"); // Set the model with a name "properties"
            },
            onTreeSelectionChange: function (oEvent) {
                const val = oEvent.getParameter('cellControl').getProperty('text')
                console.log(val);
                var oButton = oEvent.getSource();
                var oPopover = this.getView().byId("forControls");
                oPopover.openBy(oButton);
            },
            AddContainer: function (oEvent) {

                var oButton = oEvent.getSource();
                var oPopover = this.getView().byId("addContainerPopover");
                oPopover.openBy(oButton);
            },
            onContainerOptionPress: function (oEvent) {
                // var oListItem = oEvent.getParameter("listItem");
                // var sSelectedContainer = oListItem.getTitle();
                var sel = oEvent.oSource.mProperties.title
                console.log(sel);
                this.selectedContainerName = sel;
                var containerProperties = this.getContainerProperties(sel);
                var propertyControls = this.createPropertyControls(containerProperties);
                this.updateRightSidePanel(propertyControls);





                this.getView().byId("addContainerPopover").close();
            },
            getContainerProperties: function (containerName) {


                var oPropertiesModel = this.getView().getModel("properties");
                return oPropertiesModel.getProperty("/" + containerName) || [];
            },
            createPropertyControls: function (properties) {
                var propertyControls = [];

                // Loop through each property and create controls dynamically
                properties.forEach(function (property) {
                    var nameLabel = new sap.m.Text({
                        text: property.name,
                    });

                    // Create controls based on the property type
                    var control;
                    if (property.type === "boolean") {
                        control = new sap.m.CheckBox({
                            selected: property.defaultValue,
                        });
                    } else if (property.type === "sap.ui.core.CSSSize") {
                        control = new sap.m.Input({
                            value: property.defaultValue,
                        });
                    }


                    if (control) {
                        // Add the nameLabel and control to a VBox or any other container
                        var vbox = new sap.m.VBox({
                            items: [nameLabel, control],
                        });

                        propertyControls.push(vbox);
                    }
                });

                return propertyControls;
            },
            updateRightSidePanel: function (controls) {


                var oRightSidePanel = this.getView().byId("rightSidePanel");

                // Remove existing controls from the VBox
                oRightSidePanel.removeAllItems();
                console.log(controls);

                // Add the dynamically created controls to the VBox
                controls.forEach(function (control) {
                    console.log(control);
                    oRightSidePanel.addItem(control);
                });
            },
            onOKPress: function () {
                var selectedContainer = this.selectedContainerName;
                var oRightSidePanel = this.getView().byId("rightSidePanel");
                var aControls = oRightSidePanel.getItems();

                // Extract selected properties
                var selectedProperties = [];
                aControls.forEach(function (control) {

                    var propertyName = control.getItems()[0].getText();
                    var propertyValue;

                    if (control.getItems()[1].getMetadata().getName() === "sap.m.CheckBox") {
                        propertyValue = control.getItems()[1].getSelected();
                    } else if (control.getItems()[1].getMetadata().getName() === "sap.m.Input") {
                        propertyValue = control.getItems()[1].getValue();
                    }

                    selectedProperties.push({
                        name: propertyName,
                        value: propertyValue,
                    });
                });
                console.log(selectedProperties);

                // Create container dynamically in the center
                this.createContainerInCenter(selectedContainer, selectedProperties);
            },
            createContainerInCenter: function (selectedContainer, selectedProperties) {

                console.log("eneteringinto the cera");
                console.log(selectedContainer);
                console.log(selectedProperties);
                var oDesignCanvas = this.getView().byId("designCanvas");
                console.log(oDesignCanvas);
                var newContainer;

                // Check the selected container type
                if (selectedContainer === "VBox") {
                    newContainer = new sap.m.VBox();
                } else if (selectedContainer === "HBox") {
                    newContainer = new sap.m.HBox();
                } else {

                    newContainer = new sap.m.FlexBox();
                }


                selectedProperties.forEach(function (property) {
                    newContainer.setProperty(property.name, property.value);
                });

                // Add the new container to the central area
                oDesignCanvas.addContent(newContainer);
                console.log("Added");
                this.updateTreeTableDataModel(selectedContainer);

                // Refresh the TreeTable
                var oTreeTable = this.getView().byId("treeTable");
                oTreeTable.getBinding("rows").refresh();
            },
            updateTreeTableDataModel: function (containerName) {
                var oModel = this.getView().getModel("treeTableData");
                var aContainers = oModel.getProperty("/containers");

                // Add the new container to the data model
                var newContainer = {
                    name: containerName,

                };

                aContainers.push(newContainer);

                // Update the model with the new data
                oModel.setProperty("/containers", aContainers);
                oModel.refresh();

                // Expand the parent node (if you have a hierarchy)
                var oTreeTable = this.getView().byId("treeTable");
                oTreeTable.expandToLevel(aContainers.length);
            },



        });
    });
