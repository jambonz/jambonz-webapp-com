
Session timeouts:

  - Email users should log back in and pick up where they left off
  - The experience for OAuth users should be seamless as long as they are still logged in to the third party app.

When the user makes a request and the API returns a 401, the session has timed out. Here's what should happen:

  1. if they were trying to navigate to a new page
    - store the URL they were trying to access in localStorage
    - if they signed in with email, send them to the login page
    - if they signed in with OAuth, send them to the appropriate OAuth endpoint
    - either way, upon successful sign in, check that it's the same user logging in, check localStorage and send them to the page they wanted

  2. if they were making a POST/PUT request
    - store the page they were on and the form data into sessionStorage (so it doesn't persist if they close the tab)
    - if they signed up with email
      - redirect them to the login page
      - user logs in
      - check if it's the same user who was previously logged in
      - if different user, delete data from sessionStorage and send them to the account home page
      - if same user, send them back to the form and prepopulate the data but DON'T submit it
      - have a notification asking them to check the form and submit again
      - user must hit submit again
    - if they signed in with OAuth
      - store a timestamp in localStorage of when they made the request
      - send them to the appropriate OAuth endpoint
      - if they are redirected within a certain amount of time (maybe 2-5 second), check that it's the same user and submit the request
      - if the time has expired but it's the same user, send them to the page they were on and add a notification asking them to try again or something
      - if it's a different user, delete data from sessionStorage and redirect them to the account home page
      - (the reason for the timeout is that if they are automatically redirected, they won't even know that their session expired, but if they have to log in to github again, then it will be unclear whether the form submitted or not, and I can't see any way of knowing whether the user had to put in their username/password on github again or whether they were automatically redirected)

  3. if they were making a DELETE request
    - same as POST/PUT request, except show the DELETE modal again and require that they click the delete button

NOTE: The same logic applies to users attempting to access a page while logged out (i.e. if they don't have a JWT). Store their desired location and got there after successful sign-in.
