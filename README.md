# Selenium/Protractor in action  

[![Browserstack.com](/browserstack-logo-small.png)](https://browserstack.com) 

![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=TUw2dklNeE55eFo2R0hhOUxsOUI4TEtrc2pYOHBRNjc1V1FQeDJWd3dxVT0tLVVtdEtpNkR0RVBYUGl1eVJvVG95Z1E9PQ==--0957640239f22fcfe802876eb57b63b603c704f6)

This project demonstrates how to test a website with pure node, selenium, protractor or mocha. Depending on 
your needs this project can serve as a reference guide or a tutorial on how to setup automated testing.

This project will demonstrate how run run tests against different browsers on local machine or remote using 
[Browserstack](https://www.browserstack.com) in parallel.

To make it all a bit more challenging, the demo-test site is protected with Basic Authentication :)

A more in-depth discussion with examples of how to run the test checkout [this](https://scaljeri.github.io/selenium-protractor-browserstack/) article.

#### Demo Site

    $> docker run -d --name web dockercloud/hello-world
    $> docker run -d -p 80:80 --link web:web --name auth beevelop/nginx-basic-auth

The demo site can be accessed via `http://localhost` with username `foo` and password `bar`

#### Setup

    $> yarn install
    $> ./node_modules/.bin/webdriver-manager update
    
In order to user the demo site on [Browserstack](https://browserstack.com) you have to enable [Local Testing](https://www.browserstack.com/local-testing)
and download the `BrowserStackLocal` binary. 

    $> ./BrowserStackLocal --key <browserstack-key>
    
Your username and access-key can be found under `Account -> Settings`

For locally testing without `selenium-standalone` you also need to download the [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/downloads)
and [checkdriver](https://github.com/mozilla/geckodriver/releases/) and place them in the root of this repository. Finally, 
download the [selenium standalone server](http://www.seleniumhq.org/download/)

Currently this will only work for Firefox 47 for local testing.

### Tasks 
I've created these script so that I can manipulate projects, builds and sessions on [Browserstack](https://browserstack.com). 
I hear you wandering, why would you ever want to do that? And the answer is, the [browserstack badge](https://www.browserstack.com/automate/status-badges).

As you can see, I have a Browserstack badge on this page (hopefully its green at the moment!). A badge is connected to a 
browserstack project (e.g. `Selenium Protractor tests`). Inside a project you have builds (e.g `mocha test` or `protractor 
tests`) and each build has session (a test run). If a session fails the badge will be red for ever. It doesn't matter how 
many passed session follow. The only solution at the moment is to remove the failed session or update its status to `passed`
 
To remove a project with all its build and session simply do
  
    $> ./tasks/clean-browserstack-project --browserstack-user <user> --browserstack-key <key> [--project project name]
    
If you would like a badge for a project do
  
    $> ./tasks/badge.js --browserstack-user <user> --browserstack-key <key> [--project project name]
    
it will output the badge code in Markdown and HTML.

### Known issues

   * With `--selenium-standalone` Safari and Firefox don't work
   
### TODO

  * Add webdriverio
  * Add Nichtwatch and Cucumber
