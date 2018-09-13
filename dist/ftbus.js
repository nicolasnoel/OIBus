!function(e){var t={};function s(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=t,s.d=function(e,t,o){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},s.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(s.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)s.d(o,n,function(t){return e[t]}.bind(null,n));return o},s.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="",s(s.s=4)}([function(e,t){e.exports=require("sprintf-js")},function(e,t,s){const o=s(5),n=s(6),r=s(7);e.exports={parseArgs:()=>{const e=o(process.argv.slice(2));return(({config:e="./fTbus.config.json"})=>!!e||(console.error("No config file specified, example: --config ./config/config.json"),!1))(e)?e:null},tryReadFile:e=>{if(!e.endsWith(".json"))return console.error("You must provide a json file for the configuration!"),new Error("You must provide a json file for the configuration!");try{return r.parse(n.readFileSync(e,"utf8"))}catch(e){return console.error(e),e}}}},function(e,t){e.exports=class{constructor(e){this.engine=e,this.equipments={}}}},function(e,t,s){const o=s(18);e.exports=class{constructor(e,t){this.queue=new o(e),this.applicationParameters=t}connect(){console.info("connect",this.queue.length)}disconnect(){console.info("disconnect",this.queue.length)}onScan(){console.info("onScan",this.queue.length)}}},function(e,t,s){const{parseArgs:o}=s(1),n=s(8),r=s(21),i=o()||{},{config:c="./fTbus.json"}=i;global.fTbusConfig=n.initConfig(c);const{debug:a=!1,port:u=3333}=global.fTbusConfig,l=s(31).version,p=new n,d=new r(a);a&&console.info("Mode Debug enabled"),console.info(`fTbus version ${l}`),d.listen(u,()=>console.info(`Server started on ${u}`)),p.start(global.fTbusConfig,()=>console.info("Engine started."))},function(e,t){e.exports=require("minimist")},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("json5")},function(e,t,s){const{CronJob:o}=s(9),{tryReadFile:n}=s(1),r={Modbus:s(10),OPCUA:s(14)},i={Console:s(17),InfluxDB:s(19)},c={},a={};e.exports=class{constructor(){this.queues=[]}addValue({pointId:e,timestamp:t,data:s}){this.queues.forEach(o=>{o.enqueue({pointId:e,timestamp:t,data:s})})}registerQueue(e){this.queues.push(e)}start(e,t){Object.values(e.equipments).forEach(t=>{const{protocol:s}=t;c[s]||(c[s]=new r[s](e,this),c[s].connect())}),Object.values(e.applications).forEach(e=>{const{type:t}=e;a[t]||(a[t]=new i[t](this,e),a[t].connect())}),e.scanModes.forEach(({scanMode:e,cronTime:t})=>{new o({cronTime:t,onTick:()=>{Object.keys(c).forEach(t=>c[t].onScan(e)),Object.keys(a).forEach(t=>a[t].onScan(e))},start:!1}).start()}),t&&t()}static initConfig(e){const t=n(e);if(!t.scanModes)throw console.error("You should define scan modes."),new Error("You should define scan modes.");if(!t.equipments)throw console.error("You should define equipments."),new Error("You should define equipments.");return t.equipments.forEach(e=>{e.points.forEach(t=>{"."===t.pointId.charAt(0)&&(t.pointId=e.pointIdRoot+t.pointId.slice(1))})}),t}}},function(e,t){e.exports=require("cron")},function(e,t,s){const o=s(11),n=s(12),r=s(13),i=s(2),c=(e,t)=>{t[e.equipmentId]={socket:new n.Socket,host:e.Modbus.host,port:e.Modbus.port,connected:!1},t[e.equipmentId].client=new o.client.TCP(t[e.equipmentId].socket)};e.exports=class extends i{constructor({equipments:e,modbus:t},s){super(s),this.optimizedConfig=r(e,t.addressGap),e.forEach(e=>{e.Modbus&&c(e,this.equipments)})}onScan(e){const t=this.optimizedConfig[e];Object.keys(t).forEach(e=>{this.equipments[e].connected&&Object.keys(t[e]).forEach(s=>{const o=t[e][s],n=`read${`${s.charAt(0).toUpperCase()}${s.slice(1)}`}s`;Object.entries(o).forEach(([t,s])=>{const o=t.split("-"),r=parseInt(o[0],10),i=parseInt(o[1],10)-r;this.modbusFunction(n,{startAddress:r,rangeSize:i},e,s)})})})}modbusFunction(e,{startAddress:t,rangeSize:s},o,n){this.equipments[o].client[e](t,s).then(({response:e})=>{const s=`${new Date}`;n.forEach(o=>{const n=parseInt(o.Modbus.address,16)-t-1;let r=e.body.valuesAsArray[n];switch(o.type){case"boolean":r=!!r;break;case"number":break;default:console.error("This point type was not recognized : ",o.type)}this.engine.addValue({pointId:o.pointId,timestamp:s,data:r})})}).catch(e=>{console.error(e)})}connect(){Object.values(this.equipments).forEach(e=>{const{host:t,port:s}=e;e.socket.connect({host:t,port:s},()=>{e.connected=!0}),e.socket.on("error",e=>{console.error(e)})})}disconnect(){Object.values(this.equipments).forEach(e=>{e.connected&&(e.socket.end(),e.connected=!1)})}}},function(e,t){e.exports=require("jsmodbus")},function(e,t){e.exports=require("net")},function(e,t){const s=(e,t,o)=>{const n=t.split("."),r=n.splice(0,1)[0];if(0!==n.length)return s(e[r],n.join("."),o);const i=e[r];return o&&delete e[r],i},o=(e,t,o={})=>e.reduce((e,n)=>{const r=s(n,t,!0);return e[r]||(e[r]=[]),e[r].push({...n,...o}),e},{}),n=(e,t,o)=>{return e.sort((e,o)=>{const n=s(e,t,!1),r=s(o,t,!1);return parseInt(n,16)-parseInt(r,16)}).reduce((e,n)=>{const r=s(n,t,!1),i=parseInt(r,16),c=16*Math.round(i/16),a=i<=c?c-16:c,u=16*Math.round((c+o)/16),l=((e,t)=>Object.keys(e).find(e=>{const s=e.split("-"),o=parseInt(s[0],10),n=parseInt(s[1],10);return t>=o&&t<=n}))(e,i)||`${a}-${u}`;return e[l]||(e[l]=[]),e[l].push(n),e},{})};e.exports=((e,t)=>{return e.reduce((e,{equipmentId:s,protocol:r,points:i})=>{if("Modbus"===r){const c=o(i,"scanMode",{equipmentId:s});Object.keys(c).forEach(e=>{c[e]=o(c[e],"equipmentId"),Object.keys(c[e]).forEach(s=>{c[e][s]=o(c[e][s],`${r}.type`),Object.keys(c[e][s]).forEach(o=>{c[e][s][o]=n(c[e][s][o],`${r}.address`,t[o])})})}),Object.keys(c).forEach(t=>{e[t]||(e[t]={}),e[t]={...e[t],...c[t]}})}return e},{})})},function(e,t,s){const o=s(15),{sprintf:n}=s(0),r=s(2),i=s(16),c=(e,t,s)=>{s[t.equipmentId]={client:new o.OPCUAClient({endpoint_must_exist:!1}),url:n(e.connectionAddress.opc,t.OPCUA)}};e.exports=class extends r{constructor({equipments:e,opcua:t},s){super(s),this.optimizedConfig=i(e),e.forEach(e=>{e.OPCUA&&c(t,e,this.equipments)})}async connect(){await Object.values(this.equipments).forEach(async e=>{await e.client.connect(e.url),await e.client.createSession((t,s)=>{t||(e.session=s,e.connected=!0)})})}async onScan(e){const t=this.optimizedConfig[e];Object.keys(t).forEach(e=>{if(this.equipments[e].connected){const s={};t[e].forEach(e=>{s[e.pointId]={nodeId:n("ns=%(ns)s;s=%(s)s",e.OPCUAnodeId)}}),this.equipments[e].session.read(Object.values(s),10,(e,t)=>{e||Object.keys(s).length!==t.length||Object.keys(s).forEach(e=>{const s=t.shift();this.engine.addValue({pointId:e,timestamp:s.sourceTimestamp.toString(),data:s.value.value})})})}})}}},function(e,t){e.exports=require("node-opcua")},function(e,t){const s=(e,t,o)=>{const n=t.split("."),r=n.splice(0,1)[0];if(0!==n.length)return s(e[r],n.join("."),o);const i=e[r];return o&&delete e[r],i},o=(e,t,o={})=>e.reduce((e,n)=>{const r=s(n,t,!0);return e[r]||(e[r]=[]),e[r].push({...n,...o}),e},{});e.exports=(e=>{return e.reduce((e,{equipmentId:t,protocol:s,points:n})=>{if("OPCUA"===s){const s=o(n,"scanMode",{equipmentId:t});Object.keys(s).forEach(e=>{s[e]=o(s[e],"equipmentId"),Object.values(s[e]).forEach(e=>{e.forEach(e=>{delete e.type})})}),Object.keys(s).forEach(t=>{e[t]||(e[t]={}),e[t]={...e[t],...s[t]}})}return e},{})})},function(e,t,s){const{sprintf:o}=s(0),n=s(3);e.exports=class extends n{onScan(){console.log(this.queue.flush())}showAndDelete(){this.queue.length>0&&console.log(o(global.fTbusConfig.applications[0].Console.content,this.queue.dequeue())),console.log(this.queue.buffer)}}},function(e,t){e.exports=class{constructor(e){this.buffer=[],e.registerQueue(this)}enqueue(e){this.buffer.push(e)}dequeue(){return this.buffer.shift()}flush(e=(()=>{})){const t=[];for(;this.length;)t.push(this.dequeue()),e(t.slice(-1)[0]);return t}get length(){return this.buffer.length}}},function(e,t,s){const o=s(20),{sprintf:n}=s(0),r=s(3),i=e=>{const t={};return e.slice(1).split("#")[0].split("/").forEach(e=>{const s=e.replace(/[\w ]+\.([\w]+)/g,"$1"),o=e.replace(/([\w ]+)\.[\w]+/g,"$1");t[s]=o}),t.dataId=e.split("#").slice(-1).pop(),t};e.exports=class extends r{constructor(e,t){super(e,t),this.host=t.InfluxDB.host,this.currentObject={}}onScan(){this.queue.flush(e=>this.makeRequest(e))}makeRequest(e){const{data:t,pointId:s,timestamp:r}=e,c={data:t,host:this.host,timestamp:r};Object.entries(i(s)).forEach(([e,t])=>{c[e]=t}),Object.entries(c).forEach(([e,t])=>{"data"!==e&&(c[e]=t.replace(/ /g,"\\ "),Number.isNaN(parseInt(t,10))||(c.measurement=e))});const a=global.fTbusConfig.applications[1].InfluxDB.insert.replace(/'/g,"");let u=`${a.split(" ")[2]} ${a.split(" ")[3]}`.replace(/zzz/g,"%(measurement)s").replace(/ \w+=.*/g," %(dataId)s=%(data)s");Object.keys(c).forEach(e=>{["data","host","measurement",c.measurement,"base"].includes(e)||(u=u.replace(/([a-z])\1\1(tag)?=%\(\1\1\1\)/,`${e}=%(${e})`))}),u=u.replace(/,([a-z])\1\1(tag)?=%\(\1\1\1\)/g,""),u=n(u,c),o(n(`http://${a.split(" ")[0]}`,c),{body:u,headers:{"Content-Type":"application/x-www-form-urlencoded"},method:"POST"})}}},function(e,t){e.exports=require("node-fetch")},function(e,t,s){const o=s(22),n=s(23),r=s(24),i=s(25),c=s(26),a=s(27),u=s(28),l=s(29),p=s(30);e.exports=class{constructor(e){this.app=new o;const t=new n;this.debug=e,"debug"===this.debug&&this.app.use(i()),this.app.use(u()),this.app.use(async(e,t)=>{try{await t()}catch(t){if(401!==t.status)throw t;e.status=401,e.set("WWW-Authenticate","Basic"),e.body="access was not authorized"}}),this.app.use(r({name:"admin",pass:"admin"})),this.app.use(c()),this.app.use(a({enableTypes:["json"],jsonLimit:"5mb",strict:!0,onerror(e,t){t.throw("body parse error",422)}})),this.app.use(l()),t.prefix("/v0"),t.get("/",(e,t)=>{e.ok({comment:" fTbus"})}).get("/infos",p.getInfo),this.app.use(t.routes()),this.app.use(t.allowedMethods())}listen(e,t){this.app.listen(e,t)}}},function(e,t){e.exports=require("koa")},function(e,t){e.exports=require("koa-router")},function(e,t){e.exports=require("koa-basic-auth")},function(e,t){e.exports=require("koa-logger")},function(e,t,s){"use strict";e.exports=function(e){return e=Object.assign({},{allowMethods:"GET,HEAD,PUT,POST,DELETE,PATCH"},e),Array.isArray(e.exposeHeaders)&&(e.exposeHeaders=e.exposeHeaders.join(",")),Array.isArray(e.allowMethods)&&(e.allowMethods=e.allowMethods.join(",")),Array.isArray(e.allowHeaders)&&(e.allowHeaders=e.allowHeaders.join(",")),e.maxAge&&(e.maxAge=String(e.maxAge)),e.credentials=!!e.credentials,e.keepHeadersOnError=void 0===e.keepHeadersOnError||!!e.keepHeadersOnError,function(t,s){const o=t.get("Origin");if(t.vary("Origin"),!o)return s();let n;if("function"==typeof e.origin){if(!(n=e.origin(t)))return s()}else n=e.origin||o;const r={};function i(e,s){t.set(e,s),r[e]=s}if("OPTIONS"!==t.method)return i("Access-Control-Allow-Origin",n),!0===e.credentials&&i("Access-Control-Allow-Credentials","true"),e.exposeHeaders&&i("Access-Control-Expose-Headers",e.exposeHeaders),e.keepHeadersOnError?s().catch(e=>{throw e.headers=Object.assign({},e.headers,r),e}):s();{if(!t.get("Access-Control-Request-Method"))return s();t.set("Access-Control-Allow-Origin",n),!0===e.credentials&&t.set("Access-Control-Allow-Credentials","true"),e.maxAge&&t.set("Access-Control-Max-Age",e.maxAge),e.allowMethods&&t.set("Access-Control-Allow-Methods",e.allowMethods);let o=e.allowHeaders;o||(o=t.get("Access-Control-Request-Headers")),o&&t.set("Access-Control-Allow-Headers",o),t.status=204}}}},function(e,t){e.exports=require("koa-bodyparser")},function(e,t){e.exports=require("koa-helmet")},function(e,t){e.exports=require("koa-respond")},function(e,t){e.exports={getInfo:e=>{const{query:t}=e.request,s=e.request.header.authorization||"";if(s.startsWith("Basic ")){{const e=s.split(" ")[1],t=Buffer.from(e,"base64").toString().split(":"),o=t[0],n=t[1];console.log(`request from ${o} with password:${n}`)}e.ok({query:t,config:global.fTbusConfig})}else e.throw(400,"The authorization header is either empty or is not Basic.")}}},function(e){e.exports={name:"ftbus",private:!0,version:"0.0.1",main:"index.js",author:"factoryThings",license:"SEE LICENSE in LICENSE",scripts:{start:"node src/index.js",build:"npx webpack --mode production","build-dev":"npx webpack --mode development","build-doc":"esdoc",test:"jest",lint:"eslint ."},keywords:["factoryThings"],dependencies:{"@babel/runtime":"^7.0.0","@koa/cors":"^2.2.2",async:"^2.6.1",cron:"^1.4.1",dotenv:"^6.0.0",express:"^4.16.3",jsmodbus:"^3.1.0",json5:"^2.0.1",koa:"^2.5.3","koa-basic-auth":"^3.0.0","koa-bodyparser":"^4.2.1","koa-helmet":"^4.0.0","koa-logger":"^3.2.0","koa-respond":"^1.0.1","koa-router":"^7.4.0",minimist:"^1.2.0","node-fetch":"^2.2.0","node-opcua":"^0.4.5","sprintf-js":"^1.1.1"},devDependencies:{"@babel/core":"^7.0.1","@babel/preset-env":"^7.0.0","babel-eslint":"^9.0.0","babel-loader":"^8.0.2",eslint:"^5.5.0","eslint-config-airbnb":"^17.1.0","eslint-plugin-import":"^2.14.0","eslint-plugin-jsx-a11y":"^6.1.1","eslint-plugin-react":"^7.11.1","ignore-loader":"^0.1.2",webpack:"^4.18.1","webpack-cli":"^3.1.0"}}}]);