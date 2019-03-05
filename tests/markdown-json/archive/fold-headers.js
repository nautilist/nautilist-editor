const beautify = require("json-beautify");
var traverse = require('traverse');

let headings = [
  {
    "name": "list 1",
    "depth": 1,
    "_id": "iJO0AUZx2",
    "description": "",
    "features": [
      {
        "name": "sublist 1",
        "depth": 2,
        "description": "",
        "_id": "F48LfS9nlW",
        "features": [
          {
            "name": "sublist 1 - feature 1",
            "depth": 3,
            "_id": "FMnVYMBlw2",
            "description": "",
            "features": []
          },
          {
            "name": "sublist 1 - feature 2",
            "depth": 3,
            "_id": "uYgvfT5CgTB",
            "description": "",
            "features": []
          },
          {
            "name": "sublist 1 - feature 3",
            "depth": 3,
            "_id": "EaEbhKHm0X6",
            "description": "",
            "features": []
          },
          {
            "name": "sublist 1 - feature 4",
            "depth": 3,
            "_id": "3P063-W51ep",
            "description": "",
            "features": []
          }
        ]
      },
      {
        "name": "sublist 2",
        "depth": 2,
        "description": "",
        "_id": "327BWcVxHy4",
        "features": [
          {
            "name": "sublist 2 - feature 1",
            "depth": 3,
            "_id": "UJ-WFdY1Dz1",
            "description": "",
            "features": []
          },
          {
            "name": "sublist 2 - feature 2",
            "depth": 3,
            "_id": "0kT7UypT8HE",
            "description": "",
            "features": []
          },
          {
            "name": "sublist 2 - feature 3",
            "depth": 3,
            "_id": "TLzXwdK9wUd",
            "description": "",
            "features": []
          }
        ]
      }
    ]
  },
  {
    "name": "sublist 1",
    "depth": 2,
    "description": "",
    "_id": "F48LfS9nlW",
    "features": [
      {
        "name": "sublist 1 - feature 1",
        "depth": 3,
        "_id": "FMnVYMBlw2",
        "description": "",
        "features": []
      },
      {
        "name": "sublist 1 - feature 2",
        "depth": 3,
        "_id": "uYgvfT5CgTB",
        "description": "",
        "features": []
      },
      {
        "name": "sublist 1 - feature 3",
        "depth": 3,
        "_id": "EaEbhKHm0X6",
        "description": "",
        "features": []
      },
      {
        "name": "sublist 1 - feature 4",
        "depth": 3,
        "_id": "3P063-W51ep",
        "description": "",
        "features": []
      }
    ]
  },
  {
    "name": "sublist 1 - feature 1",
    "depth": 3,
    "description": "",
    "_id": "FMnVYMBlw2",
    "features": []
  },
  {
    "name": "sublist 1 - feature 2",
    "depth": 3,
    "description": "",
    "_id": "uYgvfT5CgTB",
    "features": []
  },
  {
    "name": "sublist 1 - feature 3",
    "depth": 3,
    "description": "",
    "_id": "EaEbhKHm0X6",
    "features": []
  },
  {
    "name": "sublist 1 - feature 4",
    "depth": 3,
    "description": "",
    "_id": "3P063-W51ep",
    "features": [
      {
        "name": "sublist 1 - feature 4 - item 1",
        "depth": 4,
        "_id": "-dwJuCYvUQw",
        "description": "",
        "features": []
      },
      {
        "name": "sublist 1 - feature 4 - item 2",
        "depth": 4,
        "_id": "NoLXEgC-8E7",
        "description": "",
        "features": []
      }
    ]
  },
  {
    "name": "sublist 1 - feature 4 - item 1",
    "depth": 4,
    "description": "",
    "_id": "-dwJuCYvUQw",
    "features": []
  },
  {
    "name": "sublist 1 - feature 4 - item 2",
    "depth": 4,
    "description": "",
    "_id": "NoLXEgC-8E7",
    "features": []
  },
  {
    "name": "sublist 2",
    "depth": 2,
    "description": "",
    "_id": "327BWcVxHy4",
    "features": [
      {
        "name": "sublist 2 - feature 1",
        "depth": 3,
        "_id": "UJ-WFdY1Dz1",
        "description": "",
        "features": []
      },
      {
        "name": "sublist 2 - feature 2",
        "depth": 3,
        "_id": "0kT7UypT8HE",
        "description": "",
        "features": []
      },
      {
        "name": "sublist 2 - feature 3",
        "depth": 3,
        "_id": "TLzXwdK9wUd",
        "description": "",
        "features": []
      }
    ]
  },
  {
    "name": "sublist 2 - feature 1",
    "depth": 3,
    "description": "",
    "_id": "UJ-WFdY1Dz1",
    "features": []
  },
  {
    "name": "sublist 2 - feature 2",
    "depth": 3,
    "description": "",
    "_id": "0kT7UypT8HE",
    "features": []
  },
  {
    "name": "sublist 2 - feature 3",
    "depth": 3,
    "description": "",
    "_id": "TLzXwdK9wUd",
    "features": []
  }
]





// let checks = headings.slice(1,);
// let result = headings[0]

// function fold(_headings){
//     let headings = Object.assign({}, _headings);


//     // let checks = 
    
//     return headings;

// }

// let test = fold(headings);

// 


let test = headings.reduce( (result, item, index, array) => {
    // on first pass set the depth 1 to the parent
    if(item.depth == 1){
        result = item;
    }

    // 



    
    // result = {}

    return result
}, {})

console.log(beautify(test, null, 2, 40))