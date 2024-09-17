const http = require("http")
const {
  shoppingList,
  addItem,
  togglePurchased,
  removeItem,
  loadShoppingList,
} = require("./shoppingListFunctions")
const { logger } = require("./util/logger")

const PORT = 3000

const server = http.createServer((req, res) => {
  let body = ""

  req
    .on("data", (chunk) => {
      body += chunk
    })
    .on("end", async () => {
      body = body.length > 0 ? JSON.parse(body) : {}

      const contentType = { "Content-Type": "application/json" }

      if (req.url.startsWith("/items")) {
        logger.info(req.url.split("/"))
        let index = parseInt(req.url.split("/")[2])

        switch (req.method) {
          case "POST":
            const { name, price } = body
            if (!name || !price) {
              res.writeHead(400, contentType)
              res.end(
                JSON.stringify({
                  message: "Please provide valid name and price",
                })
              )
            } else {
              const message = addItem(name, price)
              res.writeHead(201, contentType)
              res.end(JSON.stringify({ message, shoppingList }))
            }
            break

          case "GET":
            try {
              await loadShoppingList() // Await loading the shopping list
              res.writeHead(200, contentType)
              res.end(
                JSON.stringify({
                  shoppingList,
                })
              )
            } catch (error) {
              res.writeHead(500, contentType)
              res.end(
                JSON.stringify({ message: "Failed to load shopping list" })
              )
            }
            break

          case "PUT":
            const putMessage = togglePurchased(index)
            res.writeHead(200, contentType)
            res.end(JSON.stringify({ putMessage, shoppingList }))
            break

          case "DELETE":
            const deleteMessage = removeItem(index)
            res.writeHead(200, contentType)
            res.end(JSON.stringify({ deleteMessage, shoppingList }))
            break

          default:
            res.writeHead(405, contentType)
            res.end(JSON.stringify({ message: "Invalid Method" }))
            break
        }
      } else {
        res.writeHead(404, contentType)
        res.end(JSON.stringify({ message: "Invalid Endpoint" }))
      }
    })
})

server.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`)
})
