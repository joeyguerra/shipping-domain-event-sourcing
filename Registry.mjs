import {
    CustomsEventGateway, LoggedPricingGateway, PricingEventGateway
} from "./Gateways.mjs";
import EventProcessor from "./EventProcessor.mjs";

const requestProc = new EventProcessor();
class Registry {
    static get CustomsNotificationGateway(){
        return new CustomsEventGateway(requestProc);
    }
    static get PricingGateway(){
        return new LoggedPricingGateway(requestProc, new PricingEventGateway(), Registry);
    }
    static get EventProcessor(){
        return requestProc;
    }
}

export default Registry;