# vktest
DEMO: <a href="http://likesoul.com">likesoul.com</a>

<b>JS</b>:  engine\static\scripts\
<b>LESS</b>:  engine\static\styles\
<b>TEMPLATES</b>:  \engine\templates\main\tpl
<b>DB_STRINGS</b>:  \engine\core\config.php

Основные файлы: main.js, control.php

# API

GET http://likesoul.com/control/posts.get - Получение постов
vars: $id, @offset, $count

POST http://likesoul.com/control/posts.add - Добавление поста

POST http://likesoul.com/control/posts.view - Добавление поста
vars: $id
