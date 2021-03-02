
#================================================
# Tasks
#================================================

  - API keys: add/view/delete
  - Alerts
  - subscriptions/plans
    - upgrade to paid subscription
    - modify subscription
    - manage payment info
  - home: "Account Setup"
    - convert to two columns
    - use same text but get status dynamically
  - edit SIP realm (getting an API error)
  - change email
  - Carriers: implement "tech prefix"
    - see design but check with Dave, as the actual page has diverged from the design
    - add tooltip on label hover
    - validation: only digits
  - Recent Calls and Alerts date ranges
    - default to 1 day `&days=1`
    - implement quick view switcher
    - add query string to URL so user can go back/fwd and bookmark and get specific results
  - forgot password
  - change auth method (e.g. change from email to GitHub)
    - how do you "unlink" the account from github/google?
  - download recent calls and alerts as CSV
  - footers (external and internal)
  - create the buttons for "sign in with..." (on register and sign in pages)
  - final nav links (e.g. terms of service, support email) (internal and external)
  - mobile styling
    - account home
    - settings pages
    - forms
    - handle buttons splitting view 50/50 and/or taking up 100% width, depending on length of button text
  - when registering via OAuth, get /User/me to see if user has already registered and redirect them accordingly
  - nav
    - finish styling drawer contents and add icons for internal pages
    - when nav drawer or sub menu are open, if you click the link to the current, the menu should close
  - registration - subdomain: show root domain to the right of the input instead of adding text below once the user starts typing
    - long term goal would be to build a custom input using contenteditable so that the root domain can be tacked on the end of what the user is typing
  - speech services
    - custom tooltips with error / success messages (instead of HTML title attribute)
    - create a new icon with an X for errors on the speech services list view
  - On sign-in page, show loader and check if user is already signed in. If they are, redirect them to the account home page
  - Better handle session timeouts (see file `handle-401-session-timeouts.md`)
  - when add/edit appliation, carrier, or phone number, check if the name/number is in use before submitting
  - when there is a pending email change, prevent user from accessing other pages
    - if this is implemented, we ALSO need to provide the user a way to cancel the email change AND resend the email verification code
  - for unsupported browsers (e.g. Internet Explorer), show a message instead of just throwing an error
  - create a full set of favicons: https://realfavicongenerator.net/
  - create a web app manifest: https://developer.mozilla.org/en-US/docs/Web/Manifest

#================================================
# Accessibility
#================================================

  - nav: add accessibilty tags to the menu open button:
    - aria-haspopup="true"
    - aria-expanded="true"/"false"
    - aria-controls="id-of-menu-it-opens"
  - add "required" attribute to form elements
  - add "aria-invalid" to invalid form elements
  - add aria-live or role="alert" sections to announce errors to screen readers
  - add skip links (to main content, to internal account navigation)
  - visible keyboard focus broken on first columns of tables for some reason
  - test with a screen reader

#================================================
# Bugs
#================================================

  - iOS - choose subdomain: the success icon has a background
  - getting duplicate notifications on session timeout (two separate requests both getting 401 and redirecting)
    - maybe have notification context check for duplicate messages
  - table sort on a column with empty values sometimes has unexpected results (should always push rows with empty values to the end)

#================================================
# Styling tweaks
#================================================

  - on desktop, highlight "Account" when user is on a settings page
  - customize styling on select lists so they look consistent across browsers
  - Recent calls: adjust the page layout so that the page title (H1) and table content line up on the left
  - disabled styling background color is different between select and input text (see edit number page)
  - rework loader to be an overlay that fits the height of the container instead of completely replacing the form content
  - refactor table styling
    - all tables should use the separate Th, Td (etc) components
    - drop all nested css in the Table.js component
    - instead of setting link color on first two columns, have a noColor prop and pass it only when needed
  - Account home > API keys: table header should have a white background
    - I am checking it as a prop in Th.js but I also have this in the table: `& thead th { background: #F7F7F7; }`
    - If I remove that, all tables will lose their background
    - Refactoring table css will fix this

#================================================
# UX improvements
#================================================

  - Update notification context to support a custom duration so that you can set a longer duration for some notifications
  - for inputs, set autocapitalize and/or inputmode (to trigger specific mobile keyboards)
  - speech services: prevent user from going to the "Add" page if there is already google && aws
    - show notification: You can only have one google and one aws. Please delete one to create a new one
    - OR disable the + button and on hover show a message saying you can't do that
  - speech services > google: drag-and-drop file uploader
  - replace delete modals with delete pages (to be more consistent with the new design)
  - when deleting an item, check if it's deletable BEFORE the user confirms
    - show immediately on the delete page what prevents the item from being deleted
      - link to delete those other things?
      - option to delete all of those items as well?

#================================================
# Refactoring
#================================================

  - finish refactoring error handling into separate helper function
    - I made a helper function for error handling (`src/helpers/handleErrors.js`), and starting converting error handling over to using it, but didn't finish. Not every try/catch block handles errors in the same way, so it needs to be done carefully
  - use a styled components theme for colors
  - refactor side menu to use NavItem component
