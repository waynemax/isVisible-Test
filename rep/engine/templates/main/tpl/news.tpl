<div class="pagel_ltr">
  <div class="h15"></div>

  <div class="main prependloadButton addNewsPost" data-onClick="" data-html="<img src='/engine/static/images/others/loading.gif' style='margin:auto'/>" onclick="preloader.toggle(this); wall.addPost(function(){preloader.toggle($('.addNewsPost'));});"><font>Добавить пост</font></div>

  <div class="h15"></div>
  <div class="main wall" id="wall"></div>
</div>
<div class="pager_ltr">
  <div class="h15"></div>
  <div class="mainbox listMenu noSelect" id="listMenuNews"></div>
</div>

<script type="text/javascript">
  var listMenuNews = _UI_.generate.menu.list([
    {"type": "span", "class":"selectel"},
    {"type": "div", "class":"h5"},
    {"data": "Новости","onClick": "return false;", "class":"select"},
    {"data": "Фотографии","onClick": "return false;", "class":"p2"},
    {"data": "Видеозаписи","onClick": "return false;", "class":"p2"},
    {"data": "Подписки","onClick": "return false;", "class":"p2"},
    {"data": "Понравилось","onClick": "return false;", "class":"p2"},
    {"data": "Рекомендации","onClick": "return false;"},
    {"data": "Поиск","onClick": "return false;"},
    {"type": "div", "class":"h5"},
    {"type": "hr"},
    {"type": "div", "class":"h5"},
    {"data": "Обновления","onClick": "return false;"},
    {"data": "Комментарии","onClick": "return false;"},
    {"type": "div", "class":"h5"}
  ]);

  var preloader = {
    toggle: function(el){
      var dataHtml = $(el).attr('data-html');
        $(el).attr('data-html', $(el).html());
        $(el).html(dataHtml);

      var dataOnClick = $(el).attr('data-onClick');
        $(el).attr('data-onClick', $(el).attr("onClick"));
        $(el).attr("onclick", dataOnClick);
    }
  };

  $('#listMenuNews').html(listMenuNews);
  
  document.addEventListener("DOMContentLoaded", function(){
    // загружаем посты
    wall.view({offset: 0, count: wall.count});
    
    // слушаем скролл
    window.addEventListener("scroll", function(e){
      var scrollTop = window.pageYOffset;

      // проверка на просмотр постов
      wall.scrollWallListener(e);

      if(scrollTop + window.innerHeight >= document.body.scrollHeight){
        $('.preloadButton').click();
      }
    });
  });
</script>

