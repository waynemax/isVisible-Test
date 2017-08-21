<?php
  /** @author Max Wayne
  * @filename core -> index.php
  * @e-mail iamvaustin@gmail.com
  *
  * @ru_description: Подключение ресурсов
  **/
  
  defined('allowed') ? true : exit("error#allowed");
  @error_reporting(E_ALL ^ E_WARNING ^ E_NOTICE);

  //configuration
  require_once(CORE_DIR.'/config.php');

  //check xhr
  $xhr = (($_SERVER['REQUEST_METHOD'] == "POST")) ? true : false;

  if(!$ireqfiles){ //$ireqfiles <- оригинальный набор файлов
    $ireqfiles = array(
      'names/strings.php', // строковые ресурсы
      'functions/functions.php',
      'functions/templates.php' // Шаблонизатор
    );
  }

  // Подключаемые скрипты
  $__JS__ = $config['js_files']; //подключение статики

  $logged = false;
  
  //исключающий файловый набор
  //$exclusion = array(require files); or !isset $ireqfiles of array
  if($exclusion){
    foreach($exclusion as $v){
      $key_exclusion = array_search($v, $ireqfiles);  
      unset($ireqfiles[$key_exclusion]);
    }
  }

  foreach($ireqfiles as $v){
    require_once($v); 
  }
?>