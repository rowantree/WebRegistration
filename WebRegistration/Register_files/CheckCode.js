var HTTP;

HTTP = {};

// This is a list of XMLHttpRequest creation factory functions to try
HTTP._factories = [
    function() { return new XMLHttpRequest(); },
    function() { return new ActiveXObject("Msxml2.XMLHTTP"); },
    function() { return new ActiveXObject("Microsoft.XMLHTTP"); }
];

// When we find a factory that works, store it here
HTTP._factory = null;

// Create and return a new XMLHttpRequest object.
// 
// The first time we're called, try the list of factory functions until
// we find one that returns a nonnull value and does not throw an
// exception.  Once we find a working factory, remember it for later use.
//
HTTP.newRequest = function() {
    if (HTTP._factory != null) return HTTP._factory();

    for(var i = 0; i < HTTP._factories.length; i++) {
        try {
            var factory = HTTP._factories[i];
            var request = factory();
            if (request != null) {
                HTTP._factory = factory;
                return request;
            }
        }
        catch(e) {
            continue;
        }
    }

    // If we get here, none of the factory candidates succeeded,
    // so throw an exception now and for all future calls.
    HTTP._factory = function() {
        throw new Error("XMLHttpRequest not supported");
    }
    HTTP._factory(); // Throw an error
}

/**
 * Use XMLHttpRequest to fetch the contents of the specified URL using
 * an HTTP GET request.  When the response arrives, pass it (as plain
 * text) to the specified callback function.
 * 
 * This function does not block and has no return value.
 */
HTTP.getText = function(url, callback) {
    var request = HTTP.newRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200)
            callback(request.responseText);
    }
    request.open("GET", url);
    request.send(null);
};



