import assert from "assert";
import { Ship, Cargo, Port, Country } from "../DomainModels.mjs";
import { DepartureEvent, ArrivalEvent, LoadEvent, UnloadEvent } from "../Events.mjs";
import Registry from "../Registry.mjs";
import EventProcessor from "../EventProcessor.mjs";


const kr = new Ship("King Roy");
const sfo = new Port("San Francisco", Country.US, Registry);
const la = new Port("Los Angeles", Country.US, Registry);
const yyv = new Port("Vancouver", Country.CANADA, Registry);
const eProc = new EventProcessor();
const refact = new Cargo("Refactoring", Registry);

Cargo.Push(refact);
Ship.Push(kr);

describe("Event Sourcing", async ()=>{
    it("Should set ship location upon arrival", async ()=>{
        const ev = new ArrivalEvent(new Date(2005, 11, 1), sfo, kr);
        eProc.Process(ev);
        assert.strictEqual(sfo, kr.Port);
    });

    it("Should put ship out to sea upon departure", async ()=>{
        eProc.Process(new ArrivalEvent(new Date(2005, 10, 1), la, kr));
        eProc.Process(new ArrivalEvent(new Date(2005, 11, 1), sfo, kr));
        eProc.Process(new DepartureEvent(new Date(2005, 11, 1), sfo, kr));
        assert.strictEqual(Port.AT_SEA, kr.Port);
    });

    it("Should mark the cargo as visiting Canada", async ()=>{
        eProc.Process(new LoadEvent(new Date(2005, 11, 1), refact.Code, 0));
        eProc.Process(new ArrivalEvent(new Date(2005, 11, 2), yyv, kr));
        eProc.Process(new DepartureEvent(new Date(2005, 11, 3), yyv, kr));
        eProc.Process(new ArrivalEvent(new Date(2005, 11, 4), sfo, kr));
        eProc.Process(new UnloadEvent(new Date(2005, 11, 5), refact.Code, kr));
        assert.ok(refact.HasBeenInCanada);
    });


});