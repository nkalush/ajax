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

    var default_options: {
            url: null,
            type: 'GET',
            data: null,
            //sync: false,
            async: true,
            success: function () { return true; },
            error: function () { return true; }
        },

        x = function () {
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
            var x = x(),
                options = filloptions(passed_options, default_options),
                query = [],
                key;
            x.open(options.type, options.url, options.sync);
            x.onreadystatechange = function () {
                if (x.readyState === window.XMLHttpRequest.DONE) {
                    if (x.status === 200) {
                        if (typeof options.success === 'function') {
                            options.success(x.responseText);
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
                        query = [];
                        for (key in options.data) {
                            if (options.data.hasOwnProperty(key)) {
                                query.push(encodeURIComponent(key) + '=' + encodeURIComponent(options.data[key]));
                            }
                        }
                        x.send(query.join('&'));
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