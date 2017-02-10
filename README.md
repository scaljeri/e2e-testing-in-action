# E2E testing in action  

[![Join the chat at https://gitter.im/scaljeri/e2e-testing-in-action](https://badges.gitter.im/scaljeri/e2e-testing-in-action.svg)](https://gitter.im/scaljeri/e2e-testing-in-action?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Dependency Status][depstat-image]][depstat-url] ![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=SW5jemxFMi9URmh6SEtGOC9yN0dlRzZlME5Vd3RWYklTd0xMRHlLOEhmQT0tLWthYzAwM0xaaVBiRmpORTV0SXR1RVE9PQ==--fe0340b981aedb79e9f8271da1c6c0d0f92e1e17)


[![Browserstack.com](/browserstack-logo-small.png)](https://browserstack.com) 



This project demonstrates how to test a website with pure node, selenium, protractor and webdriverIO using cucumber or mocha/chai. Depending on 
your needs this project can serve as just a reference or a tutorial on how to setup automated testing.

You can run tests against different browsers locally or remote using [Browserstack](https://www.browserstack.com) even in parallel.

To make it all a bit more challenging, the demo-test site is protected with Basic Authentication :)

Checkout [this](https://scaljeri.github.io/e2e-testing-in-action/) article for an in-depth discussion plus examples of how to run 
all this code.

#### Demo Site
To start the demo-site you will need docker! Docker is awesome and it only taks three commands to get our site up and running

    $> docker network create my-test-network
    $> docker run -d --network=my-test-network --name web dockercloud/hello-world
    $> docker run -d -p 80:80 --network=my-test-network --name auth beevelop/nginx-basic-auth
    
or just one if we use `docker-compose`

    $> docker-compose up -d
    
or simply do
 
    $> yarn serve

The demo site can be accessed via `http://localhost` with username `foo` and password `bar`. 

When you're done testing make sure to clean up

    $> yarn cleanup // Stop and remove all docker containers
    $> docker rmi $(docker images -q) // Remove all docker images

#### Setup

    $> yarn install

### Local testing
Running test on your laptop or pc will not work just out of the box and you have a couple of options. 
You can use the  browser-drivers directly

  * [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/downloads), 
  * [geckodriver](https://github.com/mozilla/geckodriver/releases/). 
  
Put the drivers in the root of this project. This was the only way firefox worked correctly for me.
  
The second way is with the selenium standalone server, which can be started as follows

    $> yarn selenium
    
And the third way is a combination of both combined in a docker image

        $> docker run -p 127.0.0.1:4444:4444 selenium/standalone-chrome:latest
        
or

        $> docker run -p 127.0.0.1:4444:4444 selenium/standalone-firefox:latest

It's like headless testing, all made possible thanks to [XVFB](http://tobyho.com/2015/01/09/headless-browser-testing-xvfb/).

### Remote testing with Browserstack
If you don't have a [Browserstack](https://browserstack.com) account yet you can sign-up for free. 
This will give you access to endless time of testing fun. Next, goto `Account -> Settings` and scroll to the bottom of the page, there you will find
credentials that are needed for automated testing.

Because the demo site is running locally, you have to enable [Local Testing](https://www.browserstack.com/local-testing)
on [Browserstack](https://browserstack.com). Finaly, download the `BrowserStackLocal` binary and run it

    $> ./BrowserStackLocal --key <access-key>
    
### Tasks 

As you can see at the top of this README, Browserstack has a [badge](https://www.browserstack.com/automate/status-badges),
which is nice and it informs you about the status of your tests. If a test session fails, the badge will became red. Which 
is a good thing of course. However, it will remain red forever until you remove the failed session or you update the session 
and pass it yourself. 

So, a test-run on browserstack is called a session, which are grouped in a build and builds belong to a project. 
A badge belongs to a project and sessions can pass or fail. 

Now, with all that in place, lets checkout the tasks available:

To remove a project with all its builds and session simply do
  
    $> ./tasks/clean-browserstack-project --browserstack-user <user> --browserstack-key <access-key> [--project project name]
    
but you can also update/delete failing sessions within a project 

    $> ./tasks/process-failed-sessions --browserstack-user <user> --browserstack-key <key> [--project project name]
    
If you would like a badge for a project do
  
    $> ./tasks/badge.js --browserstack-user <user> --browserstack-key <key> [--project project name]
    
it will output the badge code in Markdown and HTML.

### Known issues

   * Firefox doesn't work with the selenium standalone server

[depstat-url]: https://david-dm.org/scaljeri/e2e-testing-in-action
[depstat-image]: https://david-dm.org/scaljeri/e2e-testing-in-action.svg
