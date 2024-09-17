// DAO
// Data Access Object
// Design pattern focused on isolating database interaction to a single object that can be used throughout the application whenever a developer wants to do some kind of persistence

const fs = require("fs")
const path = require("path")
const { logger } = require("./util/logger")

const { DynamoDBClient } = require(`@aws-sdk/client-dynamodb`)
const {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb")
const client = new DynamoDBClient({ region: "us-east-1" })
const documentClient = DynamoDBDocumentClient.from(client)

const getCommand = new GetCommand({
  TableName: "grocery_list",
  Key: { Key: "1" },
})

const scanCommand = new ScanCommand({
  TableName: "grocery_list",
})

async function fetchItem() {
  try {
    const data = await documentClient.send(getCommand)
    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

async function readDataBase() {
  try {
    const data = await documentClient.send(scanCommand)
    return data.Items
  } catch (err) {
    console.error("error fetching items", err)
  }
}

// Path to the data file
const filePath = path.join(__dirname, "data.json")

// CRUD
// Create
function writeShoppingList(shoppingList) {
  fs.writeFileSync(filePath, JSON.stringify(shoppingList, null, 2))
  // log some info
  logger.info("Shopping list updated in data.json")
}

// Read
function readShoppingList() {
  if (!fs.existsSync(filePath)) {
    // if file does not exist, create an empty shopping list
    fs.writeFileSync(filePath, JSON.stringify([]))
  }

  const data = fs.readFileSync(filePath, "utf8")
  return JSON.parse(data)
}

// Update

// Delete

module.exports = {
  readShoppingList,
  writeShoppingList,
  fetchItem,
  readDataBase,
}
