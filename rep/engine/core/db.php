<?php
  /** @author Max Wayne
  * @filename db.php
  * @e-mail iamvaustin@gmail.com
  **/
  
  function dbConnect(){
    global $config;
    return mysqli_connect(
      $config['DB']['DB_HOST'],
      $config['DB']['DB_USERNAME'],
      $config['DB']['DB_PASSWORD'],
      $config['DB']['DB_TABLE']
    );
  }

  $linkbd = dbConnect();

  mysqli_query($linkbd, "SET NAMES utf8");
  mysqli_query($linkbd, "SET CHARACTER SET 'utf8'");
  mysqli_query($linkbd, "SET SESSION collation_connection = 'utf8_general_ci'");

  function dbQuery($query, $type){
    global $linkbd;
    $result = mysqli_query($linkbd, $query);
    
    if($type == "insert"){
      $insertId = mysqli_insert_id($linkbd);
    }

    if($result){
      $status = true;
      $data = $result;
    } else {
      $status = false;
      $data = ("MySQL query failed: {$query} <br> ".mysqli_error($linkbd));
    }

    return array(
      "status" => $status,
      "data" => $status ? $type == "insert" ? $insertId : $data : $data
    );

  }

  function dbFetch($query){
    return mysqli_fetch_array($query);     
  }

?>