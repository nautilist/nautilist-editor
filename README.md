# Nautilist Web Editor
> A reactive web editor for making nautilist lists built on Choo.js

Should be living at the moment at: https://nautilist-editor.herokuapp.com/
TODO: figure out how to host on github. Right now the URL's don't resolve well when using nautilist.github.io/nautilist-editor because the resources living in the /dist folder are served at: nautilist.github.io ==> basically need to fix the site.baseUrl somehow :) 

![web editor sketch](assets/web-editor.png)

## About 
> Inspired by some of the helpful data editing tools out there (e.g. geojson.io or the P5js Web Editor), we bring you nautilist web editor - a super simple, no frills web editor to help you make lists of URLs, export, and share them across the web. 


## Features (forthcoming!)

- Allow for posting and remixing public lists served from nautilist-server

## Setup

Install the dependencies
```sh
npm install
```

## Heroku Deployment

Using the Heroku static page buildpack: https://github.com/heroku/heroku-buildpack-static

Add it to your project
```
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git -a nautilist-editor
```

Build it!
```
git push heroku master
```


## Commands
Command                | Description                                      |
-----------------------|--------------------------------------------------|
`$ npm start`          | Start the development server
`$ npm test`           | Lint, validate deps & run tests
`$ npm run build`      | Compile all files into `dist/`
`$ npm run create`     | Generate a scaffold file
`$ npm run inspect`    | Inspect the bundle's dependencies