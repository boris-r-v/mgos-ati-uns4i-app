load('api_sys.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_timer.js');
load('api_esp32.js');
load('api_config.js');
load('api_ati_uns4i.js')

/*Конфигурация минающего светодиода*/
let pin = 2; 
GPIO.set_mode(pin, GPIO.MODE_OUTPUT);

/*Конфигурация модуля УАРТа для опроса ЦНС4ш*/
let uartno = 1;
let uns_addr = 32;
let uns_speed = 19200;
UNS4i.init(uartno, uns_addr, uns_speed);

/*Собирем данные мониторинга контроллера ESP32 в одном объекте*/
let esp32_diag = {
    report: function () {
        return {
                deviceId: Cfg.get('device.id'),
                total_ram: Sys.total_ram(),
                free_ram: Sys.free_ram(),
                uptime: Sys.uptime(),
                temp: (ESP32.temp()-32)*5/9,
                hall: ESP32.hall()
        };
    }
};

/*Метод отправки данных в очереди MQTT */
let mqtt_send = function ( topic, obj ) {

    let queue = 'devices/' + Cfg.get('device.id') + '/' + topic;
    if ( MQTT.isConnected() ) 
    {
        //Magic MQTT.pub parametsr
        //1 - QoS: At least once(1), 
        //true - retain last message in topic
        MQTT.pub( queue, JSON.stringify(obj), 1, true );
    } 
    else 
    {
        print("Device is not connected to mqtt brocker: \"", Cfg.get('mqtt.server'), "\", data was not sent to: ", queue );
    }
};

Timer.set( 1000, Timer.REPEAT, function() {
  let value = GPIO.toggle(pin);
//  print (value ? 'Tick' : 'Tack');
//  print ( JSON.stringify( UNS4i.get() ) )

    mqtt_send( "diag", esp32_diag.report() )
    mqtt_send( "data", UNS4i.get() )
    

}, null );
