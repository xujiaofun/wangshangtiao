const {ccclass, property} = cc._decorator;

@ccclass
export default class Mathf {
    static sign(num) {
        if (num > 0) {
            return 1
        }
        if (num < 0) {
            return -1
        }
        return 0
    }

    static random(a:number, b:number) {
        return a + Math.random() * (b-a)
    }
}