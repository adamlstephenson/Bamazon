var mysql = require("mysql");
var inquirer = require("inquirer");

// Database Connection
//============================================================================================

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    displayItems();
});

//============================================================================================

// Functions
// ===========================================================================================

function displayItems() {
    var itemQuery = "SELECT item_id, product_name, price FROM products";

    connection.query(itemQuery, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product: " + res[i].product_name + " || Price: " + res[i].price)
        }
        console.log("....................................................")
        selectItem();
    });
}

function selectItem() {
    inquirer.prompt([
        {
            name: "idnumber",
            type: "input",
            message: "Please enter the item ID of your desired purchase"
        },
    ]).
        then(function (inquirerResponse) {
            var itemId = inquirerResponse.idnumber;

            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { item_id: itemId }, function (err, res) {
                if (err) throw err;

                console.log("Product Name: " + res[0].product_name)
                console.log("Price: " + res[0].price)
                console.log("....................................................")

                if (res.length === 0) {
                    console.log("Please select a valid Item ID")
                }
                checkStock();
            })
        })
}

function checkStock() {

    inquirer.prompt([
        {
            name: "quantity",
            type: "input",
            message: "How many units would you like to buy?"
        }
    ]).
        then(function (inquirerResponse) {
            var numOfUnits = inquirerResponse.quantity;

            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { item_id: itemId }, function (err, res) {
                if (err) throw err;

                
            })
        })
}