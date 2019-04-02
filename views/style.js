const css = require('sheetify');
module.exports = css`
html{
  width:100%;
  height:100%;
  /** padding: 1em; **/
}

.reverse-img{
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.dropshadow{
  box-shadow:2px 2px black;
}

.min-height-0{
  min-height:0;
}

.max-z{
  z-index:9999;
}

.small{
  font-size:9px;
}

.resize-none{
  resize:none;
}
`