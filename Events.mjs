import {
    Ship, Cargo, Port
} from "./DomainModels.mjs";

class DomainEvent {
    constructor(occurred = new Date()){
        this.Occurred = occurred;
        this.Recorded = new Date();
    }
    Process(){
        throw new Error("Must implement.");
    }
    Reverse(){
        throw new Error("Must implement.");
    }
}
class DepartureEvent extends DomainEvent{
    constructor(time = new Date(), port = new Port(), ship = new Ship()){
        super(time);
        this.Port = port;
        this.Ship = ship;
    }
    Process(){
        this.Ship.HandleDeparture(this);
    }
}
class ArrivalEvent extends DomainEvent{
    constructor(time = new Date(), port = new Port(), ship = new Ship()){
        super(time);
        this.Port = port;
        this.Ship = ship;
        this.PriorCargoInCanada = {};
        this.PriorPort = null;
    }
    Process(){
        this.Ship.HandleArrival(this);
    }
}
class LoadEvent extends DomainEvent{
    constructor(occurred = new Date(), cargoCode = "", shipCode = 0){
        super(occurred);
        this.PriorPort = null;
        this.ShipCode = shipCode;
        this.CargoCode = cargoCode;
    }
    get Ship(){
        return Ship.Find(this.ShipCode);
    }
    get Cargo(){
        return Cargo.Find(this.CargoCode);
    }
    Process(){
        this.Cargo.HandleLoad(this);
    }
    Reverse(){
        this.Cargo.ReverseLoad(this);
    }

}
class UnloadEvent extends DomainEvent{
    constructor(occurred = new Date(), cargoCode = "", shipCode = 0){
        super(occurred);
        this.Port = null;
        this.ShipCode = shipCode;
        this.CargoCode = cargoCode;
    }
    get Ship(){
        return Ship.Find(this.ShipCode);
    }
    get Cargo(){
        return Cargo.Find(this.CargoCode);
    }
    Process(){
        this.Cargo.HandleUnload(this);
    }
}

export {
    DomainEvent, DepartureEvent, ArrivalEvent, LoadEvent, UnloadEvent
};