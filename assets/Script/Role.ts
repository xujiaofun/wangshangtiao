import Block from "./Block";

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
export default class Role extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    public standNode:cc.Node = null
    public targetIndex:number = 0

    start () {
        cc.log("Role start...")
    }
    

    isEmited:boolean = false
    isReady:boolean = false

    // update (dt) {}

    // 每次处理完碰撞体接触逻辑时被调用
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.tag == 2) {
            contact.disabled = true;
            this.node.emit("JumpFailed")
        }
        if (otherCollider.tag == 0) {
            let block:Block = otherCollider.node.getComponent(Block)
            if (block.index == this.targetIndex) {
                let a = selfCollider.getAABB()
                let b = otherCollider.getAABB()
                cc.log("a, b", a, b)
                if (a.xMax > b.xMin+1 && a.xMin < b.xMax-1 && a.yMin > b.yMin) {
                    this.targetIndex += 1
                    this.node.emit("JumpSuccess")
                }
            } else {
                this.node.emit("JumpFailed")
            }
        }
        this.isEmited = false
    }

    onPreSolve(contact, selfCollider, otherCollider) {
        let body = this.node.getComponent(cc.RigidBody);
        // cc.log("onPreSolve", body.linearVelocity)
    }

    onPostSolve(contact, selfCollider, otherCollider) {
        let body = this.node.getComponent(cc.RigidBody);
        // cc.log("onPostSolve====", body.linearVelocity)
    }

    // onPostSolve(contact, selfCollider, otherCollider) {

    //     let block:Block = otherCollider.node.getComponent(Block)
    //     if (block == null) {
    //         return
    //     }

    //     if (block.isCollided) {
    //         this.node.emit("JumpFailed")
    //         return
    //     }

    //     block.isCollided = true
    //     this.standNode = otherCollider.node

    //     if (otherCollider.tag == 0) {
    //         let body = this.node.getComponent(cc.RigidBody);
    //         if (body.linearVelocity.x == 0 && body.linearVelocity.y == 0) {
    //             this.isEmited = true
    //             let a = selfCollider.getAABB()
    //             let b = otherCollider.getAABB()
    //             cc.log("a, b", a, b)
    //             if (!(a.xMax < b.xMin || a.xMin > b.xMax || a.yMin < b.yMax-10)) {
                    
    //                 this.standNode = otherCollider.node
    //                 this.node.emit("JumpSuccess")
    //             }
    //         }
    //     }
    // }

    checkResult() {

    }

    
}
