<?php
  /** @author Max Wayne
  * @filename control.php
  * @e-mail iamvaustin@gmail.com
  **/

  define('allowed',true);

  // инклюдим необходимые файлы
  $ireqfiles = array(
    'db.php',
    'functions/functions.php'
  );

  require_once('_.php');

  // собрать ответ
  function responseBuilder($response, $errors){
    return json_encode(
      array(
        "errors" => $errors ? $errors : array(),
        "response" => $errors ? "" : $response
      )
    );
  }

  // ошибки
  $errors = array();
  // ответ
  $response = "";

  // список возможных ошибок
  $errorList = array(
    "methodNotFounded" => array("methodNotFounded" => "Метод не найден"),
    "empty" => array("empty" => "Метод не указан"),
    "noPost" => array("noPost" => "Данный метод поддерживает только POST запросы"),
    "onlyGET" => array("onlyGET" => "Данный метод поддерживает только GET запросы"),
    "error_postsAdd" => array("error_postsAdd" => "Ошибка при добавлении поста")
  );

  $method = $_GET['method'];
  if($method){
    switch($method){
      case "posts.get":
        /**
          * @name: Получение постов
          * 
          **/
        if(!$xhr){ // Если это GET запрос
          // Запрашиваемые поля
          $fields = array(
            "id", "src", "w_h", "views", "addition_time"
          ); 
          
           // Посты которые ещё не просмотрены
          $notViews = "`id` NOT IN(select post_id from views where who_viewed = '".$_SERVER['REMOTE_ADDR']."')";
          
          // Всего постов в таблице
          $postCountQuery = dbQuery("select COUNT(*) from posts where ".$notViews);
          $postCount = $postCountQuery['status'] ? intval(dbFetch($postCountQuery['data'])[0]) : die($postCountQuery['data']);

          // Параметры
          if($_GET){
            $count = $_GET['count'] ? intval($_GET['count']) : 20; // количество
            $offset = $_GET['offset'] ? intval($_GET['offset']) : 0; // смещение
            
            if($where == "") $where = "where ";

            if($_GET['id']){
              $id = intval($_GET['id']);
              $where.= "`id` = ".$id;
            } else {
              // Посты которые ещё не просмотрены
              $where.= $notViews;
            }
          }

          // Получаем посты
          $selectPosts = dbQuery("select ".join($fields, ", ")." from posts ".$where." limit ".$offset.",".$count.";");

          if($selectPosts['status']){ // Статус запроса к бд
            $postsFetch = dbFetch($selectPosts['data']);
            $posts = array();
            if($postsFetch){
              do {
                $item = array();
                // форматируем некоторые данные
                foreach ($fields as $key => $value) {
                  switch ($fields[$key]) {
                    case "addition_time":
                      $item[$value] = date("Y-m-d H:i:s", intval($postsFetch[$key]));
                    break;
                    default:
                      $item[$value] = $postsFetch[$key];
                    break;
                  }
                }
                array_push($posts, $item);
              } while($postsFetch = dbFetch($selectPosts['data']));
            } else {
              $posts = array();
            }
          }
          // отдаём
          $response = array(
            "count" => $postCount,
            "items" => $posts
          );
        } else {
          array_push($errors, $errorList["onlyGET"]);
        }
      break;
      /**
        * @name: Добавление просмотра поста
        * 
        **/ 
      case "posts.view":
        if($xhr){
          $data = json_decode(file_get_contents('php://input'));
          $id = intval($data->id);

          // если записи просмотра с данного айпи по посту не существует
          $sMyQuery = "select id from `views` where `post_id` = '{$id}' && `who_viewed` = '".$_SERVER['REMOTE_ADDR']."'";
          $selectMyView = dbQuery($sMyQuery);

          if($selectMyView['status']){
            $myViewsFetch = dbFetch($selectMyView['data']);
            if(count($myViewsFetch) > 0){
              $myViewsIsset = true;
            } else {
              $myViewsIsset = false;
            }
          }

          if(!$myViewsIsset){
            $viewsCounterUpdate = dbQuery("update `posts` set `views` = views+1 where `id` = '{$id}'");

            // добавляем просмотр
            $addViewQuery = "insert into `views` (`id`, `post_id`, `who_viewed`, `viewing_time`) values (NULL, '".$id."', '".$_SERVER['REMOTE_ADDR']."', '".time()."')";
            $addView = dbQuery($addViewQuery, "insert");
            $response = array(
              "id" => $id,
              "status" => true
            );
          } else {
            $response = array(
              "id" => $id,
              "status" => false
            );
          }
        } else {
          array_push($errors, $errorList["noPost"]);
        }
      break;
      /**
        * @name: Добавление поста
        * 
        **/ 
      case "posts.add":
        if($xhr){ // если POST
          
          // создаем новое изображение на сервере

          $nowtime = time();
          $heigthImage = mt_rand(150, 350); // высота
          $widthImage = 518; //ширина
          $versionGetImage = mt_rand(1, 9999999); // Чтобы изображение не кешировалось

          // ссылка на источник
          $image = "https://unsplash.it/".$widthImage."/".$heigthImage."/?random&v=".$versionGetImage;
          $newImageName = md5($nowtime)."_".$widthImage."_".$heigthImage;
          $url = $config['url'].DIRECTORY_SEPARATOR; // наш url
          $path = "uploads/images/".$newImageName.".jpg"; // куда сохранять
          $fullSrc = $url.$path;
          
          $fgc = file_get_contents($image);
          file_put_contents($path, $fgc);

          $addPost = dbQuery(
            "insert into `posts` (`id`, `src`, `w_h`, `views`, `addition_time`)
            values (NULL, '{$fullSrc}', '{$widthImage}_{$heigthImage}', '0', '{$nowtime}');",
            "insert"
          );
                  
          if($addPost["status"]){

            // Если всё нормально получаем добавленный пост и добавлем к результату
            $insertId = intval($addPost['data']);
            $response = array(
              "postId" => $insertId
            );

          } else {
            array_push($errors, $errorList["error_postsAdd"]);
          }
          
        } else {
          array_push($errors, $errorList["noPost"]);
        }
      break;

      default:
        array_push($errors, $errorList["methodNotFounded"]);
      break;
    }
  } else {
    array_push($errors, $errorList["empty"]);
  }

  echo responseBuilder($response, $errors);
?>
