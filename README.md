# cordova-media-gen

[![Build Status](https://travis-ci.org/hypery2k/cordova-media-generator.svg?branch=master)](https://travis-ci.org/hypery2k/cordova-media-generator) [![npm version](https://badge.fury.io/js/cordova-media-gen.svg)](http://badge.fury.io/js/cordova-media-generator) [![Dependency Status](https://david-dm.org/hypery2k/cordova-media-generator.svg)](https://david-dm.org/hypery2k/cordova-media-generator) [![devDependency Status](https://david-dm.org/hypery2k/cordova-media-generator/dev-status.svg)](https://david-dm.org/hypery2k/cordova-media-generator#info=devDependencies) 

> CLI Utility that generates Cordova / Phonegap image assets required for app store submission, icons, and splash screens. 


[![NPM](https://nodei.co/npm/cordova-media-gen.png)](https://nodei.co/npm/cordova-media-gen/)

It requires your logo to have a solid background colour but does not distort or lose any image content so everything is at the maximum size without loss.

## Installation

Need imagemagick

On Debian/Ubuntu:

```bash
sudo apt-get install imagemagick
```

on OS X:

```bash
brew install imagemagick
```

```bash
$ npm install -g cordova-media-generator
```

Once installed, cd to the root of your Cordova application and run:
```bash
$ cordova-media-gen <logofilename.jpg> <backgroundcolourinhex-egFFF>
```

### example

```bash
$ cordova-media-gen logo.jpg fff
```

To create the config 

```bash
$ cordova-media-gen init
```

If you have created a `mediagen-config.json` file (see below), you can just run:
```bash
$ cordova-media-gen
```

This will overwrite all logos and splash screen images in the `<projectdir>/platforms` directory with the correct sizes and in the correct location for Cordova (As at 3.5)
> The recommended image or logo size is 2000px x 2000px. Its not a problem if the logo isn't square.

It also creates a `<projectdir>/Media` directory that has images for the Apple and Android stores such as an app icon.

## Custom Assets
You can create additional custom images if you need to submit to alternative app stores or have other needs that we haven't thought of yet.

Simply go to your project directory and run
```bash
$ cordova-media-gen init
```

It will create an example file called `mediagen-config.json` which you can now edit. Add as many or few files as you need to the array.

> Note: The default path for files is the `<projectdir>/platforms` directory, you might need to use `../` as in the example below

###Example `mediagen-config.json`
```javascript
{
    "icon": {"filename":"icon.png","background":"fff"},
    "splash": {"filename":"splash.png","background":"fff"},
    "customImages": [
        {"width": 120, "height": 120, "path": "../Media/custom", "filename":"outputFilename.png", "source":{"filename":"image.png","background":"fff"}}
    ],
    "screenshots": [
        {"url":"http://www.google.com", "name":"homepage"}
    ]
}
```

##Screenshots (Experimental)
Screenshots are a new feature that use PhantomJS to quickly generate a number of the screenshot assets you need when submitting to the app store. You need your local development server running when you execute `mediagen` so it can access the Cordova versions of the files. Of course this won't be able to access a number of things in lots of apps but hopefully it should get you up on the app store pretty quickly.
This is still pretty experimental, and also please be aware that it may seem to hang for a minute or so before you see the screenshots being generated (it does need to visit the page each time!)


##Config
The config variables are below:

- icon: icon image
    - filename: path to source filename
    - background: solid colour in hex
- splash: splash image
    - filename: path to source filename
    - background: solid colour in hex
- custom images: an array of custom image objects for additional media if desired
    - width: the width of the image in pixels
    - height: the height of the image in pixels
    - path: the directory to save the output
    - filename: the output file name with extension
    - source: the source file, same definition as an icon or splash above
        - filename: path to source filename
        - background: solid colour in hex
- screenshots: An array of screenshot objects
    - url: url to your local development server
    - name: name of the page for easy reference later on