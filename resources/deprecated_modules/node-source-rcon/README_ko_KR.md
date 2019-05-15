# node-source-rcon
🖥️ 노드로 물고 뜯고 맛보고 즐기는 [Source RCON 프로토콜](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol)

[English](README.md) / [한국어](README_ko_KR.md)

## 설치
```console
$ npm install node-source-rcon --save
```

## 예시
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

## 옵션
```javascript
{
    host: '127.0.0.1',          // 호스트
    port: 27015,                // 포트

    maximumPacketSize: 0,       // 최대 패킷 바이트 크기 (0 = 제한 없음)
    encoding: 'ascii',          // 패킷 인코딩 (ascii, utf8)
    timeout: 1000               // ms
}
```

### 오류
#### Already authenticated
`¯\_(ツ)_/¯`

#### Unable to authenticate
잘못된 비밀번호를 입력했습니다.

#### Unable to write to socket
서버와의 소켓 연결이 끊켰습니다.

#### Packet too long
`maximumPacketSize` 값을 변경해 해결할 수 있습니다.

[단 4096바이트 보다 커선 안됩니다!](https://developer.valvesoftware.com/wiki/Source_RCON_Protocol#Packet_Size)

## TODO
- [ ]  다중 패킷 응답 지원하기