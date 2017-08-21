<?php
  /** @author Max Wayne
  * @filename core -> functions -> templates.php
  * @e-mail iamvaustin@gmail.com
  * @ru_description: Шаблонизатор
  **/
  
  function compile($p){
    
    global  $__NAMES__,
        $logged;
    
    $dir = $__NAMES__['tpldir'];
    $ext = '.tpl';

    $template = ($p['tpl']  == '' || !file_exists($dir . $p['tpl'] . $ext )) 
          ? print_r('<!-- Not Found: ' . $p['tpl'] . '-->')
          : file_get_contents($dir . $p['tpl'] . $ext);

    $vars = array(
      '{sitename}'=> $__NAMES__['sitename']
    ); 

    if($logged){

      $preg["'\\[not-logged\\](.*?)\\[/not-logged\\]'si"] = '';
      $vars['[logged]'] = ''; 
      $vars['[/logged]'] = '';

    } else {

      $preg["'\\[logged\\](.*?)\\[/logged\\]'si"] = '';
      $vars['[not-logged]'] = ''; 
      $vars['[/not-logged]'] = '';  

    }
    
    if($p['code'] && is_array($p['code']) && count($p['code'])){
      
      foreach($p['code'] as $k=>$v){ 
        if($v == 1){

          $vars['['.$k.']'] ='';
          $vars['[/'.$k.']'] ='';

        } elseif($v == 0)
          $preg["'\\[".$k."\\](.*?)\\[/".$k."\\]'si"] = '';
      }
    }

    if($p['vars'] && is_array($p['vars']) && count($p['vars'])){

      foreach($p['vars'] as $k1 => $v1){
        $vars['{'.$k1.'}'] =  $v1;
      }

    }

    return (
      preg_replace(
          array_keys($preg),
          array_values($preg),
          str_replace(array_keys($vars), array_values($vars), $template)
        )
      );
  }

?>