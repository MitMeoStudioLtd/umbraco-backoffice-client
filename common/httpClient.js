var axios = require('axios');
var cookies = require('browser-cookies');

module.exports = {
  create: function(url, opts) {
    if (!url) {
      throw 'Umbraco root URL must be provided';
    }
    if (!document) {
      throw 'Umbraco using forms authentication so this strictly supports via browsers only.';
    }

    // Using dev options
    if (opts) {
      Object.keys(opts).forEach(function(key) {
        cookies.set(key, opts[key]);
      });
    }

    var client = axios.create({
      baseURL: (url + '/umbraco/backoffice/').replace(/\/\/+/g, '/'),
      // timeout: 1000,
      headers: {
        'X-UMB-XSRF-TOKEN': cookies.get('UMB-XSRF-TOKEN')
      }
    });

    // Custom response formatter
    client.interceptors.response.use(
      function(res) {
        // Umbraco internal back office APIs return some weird JSON, we need to format it

        // For e.g:

        // )]}', <-- this is a weird block at the start of the response
        // {"name":"1 column layout",

        var data = (res.data || '').split('\n');
        if (data.length === 2) return JSON.parse(data[1]);
        return null;
      },
      function(err) {
        return Promise.reject(err);
      }
    );

    // Custom request formatter
    client.interceptors.request.use(
      function(req) {
        // Send cookies too
        req.withCredentials = true;
        return req;
      },
      function(err) {
        return Promise.reject(err);
      }
    );

    return client;
  }
};
