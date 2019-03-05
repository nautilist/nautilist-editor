// const marked = require('marked');
const md2json = require('md-2-json')
const beautify = require("json-beautify");
const traverse = require('traverse');
// const shortid = require('shortid')

const multilist = `
# list 1
> description for list 1

## sublist 1
> description for sublist 1

### sublist 1 - feature 1
> description for sublist 1 feature 1

- https://itp.nyu.edu

### sublist 1 - feature 2
> description for sublist 1 feature 2

- https://editor.p5js.org

### sublist 1 - feature 3
> description for sublist 1 feature 3

- https://p5js.org

### sublist 1 - feature 4
> description for sublist 1 nested list 1

#### sublist 1 - feature 4 - item 1
> description for sublist 1 - nested list 1 - item 1

- https://thecodingtrain.com/

#### sublist 1 - feature 4 - item 2
> description for sublist 1 - nested list 1 - item 1

- https://thecodingtrain.com/


## sublist 2
> description for sublist 2

### sublist 2 - feature 1
> description for sublist 2 feature 1

- https://processing.org

### sublist 2 - feature 2
> description for sublist 2 feature 2

- https://openframeworks.cc/

### sublist 2 - feature 3
> description for sublist 3 feature 3

- https://nautilists.com
`


let parsed = md2json.parse(multilist);

// console.log(parsed)

console.log(beautify(parsed, null, 2, 40) )