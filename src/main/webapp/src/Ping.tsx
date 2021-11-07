export default class Ping {

    public srcServiceName?: String
    public srcHostName: String
    public srcHostAddr: String
    public srcHostPort: String

    public destServiceName: String
    public destHostName: String
    public destHostAddr: String
    public destHostPort: String
    public destUri: String
    public destEndpointMethod: String

    public timestamp: Date
    public responseStatus: String

    static colorFromStatus(status) {
        switch (status) {
            case "200": return "green";   
            case "201": return "blue";         
            case "404": return "red";
            case "500": return "crimson";            
            case "405": return "purple"; 
            default: return "yellow";       
        }
    }
}