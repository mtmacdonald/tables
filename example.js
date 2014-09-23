var rows = {
    "rows": [
        {
            "meta": {
                "indentation": 0
            },
            "data": [
                {
                    "meta": {},
                    "value": "458973"
                },
                {
                    "meta": {},
                    "value": "Banana"
                },
                {
                    "meta": {},
                    "value": "Fruit"
                },
                {
                    "meta": {},
                    "value": "600"
                },
                {
                    "meta": {},
                    "value": "Received"
                }
            ]
        },
        {
            "meta": {
                "indentation": 0
            },
            "data": [
                {
                    "meta": {},
                    "value": "753951"
                },
                {
                    "meta": {},
                    "value": "Pomegranate"
                },
                {
                    "meta": {},
                    "value": "Fruit"
                },
                {
                    "meta": {},
                    "value": "50"
                },
                {
                    "meta": {},
                    "value": "Accepted"
                }
            ]
        },
        {
            "meta": {
                "indentation": 0
            },
            "data": [
                {
                    "meta": {},
                    "value": "793182"
                },
                {
                    "meta": {},
                    "value": "Radish"
                },
                {
                    "meta": {},
                    "value": "Vegetable"
                },
                {
                    "meta": {},
                    "value": "1000"
                },
                {
                    "meta": {},
                    "value": "Received"
                }
            ]
        },
        {
            "meta": {
                "indentation": 0
            },
            "data": [
                {
                    "meta": {},
                    "value": "468291"
                },
                {
                    "meta": {},
                    "value": "Potato"
                },
                {
                    "meta": {},
                    "value": "Vegetable"
                },
                {
                    "meta": {},
                    "value": "200"
                },
                {
                    "meta": {},
                    "value": "Ordered"
                }
            ]
        },
        {
            "meta": {
                "indentation": 0
            },
            "data": [
                {
                    "meta": {},
                    "value": "548621"
                },
                {
                    "meta": {},
                    "value": "Rocket"
                },
                {
                    "meta": {},
                    "value": "Vegetable"
                },
                {
                    "meta": {},
                    "value": "80"
                },
                {
                    "meta": {},
                    "value": "Ordered"
                }
            ]
        },
        {
            "meta": {
                "indentation": 0
            },
            "data": [
                {
                    "meta": {},
                    "value": "783524"
                },
                {
                    "meta": {},
                    "value": "Carrot"
                },
                {
                    "meta": {},
                    "value": "Vegetable"
                },
                {
                    "meta": {},
                    "value": "300"
                },
                {
                    "meta": {},
                    "value": "Accepted"
                }
            ]
        },
        {
            "meta": {
                "indentation": 0
            },
            "data": [
                {
                    "meta": {},
                    "value": "856429"
                },
                {
                    "meta": {},
                    "value": "Grape"
                },
                {
                    "meta": {},
                    "value": "Fruit"
                },
                {
                    "meta": {},
                    "value": "400"
                },
                {
                    "meta": {},
                    "value": "Ordered"
                }
            ]
        },
        {
            "meta": {
                "indentation": 0
            },
            "data": [
                {
                    "meta": {},
                    "value": "782467"
                },
                {
                    "meta": {},
                    "value": "Apple"
                },
                {
                    "meta": {},
                    "value": "Fruit"
                },
                {
                    "meta": {},
                    "value": "800"
                },
                {
                    "meta": {},
                    "value": "Ordered"
                }
            ]
        }
    ],
    "meta": {
        "queryFrom": 0,
        "matchCount": 25,
        "headings": [
            {
                "name": "Product Code",
                "width": "20%"
            },
            {
                "name": "Name",
                "width": "20%"
            },
            {
                "name": "Category",
                "width": "20%"
            },
            {
                "name": "Stock Count",
                "width": "20%"
            },
            {
                "name": "Status",
                "width": "20%"
            }
        ]
    }
};

$(document).ready(function() {

    var options = {
        'rows' : rows, //row JSON object (see also below)
        'url' : 'example.json', //url to fetch row JSON (see also below)
        'queryCount' : 8, //how many rows to show per page
        'enabled' : true, //only operates when enabled is true
        'showIndex' : false //display an optional column showing the row index
    }

    //instantiate a table on an empty element
    $('#table').table(options);

    //either call render ()
    $('#table').table('render');

    //or call the draw method which fetches the JSON from options.url
    //$('#table').table('draw');

});