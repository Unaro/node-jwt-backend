import { EventEmitter } from "node:events";

const events = ['statistic']

class statisticEmmiter extends EventEmitter {

    PushStatistic(userId, statistic, count) {
        this.emit(events[0], {userId, statistic, count})
    }
}

export default new statisticEmmiter();