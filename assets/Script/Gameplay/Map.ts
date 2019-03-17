import Block from "./Block";
import ResManager from "../ResManager";
import CharacterController from "./CharacterController";
import PhysicObject from "./PhysicObject";
import GameConfig from "../GameConfig";
import App from "../App";
import Mathf from "../Mathf";
import GameScoreView from "../UI/GameScoreView";
import GameOverView from "../UI/GameOverView";

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

    waterNode:cc.Node = null

    // onLoad () {}
    mainRole:CharacterController = null
    blockArr:Block[] = []
    physicalGroup:PhysicObject[] = []
    blockIndex:number = 0
    onTouchStart:Function = null
    onTouchEnd:Function = null

    startCountDown = 3
    bornPos:cc.Vec2 = cc.v2(160, 200)
    UNIT = 40
    scoreView:GameScoreView
    gameOverView:GameOverView
    paused:boolean = false
    score:number = 0

    static Create(parent) {
        let go = cc.instantiate(ResManager.instance.mapPrefab)
        go.setPosition(0, 0)
        parent.addChild(go)
        let map = go.addComponent(Map)
        return map
    }

    onLoad() {
        this.scoreView = GameScoreView.Create(this.node.parent)
        this.gameOverView = GameOverView.Create(this.node.parent)

        this.waterNode = cc.instantiate(ResManager.instance.waterPrefab)
        this.node.parent.addChild(this.waterNode)
    }

    start () {
        this.bgImg = this.node.getChildByName("BgLayer").getChildByName("bgImg")

        let go = cc.instantiate(ResManager.instance.rolePrefab)
        let phy = go.addComponent(PhysicObject)
        this.mainRole = go.addComponent(CharacterController)
        let self = this
        this.mainRole.jumpSuccess = function() {
            self.onJumpSuccess()
        }
        this.mainRole.jumpFail = function() {
            self.onJumpFail()
        }

        this.node.addChild(go, 99)
        go.setPosition(this.bornPos.x, this.bornPos.y + 80)
        
        phy.gravity = GameConfig.instance.gravity
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
            let vx = Math.min(560, duration * 40 + 300);
            let vy = Math.min(1280, duration * 300 + 900); 
            let sign = this.blockIndex % 2 == 1 ? 1 : -1
            phy.velocity = cc.v2(sign * vx, vy);
            cc.log("onTouchEnd")
        }

        this.onTouchStart = onTouchStart
        this.onTouchEnd = onTouchEnd
        App.instance.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        App.instance.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        // App.instance.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        // App.instance.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)

        this.scoreView.node.removeFromParent()
        this.gameOverView.node.removeFromParent()

        // cc.log("onDestroy")
    }

    onJumpSuccess() {
        this.blockIndex = this.blockIndex + 1

        if (this.blockIndex % 8 == 0) {
            this.createBlocks()
        }

        for (let index = 0; index < this.blockIndex - 10; index++) {
            const element = this.blockArr[index];
            if (element) {
                element.node.removeFromParent(true)
            }
            this.blockArr[index] = null
        }

        this.score ++
        this.scoreView.setScore(this.score)
    }

    onJumpFail() {
        this.paused = true
        this.gameOverView.node.active = true
        this.mainRole.node.active = false

        this.gameOverView.setScore(this.score)
    }

    createBlocks() {
        for (let index = 0; index < 10; index++) {
            let go = cc.instantiate(ResManager.instance.blockPrefab)
            let block = go.addComponent(Block)
            let width = Math.floor(Math.random() * 2 * this.UNIT) + 3 * this.UNIT
            block.setup(this.blockArr.length, width)

            let posX = 0
            let posY = 0
            if (this.blockArr.length == 0) {
                posX = this.bornPos.x
                posY = this.bornPos.y
            } else {
                if (this.blockArr.length % 2 == 0) {
                    posX = Mathf.random(2 * this.UNIT + width * 0.5, 6 * this.UNIT - width * 0.5)
                } else {
                    posX = 8 * this.UNIT + Mathf.random(2 * this.UNIT + width * 0.5, 6 * this.UNIT - width * 0.5)
                }
                posY = this.blockArr[this.blockArr.length-1].node.y + Math.random() * 2 * this.UNIT + 4 * this.UNIT
            }
            go.setPosition(posX, posY)

            this.blockArr.push(block)
            this.node.addChild(go, 0)
        }
    }

    _velocity:cc.Vec2 = cc.Vec2.ZERO
    update (dt) {
        if (this.paused) {
            return
        }
        for (let index = 0; index < this.physicalGroup.length; index++) {
            const element = this.physicalGroup[index];
            element.runPhysicalEngine(dt)
        }
        // this.checkCollision()

        if (this.startCountDown < 0) {
            this.node.y -= 50 * dt
        } else {
            this.startCountDown -= dt
        }
        
    }

    checkCollision() {

    }
}
