# Тестовое задание #

## Процесс установки ##

```bash
git clone https://github.com/ria-com/test-project-june-2017
cd test-project-june-2017
npm i
npm test
```

## Описание задания ##

Необходимо написать модуль, который бы конвертировал обычные строки в запросы к ElasticSearch по заданным правилам.

### Оценка результата выполнения ###

Основным критерием для оценки будет прохождение тестов, которые можно запустить командой: 

```bash
npm test
```

Дополнительными критериями является качество, чистота и документированность кода.

### Основные правила ###

1. Строка является валидной строкой GET-запроса. Это значит, что *параметры* в ней разделяются при помощи знака `&`
2. *Параметры* могут быть массивами, объединяться в группы и еще к ним могут применяться различные действия, например логическое `НЕ`
3. Результат работы модуля - сериализируемый при помощи метода `JSON.stringify` объект, который после сериализации превратится в валидный запрос к ElasticSearch
4. Имя параметра `group` зарезервировано для групп параметров (см. "Группы")

### Основные понятия ###

- `Параметр` - набор символов из букв английского алфавита (a-z, и большие в том числе), цифр (0-9), точки ('.') и квадратных скобок ('[' и ']')
- `Суффикс` - часть параметра после точки в конце
- `Индекс` - число внутри квадратных скобок
- `Название параметра` - всё, что не вошло в суффикс и индекс

### Примеры ###

Возьмем самый сложный случай: `price[0].gte`, где:

- **price** - *название параметра*
- **0** - *индекс*
- **gte** - *суффикс*

Простой вариант: `brand.id`, где:

- **brand.id** - *название параметра*

### Суффиксы ###

Они могут быть следующих видов:

1. `not` - логическое `НЕ`
2. `gte` - больше либо равно (>=)
3. `lte` - меньше либо равно (<=)

### Группы ###

Иногда необходимо объединить несколько параметров в одну логически связанную группу условий. Например, `brand` и `model`
есть смысл объединять логическим `И`, если они связаны. Ниже я опишу это в примерах конвертации. Пока что необходимо знать,
что сгруппировать параметры можно передав в параметре `group` их названия разделенные запятой, например: `group=brand,model`

### Примеры конвертации ###

1. Запрос на получение всех записей с `brand.id=9`:

```json
{
   "query": {
      "bool": {
         "must": [
            {"term": {"brand.id": {"value": "9"}}}
         ]
      }
   }
}
```

2. Запрос на получение всех записей в диапазоне `price.gte=5000&price.lte=10000`:

```json
{
   "query": {
      "bool": {
         "must": [
            {"range": {"price": {"gte": "5000", "lte": "10000"}}}
         ]
      }
   }
}
```

3. Запрос на получение всех записей, у которых `brand.id.not=9`:

```json
{
   "query": {
      "bool": {
         "must_not": [
            {"term": {"brand.id": {"value": "9"}}}
         ]
      }
   }

}
```

4. Запрос с несколькими группами параметров `brand.id[0]=9&model.id[0]=98&brand.id[1]=10&model.id[2]=113&group=brand.id,model.id`:

```json
{
   "query": {
      "bool": {
         "must": [
            {
               "bool": {
                  "must": [
                     {"term": {"brand.id": {"value":9}}},
                     {"term": {"model.id": {"value":98}}}
                  ]
               }
            },
            {
               "bool": {
                  "must": [
                     {"term": {"brand.id": {"value":10}}},
                     {"term": {"model.id": {"value":113}}}
                  ]
               }
            }
         ]
      }
   }
}
```

5. Запрос с группами параметров и исключением `brand.id[0].not=9&model.id[0].not=98&brand.id[1]=10&model.id[2]=113&group=brand.id,model.id`:

```json
{
   "query": {
      "bool": {
         "must_not": [
            {
               "bool": {
                  "must": [
                     {"term": {"brand.id": {"value":9}}},
                     {"term": {"model.id": {"value":98}}}
                  ]
               }
            }
         ],
         "must": [
            {
               "bool": {
                  "must": [
                     {"term": {"brand.id": {"value":10}}},
                     {"term": {"model.id": {"value":113}}}
                  ]
               }
            }
         ]
      }
   }
}
```

