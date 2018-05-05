var mysql = require("mysql");
var inquirer = require("inquirer");
var itemId;
var itemObject;
var itemPrice;

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

            itemId = inquirerResponse.idnumber;

            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, { item_id: itemId }, function (err, res) {
                if (err) throw err;

                itemObject = res[0];
                var itemName = res[0].product_name;
                itemPrice = res[0].price.toFixed(2);

                console.log("Product Name: " + itemName)
                console.log("Price: $" + itemPrice)
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

            var query = "SELECT stock_quantity FROM products WHERE ?";
            connection.query(query, { item_id: itemId }, function (err, res) {
                if (err) throw err;

                var databaseQuantity = res[0].stock_quantity;

                if (numOfUnits <= databaseQuantity) {
                    console.log("Product in Stock!")

                    var updateSQL = "UPDATE products SET stock_quantity = " + (databaseQuantity - numOfUnits) + " WHERE item_id = " + itemId;
                    //console.log(updateSQL)
                    connection.query(updateSQL, function (err, res) {
                        if (err) throw err;

                        console.log("Thank you for placing your order. Your total is: ");
                        console.log("$ " + itemPrice * numOfUnits);
                        console.log("....................................................")
                    });
                }
                else {
                    console.log("Out of Stock!")
                    console.log("Please select a lesser quantity")
                    checkStock();
                }
            })
        })
}