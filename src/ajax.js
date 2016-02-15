/*jslint browser: true */
/*jslint devel: true */

var ajax = (function () {
    'use strict';

    function filloptions(options, defaultoptions) {
        var prop;
        if (options === undefined) {
            return defaultoptions;
        }
        for (prop in defaultoptions) {
            if (defaultoptions.hasOwnProperty(prop) && options.hasOwnProperty(prop) === false) {
                options[prop] = defaultoptions[prop];
            }
        }
        return options;
    }

    function toUriRequest(obj) {
        query = [];
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        return obj.join('&');
    }

    var default_options ={
            url: null,
            type: 'GET',
            data: null,
            //sync: false,
            async: true,
            success: function () { return true; },
            error: function () { return true; }
        },

        getx = function () {
            if (window.XMLHttpRequest !== undefined) {
                return new window.XMLHttpRequest();
            }
            var versions = [
                    "MSXML2.XmlHttp.5.0",
                    "MSXML2.XmlHttp.4.0",
                    "MSXML2.XmlHttp.3.0",
                    "MSXML2.XmlHttp.2.0",
                    "Microsoft.XmlHttp"
                ],
                xhr,
                i;
            for (i = 0; i < versions.length; i = i + 1) {
                try {
                    xhr = new window.ActiveXObject(versions[i]);
                    break;
                } catch (ignore) {
                }
            }
            return xhr;
        },
        send = function (passed_options) {
            var x = getx(),
                options = filloptions(passed_options, default_options),
                query = [],
                key;

            if(option.type === 'GET' && option.data.length > 0) {
                options.url = options.url + '?' + toUriRequest(options.data);
            }

            x.open(options.type, options.url, options.sync);
            x.onreadystatechange = function () {
                var response = null;
                if (x.readyState === window.XMLHttpRequest.DONE) {
                    if (x.status === 200) {
                        if (typeof options.success === 'function') {
                            response = x.responseText;
                            if (response.charAt( 0 ) === '[' || response.charAt( 0 ) === '{') {
                                response = JSON.parse(response);
                            }
                            options.success(response);
                        }
                    } else {
                        if (typeof options.error === 'function') {
                            options.error(x.responseText);
                        }
                    }
                }
            };
            //Mark request as ajax
            // x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            if (options.type === 'POST' || options.type === 'PUT') {
                x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                if (typeof options.data === 'object') {
                    if (options.data.toString() === '[object FormData]') {
                        x.send(options.data);
                    } else {
                        x.send(toUriRequest(options.data));
                    }
                } else {
                    x.send();
                }
            } else {
                x.send();
            }
        };

    return send;
}());