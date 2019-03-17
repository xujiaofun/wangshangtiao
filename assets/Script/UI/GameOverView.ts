import ResManager from "../ResManager";
import App from "../App";

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

@ccclass
export default class GameOverView extends cc.Component {

    @property(cc.Node)
    restartBtn: cc.Node = null;

    @property(cc.Label)
    scoreTxt: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    static Create(parent:cc.Node) {
        let go = cc.instantiate(ResManager.instance.gameOverPrefab)
        let cmp = go.getComponent(GameOverView)
        parent.addChild(go)
        go.active = false
        return cmp
    }

    start () {
        this.restartBtn = this.node.getChildByName("btn")
        this.restartBtn.on("click", function(){
            App.instance.restart()
        }, this)
    }

    setScore(value) {
        this.scoreTxt.string = "本次得分：" + value
    }

    // update (dt) {}
}
