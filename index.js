// Import the readline module for handling user input in the console
const readline = require("readline")
const rl = readline.createInterface({
  input: process.stdin, // Read from standard input (keyboard)
  output: process.stdout, // Write to standard output (console)
})

rl.on("line", (line) => {
  console.log(line)
})

rl.once("close", () => {
  // end of input
  console.log("Goodbye")
})

rl.question("Enter name:", (name) => {
  console.log(name)
})
