import {TAGTYPES,TAGS} from "./tags.js"

//Monster data
const MONSTER = {
  name: "",
  tags: [],
  text: "",
  HD: 1,
  atks: [],
  ab: []
}
const RANGES = ["Close", "Nearby", "Faraway", "Distant"]
const ATTRIBUTES = ["Strength", "Dexterity", "Constitution", "Wisdom", "Intelligence", "Charisma"]
const STATS = ["STR", "DEX", "CON", "WIS", "INT", "CHA"]
//Attack: Name, STAT,#,range,Y dmg, 
const ATTACK = ["", 0, "", 0, 2]
//Ability: Name, about
const ABILITY = ["",""]

const monsterManager = (app)=>{

  Vue.component("attack", {
    props: ["all", "i"],
    data: function() {
      return {
        stats : STATS,
        ranges : RANGES
      }
    },
    template: `
    <div>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text">Attack</span>
        </div>
        <input class="form-control" type="text" placeholder="Attack Name" v-model="atk[0]">
        <select class="custom-select" v-model="atk[1]">
          <option v-for="(s,j) in stats" :value="j">{{s}}</option>
        </select>
        <div class="input-group-append">
          <button class="btn btn-warning" type="button" @click="all.splice(i,1)">&#10008;</button>
        </div>
      </div>
      <div class="input-group">
        <input class="form-control" type="text" placeholder="Number" v-model="atk[2]">
        <select class="custom-select" v-model="atk[3]">
          <option v-for="(r,j) in ranges" :value="j">{{r}}</option>
        </select>
        <div class="input-group-prepend">
          <span class="input-group-text">DMG</span>
        </div>
        <input class="form-control" type="number" v-model="atk[4]">
      </div>
    </div>
    `,
    computed: {
      atk() {
        return this.all[this.i]
      }
    }
  })

  Vue.component("ability", {
    props: ["all", "i"],
    template: `
    <div>
      <div v-if="load" v-cloak>
        <div v-for="atoc in abilities" class="border p-1 d-flex justify-content-between">
          <em>{{atoc[0]}}! {{atoc[1]}}</em>
          <button class="btn btn-success btn-sm" type="button" @click="copy(atoc)">&#10004;</button>
        </div>
      </div>
      <div v-if="!load" v-cloak>
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text">Ability</span>
          </div>
          <input class="form-control" type="text" placeholder="Ability Name" v-model="all[i][0]">
          <div class="input-group-append">
            <button class="btn btn-info" type="button" @click="load=true">Load</button>
            <button class="btn btn-warning" type="button" @click="all.splice(i,1)">&#10008;</button>
          </div>
        </div>
        <textarea class="form-control" placeholder="About the ability" v-model="all[i][1]"></textarea>
      </div>
    </div>
    `,
    data: function() {
      return {
        load : false,
      }
    },
    computed: {
      abilities () { return app.monster.abilities },
    },
    methods : {
      copy (atoc) {
        Vue.set(this.all,this.i,atoc.slice())
        this.load = false
      }
    }
  })

  Vue.component("stat-block", {
    props: ["M"],
    template: `
    <div align="left">
      <strong>{{M.name}} - HD {{M.HD}}</strong>
      <div v-for="a in M.atks">
        <strong>{{a[0]}}-{{stats[a[1]]}}({{a[2]}} <em>{{ranges[a[3]]}})</em> {{a[4]}} dmg</strong>
      </div>
      <div v-for="a in M.ab">
        <em>{{a[0]}}! {{a[1]}}</em>
      </div>
    </div>
    `,
    data: function() {
      return {
        stats : STATS,
        ranges : RANGES
      }
    },
    computed: {
    }
  })

  class Manager {
    constructor() {
      //setup storage
      this._data = {}
      //load 
      app.DB.getItem("monsters").then(d => {
        this._data = d || {}
        //update ui
        app.UI.main.monsters = this.all
      })
    }
    get count() {
      return this.ids.length
    }
    get ids() {
      return Object.keys(this._data)
    }
    get all() {
      return Object.entries(this._data)
    }
    get raw () { return this._data }
    get abilities () {
      return this.all.map(m => m[1].ab).flat()
    }
    get defs() {
      return {
        monster: JSON.parse(JSON.stringify(MONSTER)),
        attack : ATTACK.slice(),
        ability : ABILITY.slice(),
        ranges: RANGES,
        attributes: ATTRIBUTES,
        stats: STATS,
        tags : TAGS,
        tagTypes : TAGTYPES
      }
    }
    add (M) {
      let id = chance.hash()
      this._data[id] = JSON.parse(JSON.stringify(M))
      this.save()
    }
    save() {
      app.DB.setItem("monsters", this._data)
    }
  }

  app.monster = new Manager()
}

export {monsterManager}
