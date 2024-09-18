const {
  readShoppingList,
  writeShoppingList,
  fetchItem,
  readDataBase,
  createItem,
  togglePurchasedItem,
} = require("./shoppingListDAO")

const { logger } = require("./util/logger")
const { v4: uuidv4 } = require("uuid")

let shoppingList = []

async function loadShoppingList() {
  try {
    shoppingList.push(await readDataBase())
  } catch (error) {
    console.error("failed to load shopping list")
  }
}

async function createGrocery(name, price) {
  let unique_key = uuidv4()
  let purchased = false
  let data = await createItem({
    Key: unique_key,
    name,
    price: parseFloat(price).toFixed(2),
    purchased,
  })
  return data
}

async function togglePurchased(index) {
  if (index >= 0 && index < shoppingList.length) {
    const item = shoppingList[index]
    try {
      const updatedItem = await togglePurchasedItem(item.key)
      shoppingList[index] = updatedItem
      return `${updatedItem.name} purchased`
    } catch (err) {
      console.log("failed to purchase item", err)
    }
  } else {
    logger.error(`Failed to toggle purchase: Invalid index - ${index}`)
    return "Invalid Item Index"
  }
}

function addItem(name, price) {
  const newItem = {
    name,
    price: parseFloat(price).toFixed(2),
    purchased: false,
  }
  shoppingList.push(newItem)
  writeShoppingList(shoppingList) // persist the updated list
  logger.info(`Added Item: ${newItem.name}`)
  return `${name} has been added to the shopping list`
}

// function togglePurchased(index) {
//   if (index >= 0 && index < shoppingList.length) {
//     shoppingList[index].purchased = !shoppingList[index].purchased
//     writeShoppingList(shoppingList) // persist the updated list
//     logger.info(
//       `Toggle Purchased: ${shoppingList[index].name}: ${shoppingList[index].purchased}`
//     )
//     return `Toggle purchase status of ${shoppingList[index].name}`
//   } else {
//     logger.error(`Failed to toggle purchase: Invalid index - ${index}`)
//     return "Invalid Item Index"
//   }
// }

function removeItem(index) {
  if (index >= 0 && index < shoppingList.length) {
    const removedItem = shoppingList.splice(index, 1)
    writeShoppingList(shoppingList) // persist the updated list
    logger.info(`Removed Item: ${removedItem[0].name}`)
    return `${removedItem[0].name} has been removed`
  } else {
    logger.error(`Failed to toggle purchase: Invalid index - ${index}`)
    return "Invalid Item Index"
  }
}

module.exports = {
  shoppingList,
  addItem,
  togglePurchased,
  removeItem,
  fetchItem,
  loadShoppingList,
  createGrocery,
}
