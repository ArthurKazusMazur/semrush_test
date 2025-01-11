Feature: Search on different search engines with filter options

  Scenario Outline: Searching for <keyword> using <engine> with <filter>
    Given User navigates to the "<engine>" search
    When User inputs "<keyword>" in the search input using "<engine>"
    And User filters search result with "<filter>" in the "<engine>"
    Then User sees search results filtered as "<result>" in the "<engine>"

    Examples:
      | engine | keyword | filter        | result      |
      | bing   | semrush | News          | News        |
      | bing   | semrush | Image         | Image       |
      | bing   | semrush | Videos        | Videos      |
      | google | prowly  | Past 24 hours | hours ago   |
      | google | prowly  | Past week     | days ago    |
      | google | prowly  | Past hour     | minutes ago |
