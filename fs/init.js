load('api_sys.js');
load('api_gpio.js');
load('api_timer.js');
load('api_ati_uns4i.js')

let pin = 2; // вывод, к которому подключен светодиод

GPIO.set_mode(pin, GPIO.MODE_OUTPUT);

let uartno = 1;
let uns_addr = 32;
UNS4i.init(uartno, uns_addr);

Timer.set( 2000, Timer.REPEAT, function() {
  let value = GPIO.toggle(pin);
  print (value ? 'Tick' : 'Tack');

  print ( JSON.stringify( UNS4i.get() ) )
    

}, null );
