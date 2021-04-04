
import {
    Cargo
} from "./DomainModels.mjs";

import {
    DomainEvent
} from "./Events.mjs";

class QueryEvent {
    constructor(currentEvent = new DomainEvent()){
        this.EventBeingProcessed = currentEvent;
        this.Result = {};
    }
}
class GetPriceRequest extends QueryEvent {
    constructor(cargo = new Cargo(), currentEvent = new DomainEvent()){
        super(currentEvent);
        this.Cargo = cargo;
    }
}

export {
    QueryEvent, GetPriceRequest
};