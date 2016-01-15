/**
 * @file DISQUS forum page management
 * @author Dominic Thwaites
 */
DJT.disqus=(function() {
    var page=null; // Storage of page details when the context changes

    // Resets DISQUS to a new context (if one is specified in the page property)
    function reset() {
        if (page) {
            DISQUS.reset({
                reload: true,
                config: function () {
                    this.page.identifier = page.newIdentifier;
                    this.page.url = page.newUrl;
                    this.page.title = page.newTitle;
                }
            });
            page=null;
        }
    }

    // Initialise DISQUS
    var disqus_shortname = 'DJT';
    var disqus_config = function () {
        this.language = "en";
        this.callbacks.onReady.push(reset);
    };
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = 'http://dominicthwaites.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

    // To be called when a new DISQUS context is required
    return function newPage(newIdentifier, newUrl, newTitle) {
        page={identifier:newIdentifier,newUrl:newUrl,newTitle:newTitle};
        if (typeof DISQUS!='undefined') reset();
    };
})();