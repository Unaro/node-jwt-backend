class CInfo {
    static show(req, res, next) {
        console.log(new Client(req))
        next()
    }
}

class Client {
    
    constructor(client) {
        this.method = client.method
        this.ip = client.ip.startsWith('::ffff:') ? client.ip.slice(7) : client.ip
        this.query = client.query
        this.body = client.body
        this.url = client.url
        this.baseUrl = client.baseUrl
        this.originalUrl = client.originalUrl
    }
}

export default CInfo