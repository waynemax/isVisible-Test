# vktest
DEMO: <a href="http://likesoul.com">likesoul.com</a>

<b>JS</b>:  engine\static\scripts\<br>
<b>LESS</b>:  engine\static\styles\<br>
<b>TEMPLATES</b>:  \engine\templates\main\tpl<br>
<b>DB_STRINGS</b>:  \engine\core\config.php<br>

Основные файлы: main.js, control.php

# API

GET http://likesoul.com/control/posts.get - Получение постов<br>
vars: $id, @offset, $count
<br><br>
POST http://likesoul.com/control/posts.add - Добавление поста<br>
<br>
POST http://likesoul.com/control/posts.view - Добавление поста<br>
vars: $id
