const Lcd = require('lcd')

const lcd = new Lcd({rs: 18, e: 23, data: [24, 25, 8, 7], cols: 8, rows: 1})

lcd.on('ready', () => {
  setInterval(() => {
    lcd.setCursor(0, 0);
    lcd.print(new Date().toISOString().substring(11, 19), (err) => {
      if (err) {
        throw err;
      }
    });
  }, 1000);
});

// If ctrl+c is hit, free resources and exit.
process.on('SIGINT', () => {
  lcd.close();
  process.exit();
});
