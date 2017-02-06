# title.feature
Feature: Hello Cucumber
  As a developer
  I want to see the demo website
  So that I can see the awesome title

Scenario: User sees the title
  Given I go to the demo website
  Then I expect the title to be "Hello world!"
