# Technical Debt
[![Build Status](https://travis-ci.org/BBQDigital/esif.svg?branch=master)](https://travis-ci.org/BBQDigital/esif)
[![Dependency Status](https://gemnasium.com/BBQDigital/e-claims.svg)](https://gemnasium.com/BBQDigital/e-claims)

Any development tasks or optimisations which need to be made should be listed here.

**Note:** If there is a task/bug manager in place to cover this then this file will not be updated.

## Tasks:
- Set up tests
- Add login/logout states and update nav accordingly
- Use gulpif to create --prod and --dev states for styles, scripts and servers
- Add namespacing to json files

## Issues
- The build system ignores JSON updates on watch. It will only work with a manual build.
- Heroku is building as a node app, work out how to build as regular apache app.
- What will happen if there is more than one of the same component on a page?