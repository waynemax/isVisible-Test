<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>{title}</title>
  <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
  <link rel="stylesheet/less" type="text/css" href="engine/static/styles/main.less?v={lessRandomVersion}" />
  {js}
</head>
<body>
  {header}
  <div class="cnt1024">
    <div class="cntfl">
      <div class="colon">
        <div class="h15"></div>
        {menu}
      </div>
      <div class="page" id="pageinit">
        {content}
      </div>
    </div>
  </div>
  <div class="h15"></div>
  <input type="text" tabindex="0" id="allblur" style="width:0px;height:0px;top:-1px;left:-1px;position:fixed;" />
</body>
</html>
