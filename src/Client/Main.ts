
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

