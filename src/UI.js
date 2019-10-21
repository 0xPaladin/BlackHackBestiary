/* 
UI 
*/
const UI = (app)=> {
  //creates the VUE js instance
  app.UI.main = new Vue({
    el: '#ui-main',
    data: {
      now : 0,
      newMonster : null,
      id : null,
      monsters : [],
      loadId : null,
      exIds : []
    },
    mounted() {
      this.now = Date.now() / 1000
      setInterval(()=>this.now = Date.now() / 1000, 500)
    },
    computed: {
      selected () {
        return this.loadId ? app.monster.raw[this.loadId] : null
      },
      exports () {
        let names = [], data = [];  
        this.exIds.forEach(id => {
          let M = app.monster.raw[id]
          names.push(M.name)
          data.push(M)
        })
        return {names,data:JSON.stringify(data)}
      }
    },
    methods: {
      create () {
        this.newMonster = app.monster.defs.monster
        this.newMonster.atks.push(app.monster.defs.attack)
      },
      addPart (what) {
        if(what=="atk") this.newMonster.atks.push(app.monster.defs.attack)
        else if(what=="ab") this.newMonster.ab.push(app.monster.defs.ability)
      },
      edit () {
        this.newMonster = JSON.parse(JSON.stringify(this.selected))
      },
      copy () {
        this.newMonster = JSON.parse(JSON.stringify(this.selected))
        this.loadId = null
      },
      save () {
        if(this.loadId) {
          app.monster._data[this.loadId] = JSON.parse(JSON.stringify(this.newMonster))
        }
        else {
          app.monster.add(this.newMonster) 
        }
        this.newMonster = null
      },
      reset () {}
    }
  })

}

export {UI}
