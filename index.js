var assign = require('deep-assign');
var renderer = require('./lib/renderer');

hexo.config.graphviz = assign({
  vizjs: 'https://unpkg.com/viz.js@2.1.2/viz.js',
  render: 'https://unpkg.com/viz.js@2.1.2/full.render.js',
}, hexo.config.graphviz);

hexo.config.mermaid = assign({
  js: 'https://unpkg.com/mermaid@8.4.6/dist/mermaid.min.js',
}, hexo.config.mermaid);
hexo.extend.filter.register('before_post_render', renderer.filter, 9);
