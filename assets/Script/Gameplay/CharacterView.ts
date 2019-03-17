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
export default class CharacterView extends cc.Component {

    @property(cc.Node)
    jumpNode: cc.Node = null;

    @property(cc.Node)
    standingNode: cc.Node = null;

    @property(cc.Node)
    avatarNode: cc.Node = null;
    


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.setDirection(1)
    }

    setDirection(value) {
        if (value == 1) {
            this.avatarNode.scaleX = -1
        } else {
            this.avatarNode.scaleX = 1
        }
    }

    playAction(labelName) {
        if (labelName == "jump") {
            this.jumpNode.active = true
            this.standingNode.active = false
        } else {
            this.jumpNode.active = false
            this.standingNode.active = true
        }
    }

    // update (dt) {}
}
