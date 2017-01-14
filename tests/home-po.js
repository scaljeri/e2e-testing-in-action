export default class HomePo {
    static get title() {
        return browser.element(by.tagName('h1')).getText();
    }
}