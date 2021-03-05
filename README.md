# BCMS - Plugin Starter

If there is a need to add custom functionality to the BCMS, there are 2 options:

- Simple one is to create [functions](https://github.com/becomesco/cms#functions), [events](https://github.com/becomesco/cms#events) and/or [jobs](https://github.com/becomesco/cms#jobs) to implement some custom functionality,
- The other one is by create a BCMS Plugin, which is explained in this document.

Plugins are powerful yet simple to develop. In addition to that they are encapsulated, therefore if is highly unlikely to make the BCMS unstable.

Each BCMS Plugin (in continuation of the document just Plugin) can consist of 2 parts:

- Backend - exposes backend API and alow creation of new REST APIs, access to the database and caching system,
- Frontend/UI - exposes UI API, SDK and components so creating custom UI is very simple and fast. It is important to have in mind that a Plugin cannot edit existing UI elements because it is encapsulated and available on the separate route `/dashboard/plugins/{PLUGIN_NAME}`.

## Getting Started

- Clone this repository: `git clone git@github.com:becomesco/cms-plugin-starter my-bcms-plugin`,
- Install project dependencies: `npm i`,
- Start a backend development server: `npm run dev:backend`,
- On other terminal window/tab, start a frontend development server: `npm tun dev:ui`. Have in mind that UI requires a backend to be developed.
- Open browser and navigate to `localhost:1280` and you will see screen from the Figure 1. Server secret will be printed in the backend console and you can copy/paste while other information is defined by you.

![Figure 1](/assets/readme/fig1.png)

*Figure 1 - Create admin screen.*

- Once admin user is created, you will be redirected to the dashboard. If you want to share database with the other members of the development team, remove `bcms.db.json` from the `.gitignore` file.
- The Plugin is located under **Plugins** section of the side navigation. If you haven't modified the code from the repository, you will see the same screen like shown in Figure 2.

![Figure 2](/assets/readme/fig2.png)

*Figure 2 - Plugin screen*