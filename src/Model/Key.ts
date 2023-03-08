export class Key {
    constructor(
        private  consumerKey: any,
        private  consumerSecret: any,
        private  token: any,
        private  tokenSecret: any,
        ) {
            this.consumerKey = consumerKey;
            this.consumerSecret = consumerSecret;
            this.token = token;
            this.tokenSecret = tokenSecret; 
    }
    public getConsumerKey(): any {
        return this.consumerKey = process.env.CONSUMER_KEY;
    }
    public getConsumerSecret(): any {
        return this.consumerSecret = process.env.CONSUMER_SECRET;
    }
    public getToken(): any {
        return this.token = process.env.TOKEN;
    }
    public getTokenSecret(): any {
        return this.tokenSecret = process.env.TOKEN_SECRET;
    }
    
    
}