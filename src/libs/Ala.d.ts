// import { Timer } from "./Timer";

// export class ILaya {
//     static Timer: typeof Timer = Timer;
// }

declare module ala.utils {
    class Timer {
        getTime(): number;
    }
}

declare module ala.core {
    declare class Ala  {
        static init();
    }
}


declare module Ala {
    class Ala extends ala.core.Ala {}
    class Timer extends ala.utils.Timer {}
}