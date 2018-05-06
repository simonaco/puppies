# MEAN app with Cosmos DB

## Angular app

1.  Install the Angular CLI

```bash
npm install @angular/cli -g
```

1.  Generate a new Angular app with routing. We indicate we want the Angular app to be placed in the `src/client` folder, `--minimal` indicates we should create inline styles and templates, and we don't want test files. `--style scss` indicates we will use SASS instead of CSS.

```bash
ng new angular-cosmosdb -sd src/client --minimal --style scss
cd angular-cosmosdb
```

## Node and Express app

1.  Install Express, and body parser.

```bash
npm install express body-parser --save
```

1.  Open VS Code

1.  Create a new folder and file for `src/server/index.js`

1.  Type this code into `index.js`

```javascript
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
//const routes = require('./routes');

const root = './';
const port = process.env.PORT || '3000';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(root, 'dist')));
//app.use('/api', routes);
app.get('*', (req, res) => {
  res.sendFile('dist/index.html', { root: root });
});

app.listen(port, () => console.log(`API running on localhost:${port}`));
```

1.  Create `src/server/routes.js`

1.  Create a `/api` route (link to routes.js)

1.  Create a `/api/get` route

```javascript
const express = require('express');
const router = express.Router();

// const puppyService = require('./puppy.service');

router.get('/puppies', (req, res) => {
  //puppyService.getPuppies(req, res);
  res.send(200, [{ id: 10, name: 'Starlord', saying: 'oh yeah' }]);
});

module.exports = router;
```

1.  Create a VS Code debug configuration for Node, and press the green arrow to run it! (Press debug, press configure, select Node.js, press green button)

1.  Change the launch config's launch program to our node server

```json
"program": "${workspaceRoot}/src/server/index.js"
```

1.  Open Postman and paste perform a _GET_ http request on http://localhost:3000/api/puppies. You should see the following JSON results

## Adding the A in MEAN

### The Puppies UI

1.  Add a component to list Puppies. The `--flat` flag adds the component without putting it in its own sub folder.

```bash
ng g c puppies --flat
```

1.  Copy this code into `puppies.component.html`

1.  Copy the styles.scss code

1.  Copy this code into `puppies.component.ts`

1.  Add the puppy component's selector to the `app.component.ts`

```javascript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>Puppies</h1>
    <app-puppies></app-puppies>
  `
})
export class AppComponent {}
```

1.  Import Forms and Http modules into the app

```javascript
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// ...

  imports: [BrowserModule, FormsModule, HttpClientModule],
```

1.  Create a model for our puppies, `puppy.ts`

```bash
ng g cl puppy
```

1.  Add a service to handle http interactions between Angular and Node

```bash
ng g s puppy -m app.module
```

1.  Copy the code into `puppy.service.ts`
1.  Build the app

```bash
ng build
```

1.  Press the green arrow to run it!
1.  Open the browser to http://localhost:3000

## Create a Cosmos DB account

### Cosmos DB setup

1.  Install the Azure CLI

1.  Login to Azure via the CLI

```bash
# interactive login to Azure
az login
```

1.  Create a logical place for our Azure resources. This is a called a resource group.

```bash
# Create a resource group (logical container for our Azure resources)
az group create -n my-puppies-group -l "East US"
```

1.  Create the Cosmos DB account and make sure it is of type MongoDB

```bash
# Create our Cosmos DB
az cosmosdb create -n my-puppies-db -g my-puppies-group --kind MongoDB
```

### Connecting to Mongo

1.  Install the mongoose node package from npm

```bash
npm install mongoose --save
```

1.  Create `src/server/mongo.js` to handle mongo connections

```javascript
const mongoose = require('mongoose');
/**
 * Set to Node.js native promises
 * Per http://mongoosejs.com/docs/promises.html
 */
mongoose.Promise = global.Promise;

const env = require('./env/environment');

// eslint-disable-next-line max-len
const mongoUri = `mongodb://${env.dbName}:${env.key}@${
  env.dbName
}.documents.azure.com:${env.cosmosPort}/?ssl=true`;

function connect() {
  return mongoose.connect(mongoUri, { useMongoClient: true });
}

module.exports = {
  connect,
  mongoose
};
```

1.  Create the connection environment file `src/server/env/env.js`

```javascript
const cosmosPort = 1234; // replace with your port
const dbName = 'your-cosmos-db-name-goes-here';
const key = 'your-key-goes-here';

module.exports = {
  dbName,
  key,
  cosmosPort
};
```

1.  Enter the following Azure CLI commands to get the password and connection string. Copy these to your text editor

```bash
# Get the key for the Cosmos DB
az cosmosdb list-keys -n my-puppies-db -g my-puppies-group --query "primaryMasterKey"

# Get the connection string
az cosmosdb list-connection-strings -n my-cosmos-puppies -g my-puppies-db-group --query "connectionStrings[0].connectionString"
```

1.  Replace your port, database name, and password/key for Cosmos DB. You can find these in the Azure portal for your Cosmos DB account.

1.  Create the Puppy model `src/server/puppy.model.js`

1.  Enter the following code to create the Puppy model using a mongoose schema

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const puppySchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: String,
    saying: String
  },
  {
    collection: 'puppies',
    read: 'nearest'
  }
);
const Puppy = mongoose.model('Puppy', puppySchema);
module.exports = Puppy;
```

### Create a service to handle puppies data using Mongo via Mongoose

1.  Create `src/server/puppy.service.js`

```javascript
const Puppy = require('./puppy.model');

require('./mongo').connect();

function getPuppies(req, res) {
  const docquery = Puppy.find({});
  docquery
    .exec()
    .then(puppies => {
      res.status(200).json(puppies);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

module.exports = {
  getPuppies
};
```

1.  Modify `src/server/routes.js` to use the new `puppy.service.js`

```javascript
const express = require('express');
const router = express.Router();

const puppyService = require('./puppy.service');

router.get('/puppies', (req, res) => {
  puppyService.getPuppies(req, res);
  //res.send(200, [
  //  {"id": 10,"name": "Starlord","saying": "oh yeah"}
  //]);
});

module.exports = router;
```

1.  Restart the node process in the VS Code debugger.

1.  Open Postman and paste perform a _GET_ http request on http://localhost:3000/api/puppies. You should see the following JSON results

1.  Open the app at http://localhost:3000. You should see the app no longer has any puppies, because we are hitting the new database.

## Create the post, put and delete methods in the node server

### Create the Puppy Post

1.  In the `src/server/puppy.service`, create the post method and the helper functions.

```javascript
function postPuppy(req, res) {
  const originalPuppy = {
    id: req.body.id,
    name: req.body.name,
    saying: req.body.saying
  };
  const puppy = new Puppy(originalPuppy);
  puppy.save(error => {
    if (checkServerError(res, error)) return;
    res.status(201).json(puppy);
    console.log('Puppy created successfully!');
  });
}

function checkServerError(res, error) {
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

module.exports = {
  getPuppies,
  postPuppy
};
```

1.  In the `src/server/routes.js`, call the post function

```javascript
router.post('/puppy', (req, res) => {
  puppyService.postPuppy(req, res);
});
```

1.  Restart the node process in the VS Code debugger.

1.  Open the app at http://localhost:3000. Add a puppy

### Create the PUT and DELETE

1.  In the `src/server/puppy.service`, create the post method and the helper functions.

```javascript
function putPuppy(req, res) {
  const id = parseInt(req.params.id, 10);
  const updatedPuppy = {
    id: id,
    name: req.body.name,
    saying: req.body.saying
  };
  Puppy.findOne({ id: id }, (error, puppy) => {
    if (checkServerError(res, error)) return;
    if (!checkFound(res, puppy)) return;

    puppy.name = updatedPuppy.name;
    puppy.saying = updatedPuppy.saying;
    puppy.save(error => {
      if (checkServerError(res, error)) return;
      res.status(200).json(puppy);
      console.log('Puppy udpated successfully!');
    });
  });
}

function deletePuppy(req, res) {
  const id = parseInt(req.params.id, 10);
  Puppy.findOneAndRemove({ id: id })
    .then(puppy => {
      if (!checkFound(res, puppy)) return;
      res.status(200).json(puppy);
      console.log('Puppy deleted successfully!');
    })
    .catch(error => {
      if (checkServerError(res, error)) return;
    });
}

function checkFound(res, puppy) {
  if (!puppy) {
    res.status(404).send('Puppy not found.');
    return;
  }
  return puppy;
}

module.exports = {
  getPuppies,
  postPuppy,
  putPuppy,
  deletePuppy
};
```

1.  In the `src/server/routes.js`, call the post function

```javascript
router.post('/puppy', (req, res) => {
  puppyService.postPuppy(req, res);
});
```

1.  Restart the node process in the VS Code debugger.

1.  Open the app at http://localhost:3000. Get, Add, Update, Delete !
