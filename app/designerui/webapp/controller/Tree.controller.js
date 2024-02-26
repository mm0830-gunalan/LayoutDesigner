sap.ui.define([
    'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/MessageToast'
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    var PageController = Controller.extend("designerui.controller.Tree", {
        onInit: function (evt) {
            // set explored app's demo model on this sample
            var oModel = new JSONModel([
                {
                    "text": "Node1",
                    "ref": "sap-icon://attachment-audio",
                    "nodes":
                        [
                            {
                                "text": "Node1-1",
                                "ref": "sap-icon://attachment-e-pub",
                                "nodes": [
                                    {
                                        "text": "Node1-1-1",
                                        "ref": "sap-icon://attachment-html"
                                    },
                                    {
                                        "text": "Node1-1-2",
                                        "ref": "sap-icon://attachment-photo",
                                        "nodes": [
                                            {
                                                "text": "Node1-1-1",
                                                "ref": "sap-icon://attachment-text-file",
                                                "nodes": [
                                                    {
                                                        "text": "Node1-1-1-1",
                                                        "ref": "sap-icon://attachment-video"
                                                    },
                                                    {
                                                        "text": "Node1-1-1-2",
                                                        "ref": "sap-icon://attachment-zip-file"
                                                    },
                                                    {
                                                        "text": "Node1-1-1-3",
                                                        "ref": "sap-icon://course-program"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "text": "Node1-2",
                                "ref": "sap-icon://create"
                            }
                        ]
                },
                {
                    "text": "Node2",
                    "ref": "sap-icon://customer-financial-fact-sheet"
                }
            ]);
            this.getView().setModel(oModel,"gu");

        },

        handleButtonPress: function (evt) {
            console.log(evt);


            var oBindingContext = evt.getSource().getBindingContext();
            console.log(oBindingContext);
            // Get the model
            var oModel = this.getView().getModel();

            // Create a new node
            var oNewNode = {
                text: "New Child Node",
                ref: "sap-icon://add",
                nodes: [] // You can add child nodes if needed
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

    });

    return PageController;

});
