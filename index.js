var client = require('./common/httpClient');

var backOfficeClient;

var getSections = function() {
  return backOfficeClient.get('UmbracoApi/Section/GetSections');
};

module.exports = {
  create: function(url, opts) {
    var backOfficeClient = client.create(url, opts);
    
    backOfficeClient.getSections = function(){
      return this.get('UmbracoApi/Section/GetSections');
    };
    
    return backOfficeClient;
  },
};
