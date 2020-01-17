const fs =  require("fs")
let s = fs.readFileSync('test.md').toString();

let re = new RegExp('^```' + 'dot' + '((.*[\r\n]+)+?)?```$', 'igm')
codes = s.match(re)
// Begin replace
if (codes instanceof Array) {
    for (var i = 0, len = codes.length; i < len; i++) {
        let r = new RegExp('^```' + 'dot');
        console.log(i,codes[i]);
        
        s = s.replace(
            codes[i],
            codes[i].replace(r, '<div class="language-' + 'dot' + '">').replace(/```$/, '</div>'));
    }
}
