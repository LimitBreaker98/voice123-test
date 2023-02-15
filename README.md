# voice123-test

## Author

Jorge Andres Esguerra (LimitBreaker98 on github)

## Application Setup Guide

This is a Vite + React application.

Vite provides frontend tooling much like Create React App.  
While Create React App is the better known project starter for React applications, Vite is actively being developed and has more up-to-date support.

### Prerequisites

This project requires you to have node and npm installed.

### Step 1: Get all the necessary packages for running the project

```
    npm install
```

### Step 2: Run the frontend server

```
    npm run dev
```

## Worklog

Initial project setup

| Task                                                                                      | Time                                                          |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Exploring the API responses and playing with the provided API via Postman                 | 2 Hours initially, then sparringly during project development |
| Initial project setup (upgrading node, npm, installing vite, react, material UI)          | 30 min                                                        |
| Project frontend base structure (Title and Subtitle, Search Component, Voice Actor Grid ) | 4 hours                                                       |
| Voice Actor Card implementation (Basic Card Layout with image, link to voice123 profile)  | 2 hours                                                       |
| Media Player implementation                                                               | 1 hour                                                        |
| Highlighted text implementation                                                           | 4 hours                                                       |
| Final refactoring and manual testing                                                      | 2 hours                                                       |

Note: Highlighted text was the most challenging part of the project since there is no specification on how the provided API endpoint for search uses the keywords parameters to filter the returned voice actors.

As such, I had to assume that the matching text could come from any of the string fields for each returned Voice Actor object.

I used postman to try to discern which fields are being used in the search filter via trial and error, but there is simply too many fields to manually test this. Therefore, I decided to instead search for the matching text in all of the string fields of the Voice Actor object and return the first coincidence.

## Future improvements and recommendations

- Improved highlighted text functionality

  - First, the backend API for the search has to be studied and understood so that the specific criteria for returning a particular Voice Actor based on the passed keywords is unambiguous for me.
  - Once I know those rules, I propose two approaches for improving.

    1. Modify the backend endpoint so that every Voice Actor Object has an additional field "reason_for_selection".

       - This field's value will be the name of another field, namely, the one used by the backend to determine that such a Voice Actor complies with the keywords used for lookup.
       - With this field, we can eliminate the code that finds the matching text inside the flattened object representation of the Voice Actor data. The backend allows us to immediately know which field has the matching text and we proceed to just render it properly in the Frontend.

    2. Change the StringUtils functions so that they do not have to flatten the whole Voice Actor object before searching. I can eagerly search only the fields that I know that the backend uses for the search function.

Approach 2 takes less time to implement but it is unsustainable in the long run, since every time that the backend API search functionality is modified (e.g a new criteria is considered for the filtering) then I would need to change the front end code.

Approach 1 may take a bit longer since the API has to be modified, but once implemented the concern of finding the text is removed from the frontend. The frontend can now just render the matching text and the backend is responsible for providing exactly this information.

- Caching

  - With more time I can implement Caching throughout the project.
    - At the moment, the pagination implementation is not Caching the responses every time we change pages.
      - The [TanStack Query Library (Previously known as React Query)](https://tanstack.com/query/latest/docs/react/overview) library could be leveraged to cache fetching and improve query management in the app. This would also introduce a new dependency for the project but the trade-off is worth it, since this library is actively being developed.

- Better UI styles

  - I have not had much experience designing UI's but with the help of other team members who have more experience, the styles of the app may look better. For example, using the CircleAvatar component to show the picture of every Voice Actor could help the look and feel of the app.

- Internationalization

  - If we have enough traffic from non-english speaking countries, I would consider adding internationalization support to the app. I'd use the [react-intl](https://www.npmjs.com/package/react-intl) package for this, since I've previously used it.

- Backend improvements
  - At the moment, the provided backend returns an array of objects, where every object represents a Voice Actor. During my investigation of the responses, I figured out that some fields are repeated and redundant. I do not know the underlying implementation of our backend and what kind of DB it uses, but I could study how it is implemented and suggest improvements to reduce the redundancy of the data. This helps us storage wise and also improves the onboarding experience for new devs onto the codebase.

## Space for ideas during development

- The API provides data of voice over providers for services a customer may require.
- The API already has some kind of text based search where it uses all the provided keywords as a filter for possible candidates, according to their data.
- The API is paginated.
- According to the custom headers of the response, every page has 10 rows, and there are 3 pages total, with 24 rows of data in total.
- The API endpoint does not require authentication to be accessed.

## Test list

- Case 1: The search returns no results
- Case 2: The search returns just one result
- Case 3: The search returns multiple results
