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

    // LIFE-CYCLE CALLBACKS:
    static instance:App
    onLoad () {
        App.instance = this
        cc.director.getCollisionManager().enabled = true
    }

    start () {
        let go = new cc.Node()
        go.setAnchorPoint(0.5, 0)
        go.setPosition(0, -250)
        go.addComponent(Map)
        this.node.addChild(go)
    }

    // update (dt) {}
}
