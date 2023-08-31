# Bayborhood
A website designed for people to be find the perfect neighborhood in San Francisco.

Deployed on: [https://keen-paletas-32a008.netlify.app](https://keen-paletas-32a008.netlify.app)

## Table of Contents

- [General Info](#general-information)
- [GitHub Repo](#github-repo)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)

## General Information
This project was built independently in two weeks using React and Jupyter Notebook.

## GitHub Repo

- [Monorepo] https://github.com/roylee0912/bayborhood

## Technologies Used

- NodeJS (v16), and npm
- React 17.0.2
- React-Router-Dom 5.3.3
- Jupyter Notebook
- Mapbox GL JS

See Environment Setup below for instructions on installing these tools if you
don't already have them.

## Environment Setup

### Clone repository

**clone** the project repository from github: [https://github.com/roylee0912/revieword](https://github.com/roylee0912/bayborhood)

```console

$ git clone https://github.com/roylee0912/bayborhood
```

### Install NodeJS

Verify you are running a recent version of Node with:

```sh
node -v
```

If your Node version is not 16.x.x, install it and set it as the current and
default version with:

```sh
nvm install 16
nvm use 16
nvm alias default 16
```

You can also update your npm version with:

```sh
npm i -g npm
```



### Application Install

Add a .env file in the root directory, and add a token from Mapbox named "REACT_APP_TOKEN." 

You can make a token [`here`](https://docs.mapbox.com)


When you're ready to start building your project, run:

```sh

cd bayborhood
npm install
npm start


```
## Usage

<div style="width:400px ; height:400px">

</div>

1. [`Select Features`] Click on various features on the sidebar to add filters that are important to you. The neighborhoods will automatically be shaded lighter or darker depending on their proximity to those specific features. Click on the +/- at the top right of the map to zoom in or zoom out, click and move the mouse around to move the map, and select additional features under select filters to specify even further. Click on "Show Quadrants" to color in the different quadrants of San Francisco different colors.

<img width="1658" alt="Screenshot 2023-08-30 at 6 19 45 PM" src="https://github.com/roylee0912/bayborhood/assets/60560932/ed3279ca-352f-4bb5-b8cd-598b88cde374">




2. [`About`] Click the i icon next to "Bayborhood" to open an about page and see where we got our data from.
<img width="1658" alt="Screenshot 2023-08-30 at 6 25 28 PM" src="https://github.com/roylee0912/bayborhood/assets/60560932/2b335cf1-3655-4030-ba56-c12d924f1221">




## Project Status

- Project is: _in progress_.

## Room for Improvement
- Add proximity to location using Bing Maps Isochrone API
- Add a priorities list for different features to affect the neighborhoods differently
- Update responsiveness of drag
