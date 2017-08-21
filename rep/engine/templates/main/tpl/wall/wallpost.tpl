<div class="main post postId{{id}}" id="postId{{&id}}" data-id="{{id}}">
  <div class="mainbox">
    <div class="h15"></div>
    <div class="p30">
      <div class="main author">
        <div class="photo" style="background-image:url(https://vk.com/images/camera_50.png);"></div>
        <div class="authorHeader">
          <font class="name"><span>Тестовый пользователь</span></font>
          <font class="date"><span>{{&addition_time}}</span></font>
        </div>
        <div class="rightMore noSelect" onclick="_UI_.actionsMenu.open({obj:this,ev:event,createId:'wallPostOptionsId1','reX':-132,'reY':-15,'width':170,class:'listMenu',html:_UI_.generate.menu.list(wall.wallPostMenuList)});">
          <i class="material-icons">more_horiz</i>
        </div>
      </div>
      <div class="h15"></div>
      <div class="postContent">
        <div class="main" id="text">
          Тест
        </div>
        <div class="main" id="attachments">
          <div class="main" id="images">
            <img class="postImage" src="{{&src}}"/>
          </div>
        </div>
      </div>
      <div class="h15"></div>
      <div class="postFooter">
        <hr>
        <div class="h10"></div>
        <div class="main noSelect">
          <li class="like"><!--active class--><i class="material-icons">favorite</i> <font>Нравится</font><span>1</span></li>
          <li><i class="material-icons">speaker_notes</i> <font>Комментировать</font></li>
          <li class="fl_r views"><i class="material-icons">remove_red_eye</i><span>Просмотрено: <span id="viewsCounter{{id}}">{{&views}}</span></span></li>
        </div>
      </div>
    </div>
    <div class="h15"></div>
  </div>
  <div class="h15"></div>
</div>
