import PhysicObject from "./PhysicObject";

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
export default class CharacterController extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    physicalBody:PhysicObject

    jumpSuccess:Function

    stopNode:cc.Node
    

    start () {
        this.physicalBody = this.node.getComponent(PhysicObject)
    }

    // update (dt) {}
    onCollisionEnter(other, self) {
        let otherAABB = other.world.aabb
        let otherPreAABB = other.world.preAabb.clone()

        let selfAABB = self.world.aabb
        let selfPreAABB = other.world.preAabb.clone()

        otherPreAABB.x = otherAABB.x
        selfPreAABB.x = selfAABB.x
        if (cc.Intersection.rectRect(otherPreAABB, selfPreAABB)) {
            if (this.physicalBody.velocity.x < 0 && selfPreAABB.xMax > otherPreAABB.xMax) {
                // this.node.x = otherPreAABB.xMax - this.node.parent.x;
                // this.node.x = this.node.parent.convertToNodeSpaceAR(cc.v2(otherPreAABB.xMax, 0)).x
                this.physicalBody.collisionX = -1
            }
            else if (this.physicalBody.velocity.x > 0 && selfPreAABB.xMin < otherPreAABB.xMin) {
                // this.node.x = this.node.parent.convertToNodeSpaceAR(cc.v2(otherPreAABB.xMin, 0)).x 
                this.physicalBody.collisionX = 1
            }

            this.physicalBody.velocity.x = 0
            other.touchingX = true
        }

        otherPreAABB.y = otherAABB.y
        selfPreAABB.y = selfAABB.y
        if (cc.Intersection.rectRect(otherPreAABB, selfPreAABB)) {
            if (this.physicalBody.velocity.y < 0 && selfPreAABB.yMax > otherPreAABB.yMax) {
                this.node.y = this.node.parent.convertToNodeSpaceAR(cc.v2(0, otherPreAABB.yMax + selfPreAABB.height * 0.5)).y 
                this.physicalBody.collisionY = -1
                this.physicalBody.isMoving = false
            }
            else if (this.physicalBody.velocity.y > 0 && selfPreAABB.yMin < otherPreAABB.yMin) {
                this.node.y = this.node.parent.convertToNodeSpaceAR(cc.v2(0, otherPreAABB.yMin - selfPreAABB.height * 0.5)).y 
                this.physicalBody.collisionY = 1
            }

            this.physicalBody.velocity.y = 0
            other.touchingY = true
        }

        if (this.physicalBody.collisionY == -1 && this.jumpSuccess && this.stopNode != other.node) {
            this.stopNode = other.node
            this.jumpSuccess()
        }
    }

    onCollisionExit(other) {
        if (other.touchingX) {
            this.physicalBody.collisionX = 0;
            other.touchingX = false;
        }
        if (other.touchingY) {
            other.touchingY = false;
            this.physicalBody.collisionY = 0;
            this.physicalBody.isMoving = true;
        }
    }
    
}