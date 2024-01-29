# Haig Fras Digital Twin Project: Frontend

The Digital Twin project for Haig Fras aims to create a system representing a Digital Twin for the Haig Fras environmental protection area in the Celtic Sea.

This app is coded in React, with the ability to interact with various data formats on both the backend and frontend. This project relies on several backend services to perform tile server activities, as well as handle authentication and data calculations.

All files used by the frontend are available in an Object Store. Currently, we are using Object Stores compatible with the AWS API, such as JASMIN and Oracle Cloud.

## Access

This app is currently running on Jasmin and Oracle Cloud and can be accessed via the following links:
- [https://imfe-pilot.noc.ac.uk/](https://imfe-pilot.noc.ac.uk/)
- [https://haigfras-salt.co.uk/](https://haigfras-salt.co.uk/)

## Run this project

In the project directory, you can run:

### `npm install`

This command will install all the npm packages listed in the package.json file.

### Set ENV variables

You need to create a .env.development file and add the following environment variables:

```.env
VITE_MAPBOX_API_KEY=
VITE_WEBSITE_JSON_URL=/website.json
VITE_LAYERS_JSON_URL=https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/frontend/layers.json
VITE_LAYERS3D_JSON_URL=https://pilot-imfe-o.s3-ext.jc.rl.ac.uk/haig-fras/frontend/layers.json

VITE_SERVER_ENDPOINT=
VITE_CESIUM_TOKEN=
VITE_JASMIN_OBJECT_STORE_URL=

VITE_MBTILES_URL=https://imfe-pilot-mbtiles.noc.ac.uk/
VITE_API_URL=https://imfe-pilot-api.noc.ac.uk/
VITE_TILE_SERVER_URL=https://imfe-pilot-tileserver.noc.ac.uk/

VITE_ENV=DEV
VITE_LOGIN=0
VITE_ORCID_CLIENT_ID=
VITE_ORCID_CLIENT_SECRET=
VITE_365_CLIENT_ID=
VITE_365_TENANCY_ID=
VITE_365_REDIRECT_URI=
```

You can request access to these variables from the repository owner.

It's important to note that to disable authentication, you need to set the VITE_LOGIN variable to "0"; otherwise, it will prompt you to authenticate.

### `npm run dev`

This command runs the app in development mode. Open [http://localhost:8080](http://localhost:8080) to view it in your web browser.

The page will automatically reload if you make edits, and any lint errors will be displayed in the console.

### `npm run build`

This command builds the app for production in the `build` folder. It bundles React in production mode and optimizes the build for the best performance. The build is minified, and the filenames include hashes. Your app is then ready for deployment.

## Run script in production

```bash
docker build --progress=plain -t frontend .
docker run -p 8080:80 -d frontend
```

## CI/CD Pipeline

This repository includes an automatic GitLab CI/CD pipeline for continuous integration and continuous deployment. It is divided into three jobs:

**Build:**

This job builds the Docker container and tags it as `docker-repo.bodc.me/oceaninfo/imfe-pilot/frontend:latest` or `uk-london-1.ocir.io/lrl8vbuxj1ma/frontend:latest`.

**Deploy:**

This job pushes the built container to the BODC container registry. It then SSHs into the host called "web," pulls this container, and restarts it. This requires a GitLab Runner user to be present on both the build and web VMs. An SSH key needs to be configured to allow the build to SSH into web. The salt rules repository will create the user and allow a manually generated key to log in, but it doesn't create that key. If you reinstall these VMs, you'll need to create new SSH keys and update the salt rules (`salt/user/gitlab-runner.sls`) with the new keys.

**Tests:**

This job tests your frontend application using the code described in the repository [https://git.noc.ac.uk/ocean-informatics/imfepilot/frontend_test](https://git.noc.ac.uk/ocean-informatics/imfepilot/frontend_test).