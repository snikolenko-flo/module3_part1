# Gallery app

There is a login page with email and password fields.  
A user fills out the fields and clicks on the login button.  
The app sends a POST request to `http://127.0.0.1:3000/login`
with user data.

Server sends back a token or an error message.  
The token will be expired after 10 minutes.

After authorization is finished the app sends a GET request to `http://127.0.0.1:3000/gallery`  
Server sends back images urls. The app wrap them into html and displays to the user.

# Launching

Go to the backend directory that is located in the root.  
Run the command `npm run start`.

Go to the frontend directory that is located in the root.
Run the command `npm run build:front`.  
Open the frontend folder in VS Code editor and run built-in live server for the login page located in the path:
`./frontend/build/html/login.html`

The login page `http://127.0.0.1:5500/frontend/src/html/login.html` will be opened in a new browser tab.

Enter valid email and password and click on the login button.  
A first page of a gallery will be opened:

`http://127.0.0.1:3000/gallery.html?page=1`

You can set limit for number of images. E.g.:

`http://127.0.0.1:3000/gallery.html?page=1&limit=50`

And you also can filter images by user. E.g.:

`http://127.0.0.1:3000/gallery.html?page=1&limit=1&filter=user@mail.com`

# AWS + Serverless API for your application

## Project information

It is a skeleton for your AWS + Serverless applications.

## NPM commands

- **deploy:dev**: deploy to the AWS dev environment
- **deploy:prod**: deploy to the AWS prod environment
- **deploy:local**: start local development environment
- **sls:package:dev**: package code using sls package command for dev stage
- **sls:package:test**: package code using sls package command for dev stage
- **sls:package:prod**: package code using sls package command for prod stage
- **sls:print:dev**: print sls config for dev stage
- **sls:print:test**: print sls config for test test
- **sls:print:prod**: print sls config for prod test
- **lint**: start tslint for project files
- **test**: start unit tests
- **test:ci**: start test in CI environment
- **sqs:up**: start Docker SQS container for local development
- **sqs:down**: stop Docker SQS container for local development
- **sqs:list-queues**: list local queues
- **sqs:create-queue**: create local queue (remove square brackets for FIFO queue)
- **sqs:receive-messages**: receive messages from local queue (remove square brackets for FIFO queue)
- **sqs:delete-queue**: delete local queue (remove square brackets for FIFO queue)
- **db:up**: start Docker Postgres container for local development
- **db:drop**: drop Postgres database
- **db:create**: create Postgres database
- **db:migrate**: migrate Postgres database
- **dynamodb:up**: start Docker DynamoDB container for local development
- **sonarqube:up**: start Docker SonarQube container for local static code analysis
- **sonarqube-verify**: start Static Code Analysis
- **containers:down**: stop all containers

## Deployment information

1. Preparation
   - Install `nvm`\
     Linux, OSX: https://github.com/nvm-sh/nvm \
     Windows: https://github.com/coreybutler/nvm-windows
   - Install `Node.js` _Recommended For Most Users_ version (14.17.0 for now) using nvm \
     Linux, OSX: https://github.com/nvm-sh/nvm#usage \
     Windows: https://github.com/coreybutler/nvm-windows#usage
     ```
     nvm install 14.17.0
     nvm use 14.17.0
     ```
   - Install `aws-cli` version 2 \
     Linux: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html \
     Windows: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html \
     OSX: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html
   - Install `Serverless framework` globally via npm \
     https://serverless.com/framework/docs/getting-started/
     ```
     npm install -g serverless
     ```
   - Create AWS user with at least programmatic access. It will be better to use a user with the Admin access. Download
     user's credentials.\
     Set up `AWS credentials` according to `Serverless framework` documentation. \
     Name the profile as it named in the `PROFILE` [param](https://www.serverless.com/framework/docs/guides/parameters#stage-parameters) of the serverless config. \
     https://serverless.com/framework/docs/providers/aws/cli-reference/config-credentials/
     ```
     serverless config credentials --provider aws --key ACCESS_KEY_ID --secret SECRET_ACCESS_KEY --profile PROFILE
     ```
   - Install `git` https://git-scm.com/downloads
   - If the repository is private you should set up SSH key or use HTTPS for cloning it
   - Clone the repository
   - Install node_modules running the command in the root of the project
     ```
     npm i
     ```
2. Set up environment variables

   - Open env.yml file, you can see stage sections here. For example, `local`, `dev`, and `prod`. If you deploy on
     production use `prod` section and do not touch other sections.
   - Go to AWS Console `Key Management Service` and create Symmetric key in your region (or use existent)
   - In the root folder of the project create kms_key.yml file and copy your key (Key ID) here like
     ```
     ${stage}: your_key_here
     ```
     Where stage can be `local`, `dev`, `test` and `prod`
   - You can add any environment variables. If you need to secure them, encrypt them. Check FAQ section of this document for useful information about `env.yaml` and Serverless stage parameters.

   - Copy the value of variable and run the command in the root of the project
     ```
     sls env --attribute VARIABLE_NAME --value variable_value --stage your_stage --encrypt
     ```
   - If you use some common variables, like

     ```yaml
     common: &common
       MY_SHARED_VAR: <encrypted content>

     local:
       <<: *common
     ```

     The plugin will add these variables to all stages, but we don't want it. So after encrypting, copy encrypted value
     of the new variable, revert changes and paste it to the right place.

   - You are ready for deploying

3. Deploy
   - Run the command in the root of the project
     ```
     npm run deploy:your_stage
     ```

### The project contains:

- The Media Info feature that uses mediainfo binary file and returns media info by url
- Examples of offline plugins and docker-compose file for working with AWS resources offline
- Examples of HTTP API and REST API endpoints with authorizers
- Examples of IAM Role Statements
- Example of different AWS resources
- Examples of models for dynamoose library
- Examples of models for sequelize library
- Examples of services for working with AWS resources
- Simple CircleCI configuration

### Project structure

- .circleci - Configuration for CI/CD
- api - Code of the features or CRUD operations of entities
  - auth - Contains authorization handler
  - backend - Contains main logic
    - data - Contains some constants
    - gallery - Module that is responsible for processing requests and sending images to the client
    - images - Contains all images for gallery
    - interfaces - Contains interfaces
    - login - Module that is responsible for checking user credentials and sending an auth token to the user
    - models - Contains db models
    - services - Contains additional services
    - signup - Module that is responsible for adding new users to DB
    - upload - Module that is responsible for uploading images to S3 and images data to DB
- config - Folder for configurations
  - serverless - TypeScript files for the description of Serverless resources
    - parts - TypeScript files for the description of Lambda function with their triggers and resources like S3 buckets, SQS, DynamoDB tables, etc.
    - gallery.ts - Contains description for Lambda function that is responsible
    - login.ts - Contains description for Lambda function that is responsible for validating user and login
    - signup.ts - Contains description for Lambda function that is responsible for adding new user to DB
    - upload.ts - Contains description for Lambda function that is responsible for uploading images to S3 and images data to DB
      - examples.ts - TypeScript file for description Lambda functions with their triggers for one feature
      - feature.ts - TypeScript file for description Lambda functions with their triggers for one feature
      - rest-api-cors.ts - Helper for setting up CORS for REST API
      - jobs.ts - TypeScript file for description of DynamoDB table
      - users.ts - TypeScript file for description of DynamoDB table
    - cf-intristic-fn.ts - Helper with function for CloudFormation
    - types.ts - Types for Serverless configurations
    - utils.ts - Helper for Serverless configurations
- frontend - Contains frontend logic

  - auth - This module manages login and signup
  - css - Contains css files
  - data - Contains additional data
  - gallery - Module that is responsible for getting images from a server and rendering them
  - html - Contains html files
  - interfaces - Contains interfaces
  - services - Contains additional services

- helper - All auxiliary code
  - http-api/ - Helpers for HTTP API
  - rest-api/ - Helpers for REST API
  - base-error-old_handler.ts - Base for building error handlers. Normally you should not use it in lambda.
  - environment.ts - Helper for working with environment variables
  - helper.ts - This file contains auxiliary functions
  - logger.ts - This file contains log function that helps log data in the proper way
- interfaces
- docker-compose.yml
- env.yml - Environment variables
- package.json
- README.md
- serverless.ts - Contains the main description of the service
- sonar-project.properties - Contains the configuration for static code analysis
- tsconfig.json
- loadenv.ts - load environment variable from `.env` file
- esbuild-pluings.js - load pluings for esbuild

## Static code analysis

- Start SonarQube docker container with command `npm run sonarqube:up`
- Start tests with command `npm run test`
- Start analysis with command `npm run sonarqube-verify`
- Go to http://localhost:9000
- Log in with _admin/admin_ credentials
- Now you can see the project's report

### Troubleshooting

- If you see the error `Not authorized. Analyzing this project requires authentication. Please provide a user token in sonar.login or other credentials in sonar.login and sonar.password.`,
  go to the `Administration` menu in the header -> `Security` -> scroll down and turn off `Force user authentication`.
  Do it for local usage only!

## How to add env variable

In project used https://github.com/org-redtea/serverless-env-generator that fork of https://github.com/DieProduktMacher/serverless-env-generator.

Some caveats:

- Shorthand `-v` does not work for both original plugin and forked.
- Shorthand `-c` does not work

Add kms_key.yml file with `${stage}` field and your KMS Id to the root.
For example:

```YAML
local: xxx
dev: xxx
test: xxx
prod: xxx
```

### In short:

#### Viewing environment variables

Use the following commands to read and decrypt variables from your YAML environment files:

#### List variables

```sh
serverless env
serverless env --stage $STAGE
```

#### View one variable

```sh
serverless env --attribute $NAME
serverless env --attribute $NAME --stage $STAGE

#shorthand:
sls env -a $NAME
sls env -a $NAME -s $STAGE
```

#### Decrypt variables

```sh
serverless env --decrypt
serverless env --attribute $NAME --decrypt
serverless env --attribute $NAME --stage $STAGE --decrypt

#shorthand:
sls env -a $NAME --decrypt
sls env -a $NAME -s $STAGE -d
```

#### Setting environment variables

Use the following commands to store and encrypt variables in your YAML environment files:

Note that variables are stored to the first file listed in _envFiles_.

#### Set a variable

```sh
serverless env --attribute $NAME --value $PLAINTEXT
serverless env --attribute $NAME --value $PLAINTEXT --stage $STAGE

#shorthand:
sls env -a $NAME --value $PLAINTEXT
sls env -a $NAME --value $PLAINTEXT --s $STAGE
```

#### Set and encrypt a variable

```sh
serverless env --attribute $NAME --value $PLAINTEXT --encrypt
serverless env --attribute $NAME --value $PLAINTEXT --stage $STAGE --encrypt

#shorthand:
sls env -a $NAME --value $PLAINTEXT -e
sls env -a $NAME --value $PLAINTEXT -s $STAGE -e
```

#### Set value of attribute in anchor

```sh
serverless env --anchor $ANHOR --attribute $NAME --value $PLAINTEXT

#shorthand:
sls env --anchor $ANHOR -a $NAME --value $PLAINTEXT
```

Let\`s assume we have the following `env.yml`:

```YAML
common:
  &common
  VAR: "1"

local:
  <<: *common
dev:
  <<: *common

test:
  <<: *common

prod:
  <<: *common
```

The result of the command:

```bash
$ sls env --attribute VAR --anchor common --value 2
```

will be:

```YAML
common:
  &common
  VAR: "2"

local:
  <<: *common
dev:
  <<: *common

test:
  <<: *common

prod:
  <<: *common
```

## FAQ

### What type of API Gateway event to use for lambda: REST API or HTTP API?

In most cases HTTP API is the best and cheapest choice. So, use it.
In other cases you should check [this page](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) to find out what to choose. There are a lot of differences between HTTP API and REST API.

- About REST API event in serverless docs. [Link](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).
- About HTTP API event in serverless docs. [Link](https://www.serverless.com/framework/docs/providers/aws/events/http-api/)

### "Serverless Offline only supports retrieving JWT from the headers (undefined)" error when trying to start offline

Probably, you use lambda authorizer for HTTP API. Serverless offline plugin does not support for that yet. Check the plugin repo for any updates.

### What to use: `env.yml` or [params](https://www.serverless.com/framework/docs/guides/parameters#stage-parameters)?

With [Serverless stage parameters](https://www.serverless.com/framework/docs/guides/parameters#stage-parameters) you can pass different value of a parameter depending on the stage to the serverless config. You can use it as values source for env variables for lambda like this:

```typescript
const serverelssConfig: AWS = {
  ...
  params: {
    dev: {
      MY_PARAM: '1',
    },
    prod: {
      MY_PARAM: '2',
    },
  },
  provider: {
    environment: {
      MY_PARAM: '${param:MY_PARAM}',
    },
  },
  ...
}
```

With `env.yml` you can store encrypted env variables and any env variables that will be passed to lambda on deploy. You can use it even in the serverless config as parameter like this:

```typescript
const serverelssConfig: AWS = {
  ...
  provider: {
    tags: {
      MY_TAG: `${file(./env.yml):${self:provider.stage}.MY_TAG}`,
    },
  },
  ...
}
```

In this case `MY_TAG` will be passed to lambda too. If you don\`t want that happens then use the stage parameters instead.

Here is some recommendations you may follow in you project:

- Use the stage parameters to substitute values in the serverless config. Those parameters will not be passed to lambda and only visible in the serverless config.
- Use `env.yml` to store encrypted env variables / encrypted parameters / any env variable or parameter. Keep in mind that all variables/parameters in the yml file will be passed to each lambda as env variables.
- Use the stage parameters as values source for lambda env variables if you have only a few variables.
