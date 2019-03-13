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


    phyManager:cc.PhysicsManager
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.phyManager = cc.director.getPhysicsManager()
        this.phyManager.enabled = true
    }

    start () {
        cc.log(this.phyManager.rayCast(cc.v2(0, 10000), cc.v2(0, -10000), cc.RayCastType.Closest))
        // cc.
        this.btn.node.on("click", function() {
            for (let index = 0; index < 100; index++) {
                var x = 640 / 100 * index
                let result = this.phyManager.rayCast(cc.v2(x, 10000), cc.v2(x, -10000), cc.RayCastType.Any)
                cc.log(index, result.length)
            }
            this.btn.node.y -= 10
            // let result = this.phyManager.rayCast(cc.v2(0, 10000), cc.v2(0, -10000), cc.RayCastType.Any)
            // cc.log(result.length)
            // var range = 30000; 
            // var position = cc.v2(0,0)
            // for (var i = 0; i <= 50; i++) {
            //     var angle = 360 / 50 * i
            //     var p1 = position;
            //     var p2 = cc.v2(position.x + range * Math.cos(angle * 0.01745), position.y + range * Math.sin(angle * 0.01745));
            //     var output = this.physicsManager.rayCast(p1, p2, cc.RayCastType.All) 
            //     cc.log("i=",i, output.length)
            // }
        }, this)
        // this.world.
        // this.btn.node.on("click", function() {
        //     // Game.instance.velocityXIncrement = parseInt(this.ex.string)
        //     // Game.instance.velocityYIncrement = parseInt(this.ey.string)
        //     // Game.instance.velocityY = parseInt(this.ez.string)
        //     this.world.y = this.world.y - 10
        // }, this)

        // this.resetBtn.node.on("click", function() {
        //     // Game.instance.startGame()
        // })
    }

    // update (dt) {}
}
