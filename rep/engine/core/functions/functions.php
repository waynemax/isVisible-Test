<?php
  /** @author Max Wayne
  * @filename core -> functions
  * @e-mail iamvaustin@gmail.com
  **/

  /**
  * CURL
  * Example:
  *
  *   function withdrawal($array){
  *     $cookie = $GLOBALS['cookie'];
  *     $getUrl = $GLOBALS['apiSrc'];
  *     $getUrl.= 'v2/money/cash-out';
  *     return curl(array(
  *       "type" => "POST",
  *       "data" => json_encode($array),
  *       "url" => $getUrl,
  *       "headers" => array(
  *         "Content-Type: application/json",
  *         "Authorization: Bearer ".$cookie['access_token']
  *       ),
  *       "typeOut" => array("response") //(info)
  *     ));
  *   }
  **/
  function curl($array){
      
    $type = $array['type']; //тип запроса
    $url = $array['url'];
    
    if($type == "POST") $data = $array['data'];
      
    $ch = curl_init();
    
    curl_setopt($ch, CURLOPT_URL, $url); //URL
    curl_setopt($ch, CURLOPT_HTTPHEADER, $array['headers']); //включаемые заголовки
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //вернуть результат
    
    if($type == "POST") curl_setopt($ch, CURLOPT_POST, true); //POST запрос
    
    if($array['typeOut'][0] == "info") curl_setopt($ch, CURLOPT_HEADER, true); //включить заголовки
    if($array['typeOut'][0] == "info") curl_setopt($ch, CURLINFO_HEADER_OUT, true); //вернуть заголовки
    
    if($type == "POST") curl_setopt($ch, CURLOPT_POSTFIELDS, $data); //отправляемые данные
      
    $out = curl_exec($ch);
    $outInfo = curl_getinfo($ch);
    
    curl_close($ch);
    
    switch($array['typeOut'][0]){
      case "response":
        $return = $out;
        if($array['typeOut'][1] == "json"){
          $return = json_encode($return);
        }
        return $return;
      break;  
      case "info":
        $return = $outInfo;
        if($array['typeOut'][1] == "json"){
          $return = json_encode($return);
        }
        return $return;
      break;
    }
  }

  /** 
  * @ru_description: Вывод на экран
  **/
  function cout($data, $json = false){
    if($json){
      print json_encode($data);
    } else {
      print_r($data);
    }
    exit;
  }

  /** 
  * @ru_description: Подгрузка страницы в JS
  **/
  function jsCompile($link, $type){
    return '<script type="text/javascript">_layers._load("'.$link.'","'.$type.'");</script>';
  }
  
  /** 
  * @ru_description: Вывести подключаемые скрипты
  **/
  function js($__JS__){
    global $__NAMES__;
    $i = 0;
    $js_plus ='';
    do{
      $js_plus.= '<script type="text/javascript" src="'.$__NAMES__['js_dir']."/".$__JS__[$i].'.js"></script>';
      $i++;
    } while($i < (count($__JS__)));
    return $js_plus;
  }

  /** 
  * @ru_description: Валидация при запросах
  **/
  function esql($text){
    $text = mysql_real_escape_string(strip_tags(htmlspecialchars(stripslashes(addslashes($text)))));
    return $text;
  }

  /** 
  * @ru_description: Валидация
  **/
  function epost($text){
    $text = strip_tags(htmlspecialchars(stripslashes(addslashes($text))));
    return $text;
  }

?>