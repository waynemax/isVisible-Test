<?php
  /** @author Max Wayne
  * @filename core -> config.php
  * @e-mail iamvaustin@gmail.com
  **/

  $config = array(
    "url" => $_SERVER['HTTP_X_FORWARDED_PROTO']."://".$_SERVER['HTTP_HOST'],
    "js_files" => array('jq.min', 'less', 'templayed', 'main'),
    "DB" => array(
      'DB_HOST'     => 'localhost',
      'DB_USERNAME' => '*****USERNAME*****',
      'DB_PASSWORD' => '*****PASSWORD*****',
      'DB_TABLE'    => '*****DB_TABLE*****'
      )
  );

?>