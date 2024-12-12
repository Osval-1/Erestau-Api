const { PersonalizeClient } = require("@aws-sdk/client-personalize");
const { GetRecommendationsCommand } = require("@aws-sdk/client-personalize-runtime");
const User = require("../models/user.model");

const client = new PersonalizeClient({
    region: "us-east-1",
    credentials: {
        accessKeyId: "AKIAWY2J6GUJWDH5TXPN",
        secretAccessKey: "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"
    },
  });
  
const createRecomendation = async (req, res) => {
    try {
      const { itemId } = req.body;
  
      const campaignArn = 'arn:aws:personalize:us-east-1:465622152467:campaign/food-recommendation';
      const numResults = 10;
  
      const params = {
        campaignArn: campaignArn,
        itemId: itemId,
        numResults: numResults
      };
      const command = new GetRecommendationsCommand(params);
      const response = await client.send(command);
      console.log('Response:', response);
  
      if (response.itemList) {
        const itemList = response.itemList;
        console.log('Recommendations:', itemList);
        res.status(200).json(itemList);
      } else {
        console.log('No recommendations found.');
        res.status(200).json([]);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(400).json({ msg: 'Error occurred while getting recommendations!' });
    }
  };



module.exports = {
    createRecomendation,
}