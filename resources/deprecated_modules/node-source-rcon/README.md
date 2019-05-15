# node-source-rcon
🖥️ Control [Source RCON Protocol](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol) with NodeJS

[English](README.md) / [한국어](README_ko_KR.md)

## Install
```console
$ npm install node-source-rcon --save
```

## Examples
[See more...](examples/)
```javascript
const Rcon = require('node-source-rcon');
const server = new Rcon({ port: 1337 });

server.authenticate('1337coolpassword')
    .then(() => {
        console.log('Authenticated!');
        return server.execute('version');
    })
    .then(console.log)
    .catch(console.error);
```

## Options
```javascript
{
    host: '127.0.0.1',          // Host
    port: 27015,                // Port

    maximumPacketSize: 0,       // Maximum packet bytes (0 = no limit)
    encoding: 'ascii',          // Packet encoding (ascii, utf8)
    timeout: 1000               // ms
}
```

### Errors
#### Already authenticated
`¯\_(ツ)_/¯`

#### Unable to authenticate
Wrong password.

#### Unable to write to socket
Socket connection disconnected.

#### Packet too long
You can solve this error with change `maximumPacketSize` option.

[Remember! you can't send a packet larger then 4096 bytes](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol#Packet_Size)

## TODO
- [ ]  Easy Multiple-packet Responses support