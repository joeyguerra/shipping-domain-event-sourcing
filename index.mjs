import http from "http";

const requestListener = (req, res) => {
    res.statusCode = 200;
    res.write("Ok - Shipping");
    res.end();
}
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3000, backlog => {
    console.log(`http://localhost:${process.env.PORT || 3000}`);
});