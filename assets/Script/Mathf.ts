const {ccclass, property} = cc._decorator;

class Mathf {
    static sign(num) {
        if (num > 0) {
            return 1
        }
        if (num < 0) {
            return -1
        }
        return 0
    }
}