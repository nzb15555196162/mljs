
var m=window.mljs||{};var b=m.bindings||{};m.bindings=b;b.xhr2=function(){};b.xhr2.prototype.supportsAdmin=function(){return false;};b.xhr2.prototype.configure=function(username,password,logger){this.username=username;this.password=password;this.logger=logger;};b.xhr2.prototype.request=function(reqname,options,content,callback){var self=this;var ct=options.contentType;if(undefined==ct){self.logger.debug("XHR2: *********** CT UNDEFINED *************");ct="application/json";}
try{var xhr=new XMLHttpRequest();xhr.open(options.method,options.path,true);xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');xhr.setRequestHeader('Content-Type',ct);if(options.headers){for(var h in options.headers){if(typeof options.headers[h]=="string"&&h!="Content-type"){self.logger.debug("XHR2: header: "+h);self.logger.debug("XHR2: header value: "+options.headers[h]);xhr.setRequestHeader(h,options.headers[h]);}}}
xhr.onload=function(e){var res={};res.inError=false;res.statusCode=xhr.status;self.logger.debug("XHR2: responseXML: "+xhr.responseXML);self.logger.debug("XHR2: responseText: "+xhr.responseText);self.logger.debug("XHR2: response: "+xhr.response);self.logger.debug("XHR2: typeof responseXML: "+typeof xhr.responseXML);self.logger.debug("XHR2: typeof responseText: "+typeof xhr.responseText);self.logger.debug("XHR2: typeof response: "+typeof xhr.response);if((""+xhr.status).indexOf("2")==0){var wibble;self.logger.debug("XHR2: Data type: "+(typeof content));self.logger.debug("XHR2: Data value: "+content);var xml=xhr.responseXML;if(undefined!=xml){res.format="xml";wibble=xml;}else{self.logger.debug("XHR2: response text: "+xhr.responseText);if(xhr.status==201||xhr.status==204){res.location=xhr.responseText;wibble="";}else{try{self.logger.debug("XHR2: parsing xhr.responseText");wibble=JSON.parse(xhr.responseText);res.format="json";self.logger.debug("XHR2: js raw: "+wibble);self.logger.debug("XHR2: json str: "+JSON.stringify(wibble));self.logger.debug("XHR2: Parsed JSON successfully");}catch(ex){self.logger.debug("XHR2: JSON parsing failed. Trying XML parsing.");try{wibble=textToXML(xhr.responseText);res.format="xml";}catch(ex2){self.logger.debug("XHR2: Not JSON or XML. Exception: "+ex2);}}}}
res.doc=wibble;}else{self.logger.debug("XHR2: error");if(xhr.status==303){res.location=xhr.getResponseHeader("location");}
res.inError=true;res.doc=xhr.responseXML;if(undefined==res.doc){res.doc=xhr.responseText;res.format="text";if(xhr.status==404){}else{try{self.logger.debug("XHR2: parsing xhr.responseText");var wibble=JSON.parse(xhr.responseText);res.format="json";self.logger.debug("XHR2: js raw: "+wibble);self.logger.debug("XHR2: json str: "+JSON.stringify(wibble));self.logger.debug("XHR2: Parsed JSON successfully");res.doc=wibble;}catch(ex){try{res.doc=textToXML(xhr.responseText);res.error=xmlToJson(res.doc);res.format="xml";}catch(ex){self.logger.debug("XHR2: Exception: "+ex);}}}}else{res.format="xml";res.error=xmlToJson(res.doc);}
res.details=res.doc;if("string"==typeof res.details&&xhr.status!=404){res.details=textToXML(res.details);}}
callback(res);};if(ct=="application/xml"){content=(new XMLSerializer()).serializeToString(content);}else if(ct=="application/json"){content=JSON.stringify(content);}else{}
self.logger.debug("XHR2: Sending content: "+content);xhr.send(content);}catch(ex){self.logger.debug("XHR2: EXCEPTION in XHR2 send() call: "+ex);var res={inError:true,details:ex};callback(res);}};