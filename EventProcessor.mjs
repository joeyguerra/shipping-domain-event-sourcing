import {
    DomainEvent
} from "./Events.mjs";

class EventProcessor {
    constructor(){
        this.log = [];
        this.IsActive = false;
        this.CurrentEvent = null;
    }
    Process(e = new DomainEvent()){
        this.IsActive = true;
        this.CurrentEvent = e;
        e.Process();
        this.IsActive = false;
        this.log.push(e);
    }
    Reverse(){
        this.CurrentEvent = this.log.pop();
        this.CurrentEvent.Reverse();
    }
}

export default EventProcessor;