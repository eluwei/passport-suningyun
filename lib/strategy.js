'use strict'
var util = require('util')
var OAuth2Strategy = require('passport-oauth2')

function Strategy (options, verify) {
  options = options || {}
  options.authorizationURL = options.authorizationURL || 'http://open.suning.com/api/oauth/authorize'
  options.tokenURL = options.tokenURL || 'http://open.suning.com/api/oauth/token'
  options.scopeSeparator = options.scopeSeparator || ','
  options.customHeaders = options.customHeaders || {}
  options.scope = options.scope || ''

  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-suningyun'
  }

  OAuth2Strategy.call(this, options, verify)
  this.name = 'suningyun'

  var _oauth2GetOAuthAccessToken = this._oauth2.getOAuthAccessToken
  this._oauth2.getOAuthAccessToken = function (code, params, callback) {
    _oauth2GetOAuthAccessToken.call(this, code, params, function (err, accessToken, refreshToken, params) {
      if (err) { return callback(err) }
      if (!accessToken) {
        err = new Error(JSON.stringify(params))
        err.statusCode = 400
        err.params = params
        return callback(err)
      }
      callback(null, accessToken, refreshToken, params)
    })
  }

  // this._oauth2.getAuthorizeUrl = function (params) {
  //   var queries = []
  //   // add all necessary params by order here
  //   var order = ['client_id', 'response_type', 'redirect_uri', 'scope', 'state', 'itemcode']
  //   order.forEach(function (key) {
  //     if (params[key]) {
  //       var query = {}
  //       query[key] = params[key]
  //       queries.push(querystring.stringify(query))
  //     }
  //   })
  //   return this._authorizationURL + '?' + queries.join('&')
  // }
}

util.inherits(Strategy, OAuth2Strategy)
module.exports = Strategy
