
# jambonz.org website
  --------------------------------------------
  filename                                path
  --------------------------------------------

  index                                   /

  pricing                                 /pricing

  legal/index                             /legal<br>
  legal/document                          /legal/:slug

  docs/index                              /docs<br>
  docs/document                           /docs/:slug

  404                                     404 not found

# Portal - public
  register/index                          /register<br>
  register/email                          /register/email<br>
  register/email-verify                   /register/verify-your-email<br>
  register/subdomain                      /register/choose-a-subdomain<br>
  register/mobile-number                  /register/mobile-number<br>
  register/mobile-number-verify           /register/verify-your-mobile-number<br>
  register/complete                       /register/complete<br>

  sign-in/index                           /sign-in<br>
  sign-in/email                           /sign-in/email<br>
  sign-in/forgot-password                 /sign-in/forgot-password<br>

  404-external                            404 not found

# Portal - internal
  account/index                           /account

  account/api-keys/details                /account/api-keys/:id<br>
  account/api-keys/new                    /account/api-keys/:id/new<br>
  account/api-keys/delete                 /account/api-keys/:id/delete<br>

  account/mobile-number/verify            /account/mobile-number/verify<br>
  account/mobile-number/remove            /account/mobile-number/remove<br>
  account/mobile-number/add-edit          /account/mobile-number/add<br>
  -------- same -------------->           /account/mobile-number/edit<br>

  account/registration-webhook/delete     /account/registration-webhook/edit<br>
  account/registration-webhook/add-edit   /account/registration-webhook/add<br>
  -------- same -------------->           /account/registration-webhook/edit<br>

  account/sip-realm/edit                  /account/sip-realm/edit

  account/applications/index              /account/applications<br>
  account/applications/add-edit           /account/applications/add<br>
  -------- same -------------->           /account/applications/:id/edit<br>

  account/recent-calls/index              /account/recent-calls<br>
  account/recent-calls/details            /account/recent-calls/:id

  account/alerts/index                    /account/alerts<br>
  account/alerts/details                  /account/alerts/:id

  account/carriers/index                  /account/carriers<br>
  account/carriers/add-edit               /account/carriers/add<br>
  -------- same ---------->               /account/carriers/:id/edit

  account/phone-numbers/index             /account/phone-numbers<br>
  account/phone-numbers/add-edit          /account/phone-numbers/add<br>
  -------- same --------------->          /account/phone-numbers/:id/edit

  account/speech-services/index           /account/speech-services<br>
  account/speech-services/add-edit        /account/speech-services/add<br>
  -------- same ----------------->        /account/speech-services/:id/edit

  account/add-ons/index                   /account/add-ons<br>
  account/add-ons/add-remove              /account/add-ons/:slug/add<br>
  -------- same ----------->              /account/add-ons/:slug/remove

  account/getting-started/index           /account/getting-started<br>
  account/getting-started/details         /account/getting-started/:slug

  account/settings/index                  /account/settings<br>
  account/settings/change-name-and-email  /account/settings/change-name-and-email
  account/settings/change-password        /account/settings/change-password<br>
  account/settings/delete-account         /account/settings/delete-account<br>
  account/settings/verify-your-email      /account/settings/verify-your-email

  account/settings/auth/index             /account/settings/auth<br>
  account/settings/auth/email             /account/settings/auth/email

  404-internal                            /account/... 404 not found
