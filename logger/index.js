const event = require('events');

class Logger extends event{
        record(){
        this.emit("LogMsg","App Initiated");
    }
}


module.exports=new Logger();