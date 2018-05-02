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
        cashierFlow();
    });
}

function cashierFlow() {
    inquirer.prompt([
        {
            name: "idnumber",
            type: "input",
            message: "Please enter the item ID of your desired purchase"
        },
        {
            name: "quantity",
            type: "input",
            message: "How many units would you like to buy?"
        }
    ])
}