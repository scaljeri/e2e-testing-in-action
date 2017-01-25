# Selenium/Protractor in action  [![Browserstack.com](/browserstack-logo-small.png)](https://browserstack.com) ![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=ZzRLRjE1ZC9mUUlUTmJWQlFNVVVnTFBTb2ZjS3NGNEJUNTN6c1dDcWtlcz0tLStVZFlpL1ZKOC9QeTNpSUNXVHM5Snc9PQ==--e4b37358ed234afa202b7aea2363783991dd02a6)

This project demonstrates how to test a website with pure node, selenium, protractor or mocha. It can test against
browsers on your local machine or remote on [Browserstack](https://www.browserstack.com) in parallel.

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

### Known issues

   * With `--selenium-standalone` Safari and Firefox don't work
   
### TODO

  * Add webdriverio
  * Add Nichtwatch and Cucumber
