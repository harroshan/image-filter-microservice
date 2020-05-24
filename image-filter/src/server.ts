import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    const url: string = req.query.image_url;
    if(!url){
      res.status(400).send("Url is necessary");
    }
    try {
      const processedImg = await filterImageFromURL(url);
      res.status(200).sendFile(processedImg, async () => {
        await deleteLocalFiles([processedImg]);
      });
    } catch (e){
      res.status(422).send("Make sure you provide correct image url");
    }
  })
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();