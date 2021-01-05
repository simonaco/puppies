# Angular Cosmos DB

Original project by [John Papa](http://twitter.com/john_papa)

You are viewing a fork adapted by [Simona Cotin](http://twitter.com/simona_cotin)

You can [watch John Papa build the app as part of his series here](https://johnpapa.net/angular-cosmosdb-1/)

You can [view all videos together here](/VIDEOS.md)

[Learn more about developing Node.js apps with Azure's cloud services here](https://docs.microsoft.com/nodejs/azure?WT.mc_id=startup-0000-sicotin)

## Docker

Create the Docker image and run it locally

```bash
dockerImage=angular-cosmosdb
docker build -t $dockerImage .
docker run -d -p 3000:80 $dockerImage
```

## Requirements

1. Install the Angular CLI

   ```bash
   npm install -g @angular/cli
   ```

1. Install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?WT.mc_id=startup-0000-sicotin)

## Getting Started

1. Clone this repository

   ```bash
   git clone https://github.com/simonaco/puppies
   cd puppies
   ```

1. Install the npm packages

   ```bash
   npm i
   ```

1. Configure Cosmos DB server settings

   Rename the `example-environment.js` file to `environment.js` in the `server/env/` folder and update it with your Cosmos DB settings. Replace the database name key, and port with your specific configuration.

   ```javascript
   // server/env/environment.js
   const cosmosPort = 1234; // replace with your port
   const dbName = 'your-cosmos-db-name-goes-here';
   const key = 'your-key-goes-here';

   module.exports = {
     cosmosPort,
     dbName,
     key
   };
   ```

## Running the app

1. Build the Angular app

   ```bash
   ng build
   ```

1. Launch the server

   ```bash
   node src/server/index.js
   ```

1. Open the browser to http://localhost:3000

## Problems or Suggestions

[Open an issue here](https://github.com/simonaco/puppies/issues)
