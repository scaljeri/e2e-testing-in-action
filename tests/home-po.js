import webdriver from 'selenium-webdriver';

export default class HomePo {
    static get title() {
        let browser = global.browser;

        // Support Protractor and selenium
        return (browser ? browser.driver : driver).findElement(webdriver.By.tagName('h1')).getText();
    }
}