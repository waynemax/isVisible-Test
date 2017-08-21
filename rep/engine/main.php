<?php
  /**
   * Вывод основного шаблона
   **/
  echo @compile(array(
      'tpl' => $main_tpl ? $main_tpl : 'main',
      'vars' => array(
        'title' => $__NAMES__['sitename'],
        'js' => $js,
        'menu' => @compile(array(
          'tpl' => 'other_elements/menu'
        )),
        'header' => @compile(array(
          'tpl' => 'headers/main',
          'vars' => array(
            'IP' => $_SERVER['REMOTE_ADDR']
          )
        )),
        'content' => $content,
        'lessRandomVersion' => mt_rand(1, 999999)
      )
    ));
?>