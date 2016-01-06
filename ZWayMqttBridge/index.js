/*** MQTT Z-Way odule *******************************************
 Version: 1.0.0
 -----------------------------------------------------------------------------
 Author: David Uebelacker <david@uebelacker.ch>
 ******************************************************************************/

function ZWayMqttBridge (id, controller) {
    ZWayMqttBridge.super_.call(this, id, controller);
}

inherits(ZWayMqttBridge, AutomationModule);

_module = ZWayMqttBridge;

ZWayMqttBridge.prototype.init = function (config) {
    ZWayMqttBridge.super_.prototype.init.call(this, config);

    var self = this;


    this.deviceUpdate = function (device) {
        if (!self.mqttBridge) {
            self.connect();
        }
        if (self.mqttBridge) {
            self.mqttBridge.send(JSON.stringify(device, null, 4));
        }
    };

    this.controller.devices.on('change:metrics:level', self.deviceUpdate);
};

ZWayMqttBridge.prototype.connect = function () {

    this.mqttBridge = new sockets.websocket('ws://192.168.0.62:8080');

    this.mqttBridge.onopen = function() {
        console.log('Mqtt Bridge websocket connected!');
    };

    this.mqttBridge.onmessage = function(ev) {
        console.log('got data:' + ev.data);
    };

    this.mqttBridge.onclose = function() {
        console.log('Mqtt Bridge websocket was closed!');
    };

    this.onerror = function (ev) {
        console.log('Mqtt Bridge websocket error: ' + ev.data);
    };

};

ZWayMqttBridge.prototype.stop = function () {

};