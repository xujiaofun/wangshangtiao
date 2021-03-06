// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import GameConfig from "./GameConfig";
import Map from "./Gameplay/Map";

@ccclass
export default class App extends cc.Component {

    static config:GameConfig

    static map:Map

    // LIFE-CYCLE CALLBACKS:
    static instance:App
    onLoad () {
        App.instance = this
        cc.director.getCollisionManager().enabled = true
    }

    start () {
        App.map = Map.Create(this.node.parent)
    }

    restart() {
        if (App.map) {
            App.map.node.destroy()
        }
        App.map = Map.Create(this.node.parent)
    }

    // update (dt) {}
}
