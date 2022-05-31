// import { Timer } from "./Timer";

// export class ILaya {
//     static Timer: typeof Timer = Timer;
// }

declare module ala.utils {
    class Timer {
        getTime(): number;
    }
}

declare class Ala  {
    static init();
}

declare module Ala {
    class Timer extends ala.utils.Timer {}
}