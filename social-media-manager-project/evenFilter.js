// Write a code to filter out only even numbers from user given array input

let arrNum = [];

function filterFunc(arrNum) {
  return arrNum.filter((num) => num % 2 === 0);
}
const userInput = prompt("Enter numbers separated by commas:");
const numbers = userInput.split(",").map(Number);

const evenNumbers = filterFunc(numbers);
console.log("Even numbers: ", evenNumbers);