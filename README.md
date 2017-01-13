# protractor-basic-auth
How to use basic authentication together with Protractor

### Bookmarks

   - docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/firefox/index.html
   - protractor: https://github.com/juliemr/protractor-demo
                 http://stackoverflow.com/questions/25873378/set-firefox-profile-with-protractor
                 https://github.com/juliemr/protractor-demo/blob/master/howtos/setFirefoxProfile/helper.js
   - geckodriver: https://github.com/mozilla/geckodriver/releases/
   - FF versions (47 needed): https://ftp.mozilla.org/pub/firefox/releases/
   - Protractor changelog: https://github.com/angular/protractor/blob/master/CHANGELOG.md

### start server

    $> docker run -d --name web dockercloud/hello-world
    $> docker run -d -p 80:80 --link web:web --name auth beevelop/nginx-basic-auth
    
TODO: Replace --link with something else: https://docs.docker.com/engine/userguide/networking/default_network/dockerlinks/

### FF

prevent auto update:

app.update.auto - false

app.update.enabled - false

app.update.silent - false