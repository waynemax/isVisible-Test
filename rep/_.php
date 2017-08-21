<?php
  /** @author Max Wayne
  * @filename _.php
  * @e-mail iamvaustin@gmail.com
  * @ru_description: Подключение "паттерна"
  **/
  
  @session_start();
  define('ROOT_DIR', __DIR__);
  define('CORE_DIR', __DIR__."/engine/core");
  require_once(CORE_DIR.'/index.php');
?>