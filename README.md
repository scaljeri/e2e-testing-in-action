# Selenium/Protractor in action  ![Browserstack.com](https://www.browserstack.com/images/layout/browserstack-logo-600x315.png)

Current status: 

  - Selenium: ![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=Vkc0bG1LUnNUamFqaVc3bXQwb25KQUxwK1RPeUcxa00vSXRKL3lhSjNkRT0tLTZWaU10OVRBenVwbGZHWW5SUXFhTVE9PQ==--e06bf79a2f3be0aca95729d635ef06e93756f4ea)
  - Protractor: ![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=cDVXTFZ2ZDFTTzlIRmhlcFRzNnBRZVNucDdMbjJzclhRWEx6bHZRWXJjaz0tLWRXZ1BLMUtzbG1zUnpTcy9UQmNKemc9PQ==--3e90e1e845606bef401c7afd094a5771a93a6c4b)
  - Mocha: ![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=OHg5QndXVDA1M1I5ZVlpZWIzTlFOcnFrUCsxT1lHRUszbDFVeW4rSDIxdz0tLVJlVzZ2Vkt6d2VocjB5bWFDYUp2VkE9PQ==--09c38fbfc7598d8d7421542f233f2bc6ac6f1681)

This project demonstrates how to test a website with selenium, protractor or mocha. It can test against
browsers on your local machine or remote on [Browserstack](https://www.browserstack.com) and in parallel.

To make it all a bit more challenging, the demo-test site is protected with Basic Authentication :)

In this README I only list the available commands, but for a more in-depth discussion please checkout 
[this](https://scaljeri.github.io/selenium-protractor-browserstack/) article.

#### Run the demo site

    $> docker run -d --name web dockercloud/hello-world
    $> docker run -d -p 80:80 --link web:web --name auth beevelop/nginx-basic-auth

The demo site can be accessed via `http://localhost` with username `foo` and password `bar`

#### Setup
TODO: yarn install, download drivers, selenium jar, Browserstack tunnel, FF 47

#### Local

    $> npm start                                    // nodeJs without selenium - headless
    $> npm start --  --browser firefox              // selenium with Firefox
    $> npm test:mocha -- --browser chrome           // Mocha 
    $> npm test:protractor -- --browser safari      // Protractor
    
TODO: More??

#### Remote

    $> ./BrowserStackLocal --key <key>
    $> npm start -- --browser ie --browser-version=9 --os=windows --os-version=7 --browserstack-user <user> --browserstack-key <key>
    $> npm run test:mocha -- --browser firefox --browsertsack-user <user> --browserstack-key <key> // remote
    $> npm run test:protractor -- --browser firefox --browsertsack-user <user> --browserstack-key <key> // remote
    
TODO: More??
    
#### Selenium standalone

    $> TODO start selenium
    $> npm start -- --browser firefox --selenium-standalone
    
TODO: More??
    
