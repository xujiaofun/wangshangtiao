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
export default class NewClass extends cc.Component {

    UNIT = 40

    gravity = 60
    moveSpeed = 0
    maxJumpSpeed = 0
    minJumpSpeed = 0
    maxJumpHeight = 8 * this.UNIT
    maxJumpWidth = 14 * this.UNIT
    minJumpHeight = 4 * this.UNIT
    jumpDuration = 1
    velocity:cc.Vec2 = new cc.Vec2(0,0)

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.gravity = 2 * this.maxJumpHeight / (this.jumpDuration / 2) / (this.jumpDuration / 2)
        this.moveSpeed = this.maxJumpWidth / this.jumpDuration
        this.maxJumpSpeed = this.gravity * (this.jumpDuration / 2)
        this.minJumpSpeed = Math.sqrt(2 * this.gravity * this.minJumpHeight)

        cc.log("gravity = ", this.gravity)
        cc.log("moveSpeed = ", this.moveSpeed)
        cc.log("maxJumpSpeed = ", this.maxJumpSpeed)
        cc.log("minJumpSpeed = ", this.minJumpSpeed)
    }

    // update (dt) {}
}
