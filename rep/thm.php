<?php
	/** @author Max Wayne
	* @filename thm.php
	* @e-mail iamvaustin@gmail.com
	* @ru_description: Подгрузка шаблонов
	**/

	define('allowed',true);

	$ireqfiles = array(
		'names/strings.php',
		'functions/templates.php'
	);

	require_once('_.php');

	function responseCompile($response, $errors){
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
		"emptyTemplate" => array("emptyTemplate" => "enter template name"), // шаблон не выбран
		"templateNotFound" => array("templateNotFound" => "Not Found"), // шаблон не найден или не существует
	);

	$template = $_GET['template'];
	if($template){
		switch($template){
			/**
				* @name: Новостная лента
				* 
				**/ 
			case "/news":
				$response = @compile(
					array(
						'tpl' => 'news'
					)
				);
			break;
			/**
				* @name: Пост
				* 
				**/ 
			case "wallpost":
				$response = @compile(
					array(
						'tpl' => 'wall/wallpost'
					)
				);
			break;
			// кнопка подзагрузки
			case "preloadButton":
				$response = @compile(
					array(
						'tpl' => 'other_elements/preloadButton'
					)
				);
			break;
			default:
				array_push($errors, $errorList["templateNotFound"]);
			break;
		}
	} else {
		array_push($errors, $errorList["emptyTemplate"]);
	}

	echo responseCompile($response, $errors);
?>