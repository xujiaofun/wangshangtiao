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
export default class PhysicObject extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    gravity = 0
    velocity:cc.Vec2 = new cc.Vec2(0,0)
    collisionX:number = 0
    collisionY:number = 0
    isMoving = false
    fallDown = false
    touchingNumber:number = 0

    start () {
        
    }

    // update (dt) {
    //     this.vy = this.vy - 2240 * dt
    //     this.node.x = this.node.x + 200 * dt
    //     this.node.y = this.node.y + this.vy * dt
    // }

    runPhysicalEngine(dt) {
        // if (!this.isMoving) return

        // if (this.collisionY != 0 || this.collisionX != 0) return

        if (this.collisionY != -1) {
            this.velocity.y = this.velocity.y - this.gravity * dt
        }

        if (this.velocity.x * this.collisionX > 0) {
            this.velocity.x = 0
        }
        
        this.node.x = this.node.x + this.velocity.x * dt
        this.node.y = this.node.y + this.velocity.y * dt
    }
}
