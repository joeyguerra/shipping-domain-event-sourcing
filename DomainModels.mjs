class Price {
    constructor(cargo = new Cargo(), value = 0.00){
        this.Value = value;
        this.Cargo = cargo;
    }
}
class Port {
    constructor(city = "", country = Country.US, registry){
        this.City = city;
        this.Country = country;
        this.Registry = registry;
    }
    HandleArrival(ev = new ArrivalEvent()){
        ev.Ship.Port = this;
        this.Registry.CustomsNotificationGateway.Notify(ev.Occurred, ev.Ship, ev.Port);
    }
}
Port.AT_SEA = new Port(null, null);

const Country = {
    US: "US",
    CANADA: "CANADA"
};
const cargo = {};
class Cargo {
    constructor(code, registry){
        this.Code = code;
        this.HasBeenInCanada = false;
        this.Port = null;
        this.Ship = null;
        this.DeclaredValue = new Price(this, 0.00);
        this.Registry = registry;
    }
    static Find(code = ""){
        return cargo[code];
    }
    static Push(c){
        if(!c) return;
        cargo[c.Code] = c;
    }
    HandleDeparture(ev = new DepartureEvent()){
        if(Country.CANADA == ev.Port.Country){
            this.HasBeenInCanada = true;
        }
    }
    HandleArrival(ev = new ArrivalEvent()){
        ev.PriorCargoInCanada[this.Code] = this.HasBeenInCanada;
        if(Country.CANADA == ev.Port.Country){
            this.HasBeenInCanada = true;
        }
        this.Port = ev.Port;
        this.DeclaredValue = this.Registry.PricingGateway.GetPrice(this);
    }
    HandleLoad(ev = new LoadEvent()){
        ev.PriorPort = this.Port;
        this.Port = null;
        this.Ship = ev.Ship;
        this.Ship.HandleLoad(ev);
    }
    HandleUnload(ev = new UnloadEvent()){
        this.Port = ev.Port;
    }
    ReverseLoad(ev = new LoadEvent){
        this.Ship.ReverseLoad(ev);
        this.Ship = null;
        this.Port = ev.PriorPort;
    }
    ReverseArrival(ev = new ArrivalEvent()){
        this.HasBeenInCanada = !!ev.PriorCargoInCanada[this.Code];
    }
}

const ships = [];
class Ship {
    constructor(name = ""){
        this.Name = name;
        this.Port = null;
        this.Cargo = [];
    }
    static Find(index = 0){
        return ships[index];
    }
    static Push(ship){
        if(!ship) return;
        ships.push(ship);
    }
    HandleDeparture(ev = new DepartureEvent()){
        this.Port = Port.AT_SEA;
    }
    HandleArrival(ev = new ArrivalEvent()){
        this.Port = ev.Port;
        this.Cargo.forEach(cargo => cargo.HandleArrival(ev));
    }
    HandleLoad(ev = new LoadEvent()){
        this.Cargo.push(ev.Cargo);
    }
}

export {
    Ship, Cargo, Port, Price, Country
};
