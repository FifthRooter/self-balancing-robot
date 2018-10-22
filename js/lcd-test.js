const Lcd = require('lcd')

const lcd = new Lcd({rs: 18, e: 23, data: [24, 25, 8, 7], cols: 16, rows: 2})

lcd.on('ready', () => {
 setInterval(() => {
    lcd.setCursor(3, 0);
    lcd.print(new Date().toISOString().substring(0, 10), (err) => {
      if (err) {
        throw err;
      }
   
    lcd.setCursor(4,1)
    lcd.print(new Date().toISOString().substring(12, 19), (err) => {
      if (err) {
       throw err
      }
  } )
  })
  }, 1000);
})

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', () => {
  lcd.clear()
  lcd.close();
  process.exit();
});
