/**
 * Registered to before post render, the time we deal with markdown source files.
 * We replace dot code with raw htmls, and add viz.js render code.
 * But I need to support all engines.
 */
function ignore(data) {
    var source = data.source;
    var ext = source.substring(source.lastIndexOf('.')).toLowerCase();
    return ['.js', '.css', '.html', '.htm'].indexOf(ext) > -1;
}

exports.filter = function(data) {
    if (!ignore(data)) {
        let engines = ['dot', 'circo', 'fdp', 'neato', 'osage', 'twopi','mermaid']
        let isGraphviz = false
        let isMermaid = false
        for (e of engines) {
            let re = new RegExp('^```' + e + '((.*[\r\n]+)+?)?```$', 'igm')
            codes = data.content.match(re);
            // Begin replace
            if (codes instanceof Array) {
                if (e === 'mermaid') {
                    isMermaid = true
                } else{
                    isGraphviz = true;
                }
                for (var i = 0, len = codes.length; i < len; i++) {
                    let r = new RegExp('^```' + e);
                    if (e === 'mermaid') {
                        data.content = data.content.replace(
                            codes[i],
                            codes[i].replace(r, '{% raw %}<div class="' + e + '">').replace(/```$/, '</div>{% endraw %}'));
                    } else {
                        data.content = data.content.replace(
                            codes[i],
                            codes[i].replace(r, '{% raw %}<div class="language-' + e + '">').replace(/```$/, '</div>{% endraw %}'));
                    }
                }
            }
        }
        let r = '';
        if (isMermaid) {
            r += '<script src="' + hexo.config.mermaid.js + '">\n mermaid.initialize({startOnLoad:true}); \n</script>';
        }

        if (isGraphviz) {
            let config = this.config.graphviz;
            r+= '<script src="' + config.vizjs + '"></script>';
            r+= '<script src="' + config.render + '"></script>';
            let str = function() {/*
                <script>
                // graphviz init
                let graphviz_engines = ["circo",
                    "dot",
                    "fdp",
                    "neato",
                    "osage",
                    "twopi"];

                function doGraphviz(engine) {
                    let domAllDot = document.querySelectorAll('.language-' + engine);
                    for (let i = 0; i < domAllDot.length; i++) {
                        let dom = domAllDot[i];
                        let graphSource = dom.innerText || dom.textContent;

                        try {
                           let viz = new Viz();
                             viz.renderSVGElement(graphSource, {engine: engine})
                                 .then(r => {
                            dom.innerHTML ='';dom.append(r); });
                        } catch (e) {
                            console.error("Error when parsing node:", dom, e);
                        } 
                    }
                } 

                let init = function () {
                    for (let i = 0; i < graphviz_engines.length; i++) {
                        doGraphviz(graphviz_engines[i]);
                    }
                };
                if (typeof window.addEventListener != "undefined") {
                    window.addEventListener("load", init, false);
                } else {
                    window.attachEvent("onload", init);
                }
                </script>
                */}
                r += str.toString().split("\n").slice(1,-1).join("\n")
        }
        r += '';
        data.content += r;
    }
};
