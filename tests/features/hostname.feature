# title.feature
Feature: Hello Cucumber
  As a developer
  I want to see the hostname
  So that I can read it

  Scenario: User sees the hostname
    Given I go to the demo website again
    Then I expect the hostname to be present
