<?php
  /** @author Max Wayne
  * @filename index.php
  * @e-mail iamvaustin@gmail.com
  * @ru_description: Тестовое задание
  **/

  define('allowed',true);
  require_once('_.php');
  $js = js($__JS__);
  
  $content = jsCompile('/news','pageinit');
  require_once("engine/main.php");
?>