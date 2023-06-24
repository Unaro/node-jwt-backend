class CMiddle {
    static middle(req, res, next) {
        console.log(new Client(req))
        next()
    }
}

class Client {
    
    constructor(client) {
        this.query = client.query
        this.params = client.params
        this.body = client.body
        this.ip = client.ip
        this.url = client.url
        this.method = client.method
        this.baseUrl = client.baseUrl
        this.originalUrl = client.originalUrl
    }
}

export default CMiddle