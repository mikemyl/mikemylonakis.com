---
title:  "Json Umarshalling in go"
permalink: /notebook/go-json/
excerpt: "How to unmarshall (decode) Json in go onto a map, without defining a struct"
toc: true
toc_sticky: true
last_modified_at: 2021-09-22T18:00:00-04:00
---

## Json Unmarshalling in go

Here is how to decode Json in go, without having to define a struct. 

TL;DR : Json objects can be unmarshalled into an `map[string]interface{}`, and Json arrays
into a `[]interface{}`.

```go
// Unmarshal json object
j := `
{
    "id": "foo",
    "details": {
        "color" : "red"
    }
}
`
jsonObject := []byte(j)
var jsonObj map[string]interface{}
_ = json.Unmarshal(jsonObject, &jsonObj)
id := jsonObj["id"]
details := jsonObj["details"]
color := details.(map[string]interface{})["color"]
fmt.Println(id, color, "\n\n")

// Unmarshal json array
j = `
[
    {
        "id": "bar",
        "details": {
            "color" : "green"
        }
    },
    {
        "id": "baz",
        "details": {
            "color" : "blue"
        }
    }
]
`
jsonArray := []byte(j)
var array []interface{}
_ = json.Unmarshal(jsonArray, &array)
for _, item := range array {
	jsonObj = item.(map[string]interface{})
	id = jsonObj["id"]
	details = jsonObj["details"]
	color = details.(map[string]interface{})["color"]
	fmt.Println(id, color)
}
```