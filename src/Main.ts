import { Ala } from "./Ala/Ala"
// import { Timer } from "./Ala/Timer"

class Main {
    timer: Ala.Timer;

    constructor() {
        console.log("test")
        Ala.init();

        this.timer = new Ala.Timer();
        console.log(this.timer.getTime())
    }
}


new Main()
