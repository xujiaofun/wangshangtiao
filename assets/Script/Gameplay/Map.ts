import Role from "../Role";
import Block from "./Block";
import ResManager from "../ResManager";
import CharacterController from "./CharacterController";
import PhysicObject from "./PhysicObject";
import GameConfig from "../GameConfig";
import App from "../App";
import CharacterController2D from "./CharacterController2D";

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
export default class Map extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    bgImg:cc.Node = null

    // onLoad () {}
    mainRole:CharacterController = null
    blockArr:Block[] = []
    physicalGroup:PhysicObject[] = []
    blockIndex:number = 0
    onTouchStart:Function = null
    onTouchEnd:Function = null

    start () {
        let go = cc.instantiate(ResManager.instance.rolePrefab)
        let phy = go.addComponent(PhysicObject)
        this.mainRole = go.addComponent(CharacterController)
        let self = this
        this.mainRole.jumpSuccess = function() {
            self.onJumpSuccess()
        }

        this.node.addChild(go, 99)
        go.setPosition(160, 80)
        
        phy.gravity = GameConfig.instance.gravity
        cc.log('phy.gravity', phy.gravity)
        phy.isMoving = true
        this.physicalGroup.push(phy)
        this.createBlocks()

        let touchStartTime = 0
        let onTouchStart = function(e:cc.Event.EventTouch) {
            touchStartTime = Date.now();
        }

        let onTouchEnd = function(e:cc.Event.EventTouch) {
            let touchEndTime = Date.now();
            let duration = (touchEndTime - touchStartTime) / 1000;
            if (duration < 0.01) return
            let x = Math.min(3000, duration * this.velocityXIncrement);
            let y = Math.min(3000, duration * this.velocityYIncrement + this.velocityY);
            let sign = this.blockIndex % 2 == 1 ? 1 : -1
            phy.velocity = cc.v2(sign * 350, 1000);
            phy.isMoving = true
            // cc.log("onTouchEnd")
        }

        this.onTouchStart = onTouchStart
        this.onTouchEnd = onTouchEnd
        App.instance.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        App.instance.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        App.instance.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        App.instance.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    onJumpSuccess() {
        if (this.blockIndex != 0) {
            let actionTo = cc.moveBy(0.3, cc.v2(0, -200))
            this.node.runAction(actionTo)
        }
        
        this.blockIndex = this.blockIndex + 1

        if (this.blockIndex % 8 == 0) {
            this.createBlocks()
        }
    }

    createBlocks() {
        for (let index = 0; index < 10; index++) {
            let go = cc.instantiate(ResManager.instance.blockPrefab)
            let block = go.addComponent(Block)

            let posX = 0
            let posY = (this.blockArr.length) * 200
            if (this.blockArr.length % 2 == 0) {
                posX = 160
            } else {
                posX = -160
            }
            go.setPosition(posX, posY)

            this.blockArr.push(block)
            this.node.addChild(go, 0)
        }
    }

    _velocity:cc.Vec2 = cc.Vec2.ZERO
    update (dt) {
        for (let index = 0; index < this.physicalGroup.length; index++) {
            const element = this.physicalGroup[index];
            element.runPhysicalEngine(dt)
        }
        // this.checkCollision()
    }

    checkCollision() {

    }
}
