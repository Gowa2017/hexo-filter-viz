const fs = require("fs");
let s = fs.readFileSync("test.md").toString();

let re = new RegExp("^```" + "dot" + "((.*[\r\n]+)+?)?```$", "igm");
codes = s.match(re);
// Begin replace
if (codes instanceof Array) {
  for (var i = 0, len = codes.length; i < len; i++) {
    let r = new RegExp("^```" + "dot");
    console.log(i, codes[i]);

    s = s.replace(
      codes[i],
      codes[i]
        .replace(r, '<div class="language-' + "dot" + '">')
        .replace(/```$/, "</div>")
    );
  }
}

let str = function () {
  /*
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
            */
};

console.log(str.toString().split("\n").slice(2, -2).join("\n"));
