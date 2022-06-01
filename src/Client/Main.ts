//如果不引入 需要编译成库 单独在index.js中加载
// import { Ala } from "./Ala/Ala"
// import { Timer } from "./Ala/Timer"

class Main {
    timer: Ala.Timer;

    constructor() {
        console.log("test")
        Ala.Ala.init();  //这里会报错  若不import

        this.timer = new Ala.Timer();
        console.log(this.timer.getTime())
    }
}


new Main()
