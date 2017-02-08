# E2E testing in action  

[![Browserstack.com](/browserstack-logo-small.png)](https://browserstack.com) 

![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=SW5jemxFMi9URmh6SEtGOC9yN0dlRzZlME5Vd3RWYklTd0xMRHlLOEhmQT0tLWthYzAwM0xaaVBiRmpORTV0SXR1RVE9PQ==--fe0340b981aedb79e9f8271da1c6c0d0f92e1e17)

This project demonstrates how to test a website with pure node, cucumber, protractor and webdriverIO using mocha/chai. Depending on 
your needs this project can serve as just a reference or a tutorial on how to setup automated testing.

This project will demonstrate how to run tests against different browsers on your local machine or remote using 
[Browserstack](https://www.browserstack.com) even in parallel.

To make it all a bit more challenging, the demo-test site is protected with Basic Authentication :)

Checkout [this](https://scaljeri.github.io/e2e-testing-in-action/) article for an in-depth discussion plus examples of how to run 
all this code.

#### Demo Site
The run the site you will need docker installed before you can start the demo site

    $> docker network create my-test-network
    $> docker run -d --network=my-test-network --name web dockercloud/hello-world
    $> docker run -d -p 80:80 --network=my-test-network --name auth beevelop/nginx-basic-auth
    
or you can do it with `docker-compose`

    $> docker-compose up -d
    
or simply do
 
    $> yarn serve

The demo site can be accessed via `http://localhost` with username `foo` and password `bar`. 

When you're done testing make sure to clean up

    $> yarn cleanup // Stop and remove all docker containers
    $> docker rmi $(docker images -q) // Remove all docker images

#### Setup

    $> yarn install
    
In order to user the demo site on [Browserstack](https://browserstack.com) you have to enable [Local Testing](https://www.browserstack.com/local-testing)
and download the `BrowserStackLocal` binary. Run this binary before you start testing 

    $> ./BrowserStackLocal --key <access-key>
    
Your username and access-key can be found under `Account -> Settings`

### Local testing
To be able to run the tests on your laptop or pc you have a couple of options. You can use the  browser-drivers directly

  * [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/downloads), 
  * [geckodriver](https://github.com/mozilla/geckodriver/releases/). 
  
The only way I was able to test against Firefox which actually worked was via the geckodriver.

The second way, is with the selenium standalone server, which can be started as follows

    $> yarn selenium
    
And the third way is, is a combination of both combined in a docker image

        $> docker run -p 127.0.0.1:4444:4444 selenium/standalone-chrome:latest
        
or

        $> docker run -p 127.0.0.1:4444:4444 selenium/standalone-firefox:latest

It's like headless testing, all made possible by the [XVFB](http://tobyho.com/2015/01/09/headless-browser-testing-xvfb/)
project. 

### Tasks 

As you can see at the top of this README, Browserstack has a [badge](https://www.browserstack.com/automate/status-badges),
which is nice and it informs you about the status of your tests. If a test session fails, the badge will became red. Which 
is a good thing of course. However, it will remain red forever until you remove the failed session or you update the session 
and pass it yourself. 

So, a test-run on browserstack to is called a session, which belongs to a build and a build sits in a project. 
A badge belongs to a project and a session can pass or fail. 

To remove a project with all its builds and session simply do
  
    $> ./tasks/clean-browserstack-project --browserstack-user <user> --browserstack-key <access-key> [--project project name]
    
but you can also update/delete failing sessions as follows

    $> ./tasks/process-failed-sessions --browserstack-user <user> --browserstack-key <key> [--project project name]
    
If you would like a badge for a project do
  
    $> ./tasks/badge.js --browserstack-user <user> --browserstack-key <key> [--project project name]
    
it will output the badge code in Markdown and HTML.

### Known issues

   * With `--selenium-standalone` Safari and Firefox don't work
