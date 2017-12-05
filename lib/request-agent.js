'use strict';

var _ = require('underscore');

module.exports = function(agent){
  this.agent = agent;

  var evalIfFunction = function(variable){
    return _.isFunction(variable) ? variable() : variable;
  };

  this.make = function(options, callback){
    var data = evalIfFunction(options.data) || {},
        query = evalIfFunction(options.query) || {},
        headers = evalIfFunction(options.headers) || {},
        method = options.method === 'delete' ? 'del' : options.method,
        request = this.agent[method](options.url),
        files = options.files || [];
    if(!_.isEmpty(files)) {
      for(var f in files) {
        var file = files[f];
        request.attach(file.var_name, file.buffer, file.file_name)
      }
      if(!_.isEmpty(data)) {
        for (var d in data) {
          request.field(d, data[d]);
        }
      }  
    }
    else if(!_.isEmpty(data)) {
        request.send(data);
		}

    if(!_.isEmpty(query)) {
      request.query(query);
    }

    _.forEach(headers, function(header, headerName){
      request.set(headerName, header);
    });

    request.end(callback);
  };
};
