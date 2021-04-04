import {
    GetPriceRequest
} from "./GatewayEvents.mjs";

import {
    Cargo, Price
} from "./DomainModels.mjs";

class CustomsEventGateway {
    constructor(processor = new EventProcessor()){
        this.Processor = processor;
    }
    Notify(arrivalDate = new Date(), ship = new Ship(), port = new Port()){
        if(!this.Processor.IsActive) return;
        this.SendToCustoms(this.BuildArrivalMessage(arrivalDate, ship, port));
    }
}

class PricingEventGateway {
    constructor(){}
    GetPrice(cargo = new Cargo()){
        return new Price(cargo, 3.00);
    }
}

class LoggedPricingGateway {
    constructor(processor = new EventProcessor(), gateway = new PricingEventGateway(), registry){
        this.Processor = processor;
        this.log = [];
        this.Gateway = gateway;
        this.Registry = registry;
    }
    GetPrice(cargo = new Cargo()){
        let oldReq = this.oldRequest(cargo);
        if(oldReq) return oldReq.Result;
        return this.newRequest(cargo);
    }
    newRequest(cargo = new Cargo()){
        const req = new GetPriceRequest(cargo, this.Registry.EventProcessor.CurrentEvent);
        req.Result = this.Gateway.GetPrice(cargo)
        this.log.push(req);
        return Object.assign(new GetPriceRequest(), req);
    }
    oldRequest(cargo = new Cargo()){
        let request = this.log.find(req => req.Cargo.Code == cargo.Code);
        if(!request) {
            request = this.newRequest(cargo);
        }
        return Object.assign(new GetPriceRequest(), request);
    }
}

export {
    LoggedPricingGateway, PricingEventGateway, CustomsEventGateway
};