// libraries and inports ```

const prompt = require('prompt-sync')();

// global variables ```

const ROWS = 3                   // no of reels
const COLS = 3                  // no of symbols that will appear in each reel

// object SYMBOL_COUNT
// NO. of symbols in each reel/column( not balanced )
const SYMBOLS_COUNT = {
    A : 2,                      // here, key(property/attribute) "A" is mapped to value 2 : SYMBOL_COUNT["A"] -> 2
    B : 4,                      // here, key(property/attribute) "B" is mapped to value
    C : 6,
    'D' : 8                     // ''/"" not needed for keys in JS but needed for PYTHON
}

const SYMBOL_VALUE = {
    "A" : 5,                    // i.e. payout for a line of A's (a line of A's, multiply that by 5)
    "B" : 4,                    // i.e. payout for a line of B's
    "C" : 3,                    // i.e. payout for a line of C's
     D : 2,                    // i.e. payout for a line of D's
}
// functions and classes ```

const deposit = () => {
    while(true) {
    const depositAmount = prompt("Enter the amount to deposit: ");
    const numberDepositAmount = parseFloat(depositAmount);
    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) { // NaN : not a number
        console.log("Invalid deposit , enter again.");
    }
    else {
        return numberDepositAmount;
    }
}
}
const getLines = () => {
    while(true) {
    const Lines = prompt("Enter the no. of lines to bet on.(1-3): ");
    const numberOfLines = parseFloat(Lines);
    if (isNaN(numberOfLines) || numberOfLines < 0 || numberOfLines > 3)  {
        console.log("Invalid number of lines, enter again.");
    }
    else {
        return numberOfLines;
    }

}
}


// FUNCTION to spin the wheel ```

const spin = () => {
// generate different reels , no parameters needed
// keeping all the symbols in an array/list & removing them from the array each time we generate a column (reel)

const symbols = []    ;              // const(NO change allowed) as array is reference data type,so we can manipulate it's content without changing the reference to the array itself
                                    // so no need to assign a new value to symbols(as it's const ) , just add them to the array & it's not gonna violate the rules of constant variable

for (const [symbol, count] of Object.entries(SYMBOLS_COUNT))  { //console.log(symbols, count); displays  A 2 
                                                                                                    // B 4
                                                                                                    // C 6 and D 8
// adding all symbols (as much their count) to the array 
 for ( let i = 0; i < count ; i++){  // count of each symbol ,symbols: [A A B B B B C C C C C C D D D D D D D D ]
    symbols.push(symbol);            // push instead of APPEND in JS
                                     // console.log(symbols) -> shows array after each input
    }
}


const reels = [];        // each inside array reperesents a column of the reel(vertical) in out slot machine : [[A A A] [] []] -> A
                                                                                                                                        //    A
                                                                                                                                        //    A                                                                                                                                    }                                                                                                                                 }                                   
for ( let i = 0; i < COLS ; i++){
    reels.push([]);                  // PUSHING a single col/slot
    const reelSymbols = [...symbols] // copies symbols for each reel (in symbols array ) to that particular(COLS)
    for ( let j = 0; j < ROWS ; j++){ // as COLS is each each reel , and ROWS is 3 values/symbols in THAT particular col/reel(another array)
    // now, randomly select a symbol from reelSymbols ,
    // add it to reels , and 
    // remove it from reelSymbols(not from symbols as it has to be available for next reel/COL)
     
    
    //  reels[i].push(selectedSymbol);
    //            ^

    //  TypeError: Cannot read properties of undefined (reading 'push')
    // ~above error generated if below lines are not INDENTED~ NO, IT IS reelSymbols.splice()and NOT reels.splice()
    const randomIndex = Math.floor(Math.random() * reelSymbols.length); // ex: floor(0.25 * 5)->1
    const selectedSymbol = reelSymbols[randomIndex];
    reels[i].push(selectedSymbol);
    reelSymbols.splice(randomIndex, 1); 


    }
}

    return reels;
};


// transpose above 2D array as it has colunms together [A B C ] [A D C] [B C A] ,but easier to check rows -> [A A B][B D C][C C A]
const transpose =(reels) => {
    //new array 
    const rows = [];
    // ROWS , COLS are just numbers(as predefined same (3)) , main is reels[j][i] where j is changing(first value is COLS IN REELS) for each i(ROWS in reels)
    for (let i = 0; i < ROWS; i++){//opposite of spin function
        rows.push([])
        for (let j = 0; j < COLS ; j++){
            rows[i].push(reels[j][i])// here row is same BUT columns keep changing ex: 00 10 20 in reels is added to single COL NO/ROW HERE in rows 
        }

    }
    return rows;
} 





const getBet = (balance,lines) => {
    while(true) {
        const bet = prompt("Enter the amount you bet per line: ");
        const numberBet = parseFloat(bet);
        if (isNaN(numberBet) || numberBet < 0 || numberBet >  balance / lines )  {
            console.log("Invalid bet amount (per line), enter again.");
        }
        else {
            return numberBet;
        }
    
    }

}

// printing rows or slot machine in a styled way
const printSlotRows = (rows) => {
for ( const row of rows ) // iterating by item of rows array (here each item is an array itself)
{
  let rowString = "";                // to put pipes( | ) between symbols of each row
  for ( const [i , symbol] of row.entries()){ // i is INDEX of each row SYMBOL in row (item of rows) ,i is NOT index of rows but of row 
    rowString +=  symbol; 
    if (i < row.length - 1){
        rowString += " | "
    }
  }
  console.log(rowString)
}

}

const getWinnings = (rows , bet , lines) => { // lines are no. of rows indices that we are gonna be checking
    let winnings = 0;
    for ( let row = 0; row < lines ; row++){
        const symbols = rows[row] //symbols = [A A B] mini array of index row in rows
        let allSame = true;

        for (const symbol in symbols){
            if(symbol != symbols[0]){
                allSame = false
                break;
            }
        }

        if ( allSame ){ // here bet is per line otw winnings +=  (SYMBOL_VALUE[0] ), and finalwinnings += bet * winnings
            winnings += bet * SYMBOL_VALUE[symbols[0]] // object SYMBOL_VALUE used as array to get the valur of 0th symbol(in win all symbols are same anyway)

        }
        return winnings; // return Zero if no win
    }
}


const game = () => {
    let balance = deposit();
    while(true){
    console.log("Your current balance is: $"+balance)
    const lines = getLines()
    const bet = getBet(balance,lines);
    //deduct bet per line from balance
    balance -= bet * lines
    const reels = spin()
    const rows = transpose(reels)                //   console.log(reels) and console.log(rows) show transposition
    printSlotRows(rows)                          // transpose is Good for calculating win , but printSlotRows looks gud(easier for user to pair) without transpose
    const winnings = getWinnings(rows, bet, lines)
    // add winnings to balance
    balance += winnings
    console.log("You won, $"+winnings)          // , : gives space but + doesnot give space between $ and winnings(winnings.toString() not needed)
    if (balance <= 0){
        console.log("Insufficient balance!");
        moreDeposit = prompt("Do you wanna add more money (y/n) ?")
        if ( moreDeposit != 'y') break;
        else {
            
            let newBalance = deposit()
            balance += newBalance
        }
        
    }
    else{
    const playAgain = prompt("Do you wanna gamble again (y/n) ?")
    if (playAgain != 'y') break;
    }
   }
}

game();