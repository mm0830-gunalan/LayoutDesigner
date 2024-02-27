const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/id', async (req, res) => {
   const layoutId = req.query.layoutId;

   if (!layoutId) {
      return res.status(400).json({ error: 'Layout ID is required' });
   }

   const url = `https://port4004-workspaces-ws-6pbtq.us10.trial.applicationstudio.cloud.sap/odata/v4/catalog/Layout(${layoutId})?$expand=controls($expand=controlProperties)`;

   try {
      const response = await axios.get(url);
      // Handle the successful response and work with the data
      res.json(response.data);
   } catch (error) {
      // Handle the error
      console.error("Error:", error.message);
      res.status(error.response?.status || 500).json({ error: 'Failed to fetch data' });
   }
});

app.listen(port, () => {
   console.log(`Server listening at http://localhost:${port}`);
});
