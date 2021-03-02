# Jambonz Hosted Web Application

https://github.com/jambonz/jambonz-webapp-com

## Local development

  * Copy `.env.sample` to `.env` and fill in the environment variables
  * `npm i`
  * `npm run start`
  * Run the [jambonz-api-server](https://github.com/jambonz/jambonz-api-server-com) integration test
  * Go to http://localhost:3001


## Build for production

  * `npm run build`
  * Web application will be saved as static files in the `build/` directory


## Other

  * `npm run serve` can be used to test a production build locally
  * This version also runs on http://localhost:3001


## Application structure

  * `src/index.js`: the starting point of the app, includes React context providers
  * `src/Routes.js`: the primary component called by `src/index.js`, it lays out all routes for the application
  * `src/pages/`: contains application web pages in a structure similar to the final URL of the page
  * `src/components/`: contains the React components used to build the UI
  * `src/components/templates`: imported in the Routes.js file, these don't re-render on page transitions
  * `src/components/wrappers`: imported in each page's file, useful for triggering code on every page transitions (e.g. to close any open menus)


## Misc notes

  * Email verification codes are logged to the console if `process.env.NODE_ENV === 'development'`
  * Links and buttons use a nested span with tabindex="-1" in order to allow styling that only applies to keyboard focus ([reference](https://stackoverflow.com/a/45191208/8742362)). When changing the styling on these elements, make sure that the span always fills the entire parent element, otherwise you may end up seeing keyboard focus styling when clicking, and may get other strange styling bugs.

## Developer notes
  * [remaining task list](docs/0-task-list.md)
  * [links to figma designs](docs/design-links.md)
  * [notes on changes required to handle 401 session timeouts](docs/handle-401-session-timeouts.md)
  * [list of react routes used in the app](docs/routes.md)
