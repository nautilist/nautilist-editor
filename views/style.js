const css = require('sheetify');
module.exports = css`
html{
  width:100%;
  height:100%;
  /** padding: 1em; **/
}

*{
  box-sizing:border-box;
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

.multiline-truncate {
  display: block; /* Fallback for non-webkit */
  display: -webkit-box;
  max-width: 400px;
  height: 2.5rem; /* Fallback for non-webkit */
  margin: 0 auto;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.flex-grow-1{
  flex-grow:1;
}
`