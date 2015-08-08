A reimplementation of intellivision's astro smash in phaser.io

[![Build Status](https://travis-ci.org/feelingsofwhite/astrosmash.svg?branch=master)](https://travis-ci.org/feelingsofwhite/astrosmash)

# Setup
Install [Node.js](https://nodejs.org/download/) and `npm install -g gulp bower`
````
    npm install
    bower install
    gulp  
````

this builds & jshints & starts a local server on port 2003 & launches browser at it.  watch for changes & livereload.

##### Links & etc
* [Reference Video of Astro Smash](https://www.youtube.com/watch?v=cokygJeWomQ) ~ could also be pilliaged for reference graphics and audio
* [Builds](https://travis-ci.org/feelingsofwhite/astrosmash/branches) thanks to Travis CI
* [Shoot The Pointer](http://phaser.io/examples/v2/arcade-physics/shoot-the-pointer) example/tutorial

##### Todo
* make bullets bigger
* bombs (of different sizes I think?)
* big rocks sometimes split into 2 @ 45 degree
* graphics should have transparent bits
* some things rotate
* Fix laser size / drop speed / player speed
* explosions
* sounds
* cdnify phaser for release build (because I want to try that)
* instructions, launch screen that doesn't say snake
* harder as time goes on, easier after a death (group variables into config)
* earn extra lives very 1000 
* background (and color changes)
