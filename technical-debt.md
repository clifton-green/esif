# Technical Debt
[![Build Status](https://travis-ci.org/BBQDigital/esif.svg?branch=master)](https://travis-ci.org/BBQDigital/esif)
[![Dependency Status](https://gemnasium.com/BBQDigital/e-claims.svg)](https://gemnasium.com/BBQDigital/e-claims)

Any development tasks or optimisations which need to be made should be listed here.

**Note:** If there is a task/bug manager in place to cover this then this file will not be updated.

## Tasks:
1. Set up tests (jasmine and casperjs/spooky)
2. Add login/logout states and update nav accordingly
3. Use gulpif to create --prod and --dev states for styles, scripts and servers

## Issues
1. The build system ignores JSON updates on watch. It will only work with a manual build.

## Limitations
- Components can't be repeated on the page. It seems this will add a javascript dependency
  This can't be justified as multiple components are not worth adding a client side server request.
