# Парсер тегов с сайта qna.habr.com

[![](https://travis-ci.com/toster-extension/toster-tags-parser.svg?token=VFf9QrVVyiw8FmrinqqQ&branch=master)](https://travis-ci.com/toster-extension/toster-tags-parser)
![](https://img.shields.io/david/toster-extension/toster-tags-parser.svg)


## Использование

**Используем в терминале:**

**Ставим глобально:**

```shell
$ yarn global add toster-tags-parser@git+ssh://git@github.com:toster-extension/toster-tags-parser.git
$ toster-tags-parser --pages 1 --output assets/tags.json
```

**Ставим как dev зависимость:**

```shell
$ yarn add -D toster-tags-parser@git+ssh://git@github.com:toster-extension/toster-tags-parser.git
$ ./node_modules/.bin/toster-tags-parser --pages 1 --output assets/tags.json
```

- - -

**Используем внутри секции scripts в файле package.json:**

```json
{
  "scripts": {
    "tags": "toster-tags-parser"
  }
}
```

```shell
$ yarn tags --pages 1 --output assets/tags.json
```

- - -

## Доступные опции

`-v[--version]` - версия пакета.

`-h[--help]` - подсказка по использованию пакета.

`-p[--pages]` - сколько страниц с тегами парсить. По-умолчанию параметр равен 60.

`-o[--output]` - путь к файлу для сохранения. Если не существует, то скрипт попытается его создать.

- - -

## Разработчику

**Начало работы**

```shell
$ git clone git@github.com:toster-extension/toster-tags-parser.git
$ cd toster-tags-parser
$ yarn
$ yarn build
```

**Собрать проект**

```shell
$ yarn build
```

**Запустить компилятор в режиме разработки**

```shell
$ yarn watch
```

**Проверить на ошибки TypeScript**

```shell
$ yarn lint
```

**Проверить на ошибки TypeScript и попробовать их исправить автоматически**

```shell
$ yarn lint:fix
```

**Запустить тесты**

```shell
$ yarn test
```
