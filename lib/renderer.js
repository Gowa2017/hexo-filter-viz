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

exports.render = function (data) {
  if (!ignore(data)) {
    let engines = ['dot', 'circo', 'fdp', 'neato', 'osage', 'twopi']
    for (e of engines) {
      let re = new RegExp('^```' + e + '((.*[\r\n]+)+?)?```$', 'igm')
      codes = re.exec(data.content);
      // Begin replace
      if (codes instanceof Array) {
        for (var i = 0, len = codes.length; i < len; i++) {
          let r = new RegExp('^```' + e);
          data.content = data.content.replace(
            codes[i],
            codes[i].replace(r, '<div class="language-' + e + '">').replace(/```$/, '</div>'));
        }
      }
    }

    // resources
    var config = this.config.graphviz;
    data.content += '<script src="' + config.vizjs + '"></script>';
    data.content += '<script src="' + config.render + '"></script>';
    data.content += '' +
      '{% raw %}' +
      '<script>' +
      'let graphviz_engines = ["circo",' +
      '    "dot",' +
      '    "fdp",' +
      '    "neato",' +
      '    "osage",' +
      '    "twopi"];' +
      '' +
      'function doGraphviz(engine) {' +
      '    let domAllDot = document.querySelectorAll(\'.language-\' + engine);' +
      '    for (let i = 0; i < domAllDot.length; i++) {' +
      '        let dom = domAllDot[i];' +
      '        let graphSource = dom.innerText || dom.textContent;' +
      '' +
      '        try {' +
      '           let viz = new Viz();' +
      '             viz.renderSVGElement(graphSource, {engine: engine})' +
      '                 .then(r => {' +
      '            dom.innerHTML =\'\';dom.append(r); });' +
      '        } catch (e) {' +
      '            console.error("Error when parsing node:", dom, e);' +
      '        }' +
      '    }' +
      '}' +
      '' +
      'let init = function () {' +
      '    for (let i = 0; i < graphviz_engines.length; i++) {' +
      '        doGraphviz(graphviz_engines[i]);' +
      '    }' +
      '};' +
      'if (typeof window.addEventListener != "undefined") {' +
      '    window.addEventListener("load", init, false);' +
      '} else {' +
      '    window.attachEvent("onload", init);' +
      '}' +
      '</script>' +
      '{% endraw %}';
  }
};
