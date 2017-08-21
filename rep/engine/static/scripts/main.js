"use strict";

/*100**********************************************************************************************/
  
  var domain =    location.hostname,
    protocol = "http://",
    thm = protocol + domain + "/thm", // URL загрузки шаблонов
    LOCALSTORAGE_VERSION = 1.131,
    testmode = false,
    API = protocol + domain + "/control/"; // адрес API

/**************************************************************************************************/
  // загрузка страниц
  var _layers = {
      _load: function(_link, type){
        var cb = false;
        switch(type){
          case "pageinit":
            switch(_link){
              case "/news":
                var template = compile.get(_link);

                var title = "Новости";
                history.pushState('', title, _link);
              break;
            }
          break;
        }
        $('#'+type).html(template);
        if(cb && typeof cb == "function") cb();
        document.title = title;
      }
  };

  var parse = (window.JSON && JSON.parse) ? function(o){
    try {
      return JSON.parse(o);
    } catch(e){
      console.log(e.message);
      return eval('('+o+')');
    }
  } : function(o) {
    return eval('('+o+')');
  }
  
  window.onload = function(){
    /*  supports localstorage
    */
     if(supports_html5_storage()){
      console.log("localstorage started;");
     }

     $(window).keydown(function(e){
      if(e.key == "Escape" || e.keyCode === 27){
        if($('.actionsMenu').length > 0){
          $('#allblur').focus();
        }
      }
     });
  };

  /*  Работа с синхронными HTTP запросами
  */
  var http = function(o){
    var xhr = newXhrGet(),
      url = "url" in o ? o.url : location.pathname;

    var type = "type" in o ? o.type.toUpperCase() : type = "POST",
      json = true;

      if("json" in o){
        if(o.json == false) json = false;
      }

      if(type != "POST"){
        json = false;
      }

      if("body" in o){
        if(o.body){
          var body = "";
          if(json == false){
            var ar = [];
            for(var key in o.body){
              ar.push(key + "=" + encodeURIComponent(o.body[key]));
            }
            body = ar.join("&");
          } else {
            if(typeof o.body == "object"){
              body = JSON.stringify(o.body);
            } else {
              body = o.body;
            }
          }
        }
      } else {
        if(json){
          var body = JSON.stringify({});
        } else {
          var body = "";
        }
      }

      if(type != "POST" && body){
        url = url + "?" + body;
      }

      xhr.open(type, url , false);

      if(json == false){
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      if(type != "POST"){
        xhr.send();
      } else {
        xhr.send(body);
      }

      switch(xhr.status){
        case 500:
          cout("Внутрення ошибка сервера: " + http_code);
          return false;
        break;
        case 200:
        default:
          if("full" in o){
            return xhr;
          } else {
            return parse(xhr.responseText);
          }
        break;
      }
  };

  /*
  * Обработчик http.response ошибок
  * if errorChecker response === false -> ошибки есть
  **/
  var dataGetter = {
    errorChecker: function(errorList){
      var errorList = [].slice.call(errorList); // массив с ошибками из response

      if (errorList.length){
        var errors = [],
          errCout= [];

          $.each(errorList, function(index, value) {
            //console.log("Error: " + value.fieldName + " : " + value.message);
            errors.push(value.fieldName);
            errCout.push(value.message);
          });

          cout( errCout.join('<br>'), "red", errCout.length * 1300 );
          return {"status" : false, "data" : errors};
      } else {
        return { "status" : true };
      }

    },
    check : function(_data_, _object_){
      if(!_data_){
        cout("Data not found","red");
        return false;
      }

      if(_object_){
        var _json = _object_.client,
          http_code = _json.status,
          url = _json.responseURL;
      } else {
        var _json = parse(_data_),
          http_code = _json.http_code,
          url = _json.url;
      }
      
      switch(Number(http_code)){
        case 500:
          cout("Внутрення ошибка сервера: " + http_code);
          return {"status" : false};
        break;
        case 200:
        default:
          if(_object_){
            var response = parse(_json.response),
              errorList = response.errors;
          } else {
            var response = _json,
              errorList = _json.errors;
          }
          if(dataGetter.errorChecker(errorList).status){
            return {"status" : true};
          } else {
            return {"status" : false, "data" : errorList};
          }
        break;
      }
    }
  };

  // вывод ошибок и уведомлений
  var cout = function(data, type, ms){
    // временно в консоль
    console.log(data);
  }

/**************************************************************************************************/
  
  /**
   *  @name: Шаблонизатор
      used templayed.js
   */
  var compile = {
    thm: {}, // Сюда копятся шаблоны
    isset: function(key){
      var response = (key in this.thm) ? true : false;
        // Если уже загружали или нашли в localstorage - отдаём
        if(response){
          return response;
        } else {
          if(ls.get("thm_" + key) != null){
            this.thm[key] = ls.get("thm_" + key);
            return true;
          } else {
            return false;
          }
        }
    },
    load: function(key){ // Загрузка шаблона с сервера
      return parse(
        fileGetContent(thm + "?template=" + key)
      );
    },
    get: function(key, vars){ // Получение шаблона
      if(!vars) vars = {};
      console.time("Load New Template: " + key);
      if(this.isset(key)){
        return templayed(this.thm[key])(vars);
      } else {
        var nowObject = this.load(key);
          this.thm[key] = nowObject.response;
          ls.set('thm_' + key, nowObject.response);
          console.timeEnd("Load New Template: " + key);
          return templayed(nowObject.response)(vars);
      }
    }
  };

/**************************************************************************************************/

  // Функция получения XHR
  var newXhrGet = function(){
    var req = null;
    try{
      req = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e){
      try{
        req = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e){
        try {
          req = new XMLHttpRequest();
        } catch(e) {}
      }
    }

    if(req == null) throw new Error('XMLHttpRequest not supported');
    return req;
  }

  // упрощённый вариант получения data по url
  function fileGetContent(link){
    var req = newXhrGet();
    req.open("GET", link, false);
    req.send(null);
    
    return req.responseText;
  }

/**************************************************************************************************/

  /* localstorage
   */
  function supports_html5_storage(){ // Есть ли поддержка и необходим ли? (при режиме отладки)
    try{
      var res = 'localStorage' in window && window['localStorage'] !== null;
        if(res){
          if( localStorage.version != LOCALSTORAGE_VERSION || testmode){
            localStorage.clear();
            localStorage.setItem('version', LOCALSTORAGE_VERSION);
          }
          return res;
        } else {
          return res;
        }
    } catch (e) {
      return false;
    }
  }

  var ls = {
    all: function(){
      if(supports_html5_storage()){
        return localStorage;
      }
    },
    set: function(key, data){
      if(supports_html5_storage()){
        localStorage.setItem(key, data);
      }
    },
    get: function(key){
      if(supports_html5_storage()){
        return localStorage.getItem(key);
      }
    },
    remove: function(key){
      if(supports_html5_storage()){
        localStorage.removeItem(key);
      }
    },
    clear: function(){
      if(supports_html5_storage()){
        localStorage.clear();
      }
    }
  };


/**************************************************************************************************/
  /**
   *  @name: Сборщик повторно используемых параметров
   **/
  var ParamsBuilder = function(params, uniqueKeys){
    params = typeof params == "object" ? params : {};
    uniqueKeys = typeof uniqueKeys == "Array" ? uniqueKeys : null; // уникальный набор параметров

    var args = [].slice.call(arguments),
      ar = [];
    if(args[1]){
      for(var key in args[0]){
        if(args[1].indexOf(key) > -1){
          ar.push(key + "=" + encodeURIComponent(args[0][key]));
        }
      } 
    } else {
      for(var key in args[0]){
        ar.push(key + "=" + encodeURIComponent(args[0][key]));
      } 
    }
    var url = ar.join("&");
    return {
      array: ar.map(function(name){
        var sp = name.split("="),
          a = sp[0],
          b = sp[1];
        return [a, b];
      }),
      url: url
    }
  };

  /**
   *  @name: wall
   **/
  var wall = {
    timeForSee: 1300, // время просмотра поста
    count: 20,
    checkVisibleNow: [], // временный массив для хранения проверяемых на просмотр постов
    postsBlockId: "wall",
    wallPostMenuList: [
      {"type": "div", "class":"h5"},
      {"data": "Удалить","onClick": "$('#allblur').focus();"},
      {"data": "Редактировать","onClick": "$('#allblur').focus();"},
      {"type": "div", "class":"h5"}
    ],
    scrollWallListener: function(e){ // вызов в news.tpl
      var scrollTop = window.pageYOffset;
      // перебираем посты на экране
      document.querySelectorAll('.post').forEach(function(item, i, arr){
        // определяем центр перебираемого элемента
        var itemCenter = item.offsetTop + (item.clientHeight / 2);

        if(scrollTop < itemCenter  && itemCenter < (scrollTop + window.innerHeight)){
          // если данная координата сейчас на экране
          var postId = Number(item.dataset.id);
          // смотрим, не проверяем ли мы её на просмотр?
          if(wall.checkVisibleNow.indexOf(postId) === -1){
            // если не проверяем
            // смотрим - видно ли хотя бы 80% от содержимого изображения
            var postImage = document.querySelectorAll('.postId'+ postId +' img')[0],
              postVisible = isVisible(postImage);
            
            if(postVisible){
              // добавляем на проверку по времени
              wall.checkVisibleNow.push(postId);

              setTimeout(function(){
                var postVisibleNow = isVisible(postImage);

                if(postVisibleNow){
                  // Если спустя время всё ещё просматриваем -
                  // отправляем просмотр
                  wall.sendView(postId, function(){
                    //callback
                    var nowCount = parseInt($('#viewsCounter' + postId).html());
                      $('#viewsCounter' + postId).html( (nowCount+1) );
                    
                    if(!$('.postId' + postId+' .views').hasClass('active')){
                      $('.postId' + postId+' .views').addClass('active');
                    }
                  });
                } else {
                  // удаляем из массива проверок на просмотр
                  wall.checkVisibleNow.splice(wall.checkVisibleNow.indexOf(postId), 1);
                }
              }, wall.timeForSee);
            }
          }
        }
      });
    },
    addPost: function(cb){
      // добавление нового поста в ленту (уже просмотренные посты - не выводятся)
      var urlMethod = API + "posts.add";
      
      var xhrAddPost = new XMLHttpRequest();
        xhrAddPost.open("POST", urlMethod, true);
        xhrAddPost.setRequestHeader('Content-Type', 'application/json');
          
        xhrAddPost.onerror = function(data){
          cout("Error");
        }

        xhrAddPost.onload = function(data){
          var ret = dataGetter.check(data.currentTarget.responseText).status;

          if(ret){
            var response = parse(data.currentTarget.responseText),
              newPostId = Number(response.response.postId);

            // выводим новый пост
            var newPost = wall.get({id: newPostId});
            var addContent = "";

            newPost.items.forEach(function(item, i, arr){
              addContent += compile.get('wallpost', item);
            });
            
            $('#' + wall.postsBlockId).prepend(addContent);

            if(cb) cb();
          } else {
            console.log(data.currentTarget.responseText);
          }
        }

        xhrAddPost.send();
    },
    sendView: function(id, callback){
      if(!id) return;
      // отправляем просмотр поста
      var urlMethod = API + "posts.view";
      var response = http({
        url : urlMethod,
        body: {
          id: id
        },
        full : true
      });
      
      var ret = dataGetter.check(response.responseText).status;

      if(ret){
        if(callback){
          // обновляем счётчик
          if(parse(response.responseText).response.status) callback();
        }
      } else {
        console.log(response);
      }
    },
    get: function(params){
      // получени постов
      var urlMethod = API + "posts.get";
      var urlParams = new ParamsBuilder(params, ["count", "offset", "id"]);
      
      if(urlParams.array.length > 0){
        urlMethod += "?" + urlParams.url;
      }

      var response = http({
        url : urlMethod,
        type : "GET",
        full : true
      });
      
      var ret = dataGetter.check(response.responseText).status;

      if(ret){
        return parse(response.responseText).response;
      } else {
        console.log(response);
      }
    },
    view: function(params){
      // вывод постов
      var get = this.get(params), // получение
        addContent = "";
      

      if((!params.offset || params.offset == 0) && !("id" in params)){
        // очистка ленты
        $('#' + this.postsBlockId).html("");
        params.offset = 0;
      }

      if(get.count > 0){
        var itemsCount = get.items.length;
        
        // преобразование
        get.items.forEach(function(item, i, arr){
          addContent += compile.get('wallpost', item);
        });

        if(get.count > (params.offset + this.count)){
          var nowObjectIn = {};
          
          for(var key in params){
            nowObjectIn[key] = params[key];
          }

          nowObjectIn['offset'] +=  this.count;

          // добавление кнопки подгрузки
          addContent += preloadButton("Загрузить ещё <b>" + (get.count - (itemsCount + params.offset)) + "</b>..." , {
            "onClick" : " addedButton(this); wall.view(" + JSON.stringify(nowObjectIn) + "); return false;"
          });
        }
      } else {
        addContent = preloadButton("Контент не найден");
      }

      $('#' + this.postsBlockId).append( addContent );
    }
  };

  // проверка на видимость элемента на 80%
  function isVisible(elem) {
      var headerh = $('.header').height(); // учитываем высоту шапки
      var coords = elem.getBoundingClientRect(),
        wh = document.documentElement.clientHeight;
      
      var top = coords.top,
        bottom = coords.bottom;

      // % высоты элемента, которые необходимо видеть для visible=true
      var needPercentForVisible = ((elem.height / 100) * 80);

      var topVisible = top + needPercentForVisible > headerh && top + needPercentForVisible < wh,
        bottomVisible = bottom - needPercentForVisible < wh && bottom - needPercentForVisible > headerh;

      return (topVisible && bottomVisible) ? true : false;
    }
   
  /**
   *  @name: Сборщик $_GET параметров
   **/
   function $_GET(){
    var $_GET = {},
    __GET = window.location.search.substring(1).split("&");

    for(var i=0; i<__GET.length; i++){
      var getVar = __GET[i].split("=");

      if(__GET[i] != ""){
        $_GET[getVar[0]] = typeof(getVar[1]) == "undefined" ? "" : getVar[1];
      }
    }
    return $_GET;
  }

  // кнопка подгрузки
  function preloadButton(text, added){
    var ret = compile.get("preloadButton", {
      "text" : text
    });

    if(added){
      for(var key in added){
        switch(key){
          case "onClick":
            ret = $(ret).attr('onClick', added[key])[0].outerHTML;
          break;
        }
      }
    }
    return ret;
  }

  // преобразить кнопку подзагрузки
  function addedButton(element){
    $(element)
      .removeAttr("onClick")
      .find('font')[0]
      .remove();
    $(element)
      .removeClass()
      .addClass('addedData');
  }

  /* конструктор UI меню */
  var _UI_ = {
    generate: {
      menu: {
        item: function(obj, horizontal){
          var oncDefault = horizontal ? "_UI_.listMenu.select({horizontal:true,obj:this});"
                        : "_UI_.listMenu.select({obj:this});";
          
          var ret = document.createElement("type" in obj ? obj.type : 'li');
          
            if("onClick" in obj) $(ret).attr('onClick', oncDefault + obj.onClick);
            if("class" in obj) $(ret).attr('class', obj.class);
            if("style" in obj) $(ret).attr('style', obj.style);
            if("data" in obj) $(ret).html(obj.data);
          
            return ret.outerHTML; 
        },
        list: function(arr, horizontal){
          var ret = '<ul>';
            console.time("ListMenu");
            if(!horizontal){
              arr.forEach(function(it){
                ret += _UI_.generate.menu.item(it);
              });
            } else {
              arr.forEach(function(it){
                ret += _UI_.generate.menu.item(it, true);
              });
            }
            ret += '</ul>'
            console.timeEnd('ListMenu');
            return ret;
        }
      }
    },
    listMenu: {
      select: function(p){
        var hor = null;
        if("horizontal" in p){
          var hor = true;
        } else{
          var hor = false;
        }
        var selectClass = 'select';

        if("obj" in p){
          $.each($(p.obj).parent().parent().find('.' + selectClass), function(index, value){
            if($(value).hasClass(selectClass)){
              $(value).removeClass(selectClass);
            }
          });
          var selectel = $(p.obj).parent().parent().find('.selectel');
            if(selectel.length > 0){
              if(hor){
                var objOpt = {
                  left: $(p.obj)[0].offsetLeft + $(p.obj)[0].offsetWidth/2 - 20 + "px"
                };
              } else {
                var objOpt = {
                  top: $(p.obj).position().top + "px"
                };
              }
              $(selectel).animate(objOpt, 200);
            }
            $(p.obj).addClass(selectClass);
        }
      }
    },
    actionsMenu: {
      open: function(p){
        if('obj' in p && 'ev' in p && 'createId' in p){
          var x = $(p.obj)[0].offsetLeft,
            y = $(p.obj)[0].offsetTop + 5 + $(p.obj)[0].offsetHeight,
            createId = p.createId,
            nowEvent = $(p.obj).attr('onClick');

          if($('#' + createId).length < 1){
              $(p.obj).removeAttr('onClick');
              $(document.body)
                .prepend(
                  $(document.createElement('div'))
                    .attr('id', createId)
                    .attr('class', 'actionsMenu'+("class" in p ? ' ' + p.class : ''))
                    .attr('tabindex', '0')
                    .css({
                      'top'  : ("reY" in p ? y + p.reY : y),
                      'left' : ("reX" in p ? x + p.reX : x - 10),
                      'zIndex' : ("zIndex" in p ? p.zIndex : 1000),
                      'width' : ("width" in p ? p.width : 200)
                    }).focusout(function(){
                      _UI_.actionsMenu.close(createId, y, p.obj, nowEvent);
                    })
                );

                if("html" in p){
                  $('#' + createId).html(p.html);
                }

                $('#' + createId).focus();
          }
        }
      }, close: function(createId, y, obj, nowEvent){
        $('#' + createId).animate({
          opacity: 0
        }, 180, function(){
          $('#' + createId).remove();
          setTimeout(function(){
            $(obj).attr('onClick', nowEvent);
          }, 100);
        });
      }
    }
  };

    // Analog php function
  function str_replace(search, replace, subject, count){
    var i = 0,
      j = 0,
      temp = '',
      repl = '',
      sl = 0,
      fl = 0,
      f = [].concat(search),
      r = [].concat(replace),
      s = subject,
      ra = Object.prototype.toString.call(r) === '[object Array]',
      sa = Object.prototype.toString.call(s) === '[object Array]';
      s = [].concat(s);
      if(count){
        this.window[count] = 0;
      }
      for(i = 0, sl = s.length; i < sl; i++){
      if(s[i] === ''){
        continue;
      }
      for (j = 0, fl = f.length; j < fl; j++){
        temp = s[i] + '';
        repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
        s[i] = (temp).split(f[j]).join(repl);
        if(count && s[i] !== temp){
        this.window[count] += (temp.length - s[i].length) / f[j].length;
        }
      }
    }
    return sa ? s : s[0];
  }