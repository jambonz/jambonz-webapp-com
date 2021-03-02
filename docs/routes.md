
#================================================
# jambonz.org website
#================================================

  --------------------------------------------
  filename                                path
  --------------------------------------------

  index                                   /

  pricing                                 /pricing

  legal/index                             /legal
  legal/document                          /legal/:slug

  docs/index                              /docs
  docs/document                           /docs/:slug

  404                                     404 not found

#================================================
# Portal - public
#================================================

  register/index                          /register
  register/email                          /register/email
  register/email-verify                   /register/verify-your-email
  register/subdomain                      /register/choose-a-subdomain
  register/mobile-number                  /register/mobile-number
  register/mobile-number-verify           /register/verify-your-mobile-number
  register/complete                       /register/complete

  sign-in/index                           /sign-in
  sign-in/email                           /sign-in/email
  sign-in/forgot-password                 /sign-in/forgot-password

  404-external                            404 not found

#================================================
# Portal - internal
#================================================

  account/index                           /account

  account/api-keys/details                /account/api-keys/:id
  account/api-keys/new                    /account/api-keys/:id/new
  account/api-keys/delete                 /account/api-keys/:id/delete

  account/mobile-number/verify            /account/mobile-number/verify
  account/mobile-number/remove            /account/mobile-number/remove
  account/mobile-number/add-edit          /account/mobile-number/add
  -------- same -------------->           /account/mobile-number/edit

  account/registration-webhook/delete     /account/registration-webhook/edit
  account/registration-webhook/add-edit   /account/registration-webhook/add
  -------- same -------------->           /account/registration-webhook/edit

  account/sip-realm/edit                  /account/sip-realm/edit

  account/applications/index              /account/applications
  account/applications/add-edit           /account/applications/add
  -------- same -------------->           /account/applications/:id/edit

  account/recent-calls/index              /account/recent-calls
  account/recent-calls/details            /account/recent-calls/:id

  account/alerts/index                    /account/alerts
  account/alerts/details                  /account/alerts/:id

  account/carriers/index                  /account/carriers
  account/carriers/add-edit               /account/carriers/add
  -------- same ---------->               /account/carriers/:id/edit

  account/phone-numbers/index             /account/phone-numbers
  account/phone-numbers/add-edit          /account/phone-numbers/add
  -------- same --------------->          /account/phone-numbers/:id/edit

  account/speech-services/index           /account/speech-services
  account/speech-services/add-edit        /account/speech-services/add
  -------- same ----------------->        /account/speech-services/:id/edit

  account/add-ons/index                   /account/add-ons
  account/add-ons/add-remove              /account/add-ons/:slug/add
  -------- same ----------->              /account/add-ons/:slug/remove

  account/getting-started/index           /account/getting-started
  account/getting-started/details         /account/getting-started/:slug

  account/settings/index                  /account/settings
  account/settings/change-name-and-email  /account/settings/change-name-and-email
  account/settings/change-password        /account/settings/change-password
  account/settings/delete-account         /account/settings/delete-account
  account/settings/verify-your-email      /account/settings/verify-your-email

  account/settings/auth/index             /account/settings/auth
  account/settings/auth/email             /account/settings/auth/email

  404-internal                            /account/... 404 not found
