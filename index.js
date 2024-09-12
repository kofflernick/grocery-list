const { eggs, milk, bread } = require("./groceries")

const readline = require("readline")
const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout, // Write to standard output (console)
})

const groceryList = []
const availableItems = { milk, bread, eggs }

function askForItem() {
  rl.question(
    "enter item name, 'buy' to begin purchases, or 'exit' to quit: ",
    (response) => {
      if (response.toLowerCase() === "exit") {
        rl.close()
        return
      } else if (response.toLowerCase() === "buy") {
        buyItems()
        function buyItems() {
          rl.question(
            "which item have you bought? type 'exit' to finish: ",
            (response) => {
              const item = availableItems[response]

              if (item) {
                item.bought = true
                console.log(`item bought: ${item.name}`)
                console.log(`current list:`, groceryList)
                buyItems()
              } else if (response.toLowerCase() === "exit") {
                rl.close()
                return
              } else {
                console.log("item not in list")
                buyItems()
              }
            }
          )
        }
      }

      const item = availableItems[response]

      if (item) {
        rl.question("enter the quantity: ", (response) => {
          item.quantity = response
          groceryList.push(item)
          console.log(`added item: ${item.name}`)
          console.log(`current list:`, groceryList)
          askForItem()
        })
      } else {
        askForItem()
      }
    }
  )
}

rl.on("close", () => {
  console.log("goodbye")
  console.log(`final list:`, groceryList)
})

askForItem()
