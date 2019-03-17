import ResManager from "../ResManager";

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
export default class GameScoreView extends cc.Component {

    @property(cc.Label)
    scoreTxt: cc.Label = null;


    // LIFE-CYCLE CALLBACKS:

    // 

    static Create(parent:cc.Node) {
        let go = cc.instantiate(ResManager.instance.gameScorePrefab)
        parent.addChild(go)
        let cmp = go.getComponent(GameScoreView)
        
        return cmp
    }

    onLoad () {
        this.node.y = cc.director.getWinSize().height
    }

    start () {
        this.scoreTxt.string = "0"
    }

    setScore(value:number) {
        if (this.scoreTxt) {
            this.scoreTxt.string = value + ""
        }
    }
}
