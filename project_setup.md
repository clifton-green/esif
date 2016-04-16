#Project setup

## Tech stack

- Nunjucks (builds HTML, currently isometric but could be easily configured to work client-side)
- Stylus (Builds CSS - Also uses Rupture and Jeet for the media queries and grid system respectively)
- Gulp (Build tool)
- Webpack (Package bundler)
- Express (Server for deployment)
- Node (only used for preprocessing and Express)

The site also uses Jasmine and Karma but no tests have been configured at this moment.

## Installation

Using a command line tool, navigate to the root of the project and type:

`$ npm install`

This will install all of the project dependencies and will perform an initial run of the project, it does a production build when installed and can be immediately deployed at this stage if you wish. It can also be run locally on express by running:

`npm start`

## Running the development build.

To get a development build running (unminified and has access to devtools), there are two options depending on what server you want to run.

If you want to stick with Express then type:

`gulp build --prod`

However I recommend using the server provided by the gulp build, this has BrowserSync installed which includes a live reloading function and also a synchronised server for multi-device testing. To run this, make sure gulp is installed globally (`sudo npm install -g gulp`) and then type:

`gulp serve`

Each server runs from a different port (Express: 5000, Gulp: 3000) so if you want, you can run them both together. BrowserSync also provides additional development tools which can be accessed on port 3001.

## Deployment and Continuous Integration

The project is configured to work with Travis and Heroku, it currently requires a commit from my own e-claims repository so it will need to be set-up to work with your own repo and your own Travis and Heroku accounts.
