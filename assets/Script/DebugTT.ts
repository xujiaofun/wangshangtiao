import Game from "./Game";

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
export default class DebugTT extends cc.Component {

    @property(cc.EditBox)
    ex: cc.EditBox = null;

    @property(cc.EditBox)
    ey: cc.EditBox = null;

    @property(cc.EditBox)
    ez: cc.EditBox = null;

    @property(cc.Button)
    btn:cc.Button = null;

    @property(cc.Button)
    resetBtn:cc.Button = null;

    @property(cc.Node)
    world: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // this.world.
        this.btn.node.on("click", function() {
            // Game.instance.velocityXIncrement = parseInt(this.ex.string)
            // Game.instance.velocityYIncrement = parseInt(this.ey.string)
            // Game.instance.velocityY = parseInt(this.ez.string)
            this.world.y = this.world.y - 10
        }, this)

        // this.resetBtn.node.on("click", function() {
        //     // Game.instance.startGame()
        // })
    }

    // update (dt) {}
}
