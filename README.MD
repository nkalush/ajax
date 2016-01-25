Ajax Simplifier
===============

I don't like using importing jquery when the only thing I want it for is the ajax function. So this is an ajax function that works similarly to jQuery's.

Example
```
ajax({
    url: 'http://example.com',
    type: 'POST',
    data: {
		something: 1
    },
    //sync: false,
    // async: true,
    success: function () { return true; },
    error: function () { return true; }
})
```