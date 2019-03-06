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

import GameOverView from "./GameOverView"
import Block from "./Block";
import Role from "./Role";

@ccclass
export default class Game extends cc.Component {

    static instance:Game = null

    blockIndex:number = 0

    @property(cc.Node)
    world: cc.Node = null;

    @property(cc.Node)
    blockLayer: cc.Node = null;

    @property(cc.Node)
    role: cc.Node = null;

    @property(GameOverView)
    gameOverView:GameOverView = null

    @property(cc.Prefab)
    blockPrefab:cc.Prefab = null

    @property()
    velocityXIncrement:number = 100
    @property()
    velocityYIncrement:number = 300
    @property()
    velocityY:number = 300

    @property(cc.Vec2)
    randomXRange:cc.Vec2 = new cc.Vec2(100,120);

    @property(cc.Vec2)
    randomYRange:cc.Vec2 = new cc.Vec2(100,120);


    lastPosY:number = 0
    currentBlock:cc.Node = null
    nextBlock:cc.Node = null

    nodes:Object = {}
    

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        Game.instance = this
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0, -720);
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
        // this.start2()
    }

    start () {
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
            let body = this.role.getComponent(cc.RigidBody);
            let sign = this.blockIndex % 2 == 0 ? 1 : -1
            body.linearVelocity = cc.v2(sign * 250, 600);
        }

        this.node.on(cc.Node.EventType.TOUCH_START, onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, onTouchEnd, this);

        this.role.on("JumpSuccess", function() {
            this.onJumpSuccess()
        }, this)
        this.role.on("JumpFailed", function() {
            this.gameOver()
        }, this)


        
        cc.log("start")
        this.startGame()
    }

    startGame() {
        cc.log("startGame")
        this.blockIndex = 0
        this.blockLayer.removeAllChildren()
        this.nodes = {}
        this.world.setPosition(0, -300)
        this.role.setPosition(-160, 300)
        this.role.getComponent(Role).targetIndex = 0
        this.nodes['role'] = this.role
        this.gameOverView.node.active = false
        this.currentBlock = this.createBlock()
        this.currentBlock.setPosition(-160, 0)

        
        this.moveCamera()
    }

    gameOver() {
        this.gameOverView.node.active = true
    }

    createBlock() {
        
        let node = cc.instantiate(this.blockPrefab)
        let sign = this.blockIndex % 2 == 1 ? 1 : -1
        let startY = this.lastPosY
        
        // node.setPosition(
        //     sign * (Math.random()*(this.randomXRange.y-this.randomXRange.x)+this.randomXRange.x), 
        //     startY + Math.random()*(this.randomYRange.y-this.randomYRange.x)+this.randomYRange.x
        // );
        node.setPosition(sign * 160, startY + this.randomYRange.x)
        this.lastPosY = node.position.y
        // cc.log('node.position.y', node.position.y)
        this.blockLayer.addChild(node)
        let block = node.getComponent(Block)
        block.index = this.blockIndex
        this.blockIndex = this.blockIndex + 1
        this.nodes[block.index] = node

        return node
    }

    moveCamera() {
        // cc.log("moveCamera", -300 - this.currentBlock.getPosition().y, this.world.getPosition().y)
        // // this.world.setPosition(0, -300 - this.currentBlock.getPosition().y)
        // this.world.position = cc.v2(0, -300 - this.currentBlock.getPosition().y)
        // for(let k in this.nodes) {
        //     if (this.nodes[k] instanceof cc.Node ) {
        //         let node = this.nodes[k] as cc.Node
        //         let pos = node.getPosition()
        //         node.setPosition(pos.x, )
        //     }
        //     // let pos = this.nodes[k].getPosition()
        //     // this.nodes[k].setPosition(pos.x, pos.y)
        //     cc.log("pos=",k, typeof(this.nodes[k]), this.nodes[k] instanceof cc.Node)
        // }
    }

    onJumpSuccess() {
        this.currentBlock = this.nextBlock
        this.nextBlock = this.createBlock()
        this.moveCamera()
    }

    updateGame(dt) {

    }

    update (dt) {
        this.updateGame(dt)
    }
}
