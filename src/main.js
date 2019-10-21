//chance
import "../lib/chance.min.js"
//localforage 
import "../lib/localforage.1.7.1.min.js";
//Save db for Indexed DB - localforage
const DB = localforage.createInstance({
  name: "TBHB",
  storeName: "TheBlackHackBestiary"
})
//UI 
import {UI} from "./UI.js"
//monster 
import {monsterManager} from "./monster.js"

//generic application 
const app = {
  DB,
  UI: {},
  save () {
  }
}
UI(app)
monsterManager(app)

setInterval(()=>app.save(), 5000)