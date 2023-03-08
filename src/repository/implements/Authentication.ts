import  IAuthentication  from '../IAuthentication';
import { IAxios } from '../IAxios';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import axios from 'axios';
import { Key } from '../../Model/Key';
export default class Authentication implements IAuthentication{
    
    constructor(private IAxios: IAxios, private Key: Key) {
        this.IAxios = IAxios;
        this.Key = Key;
    }
    
    public async auth(url: string): Promise<void> {
        const oauth = new OAuth({
            consumer: { key: this.Key.getConsumerKey(), secret: this.Key.getConsumerSecret() },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return crypto.createHmac('sha1', key).update(base_string).digest('base64');
            }
        });
        const authorizationHeader = oauth.toHeader(oauth.authorize({ url: url, method: 'GET' }, { key: this.Key.getToken(), secret: this.Key.getTokenSecret() }));

        const options: IAxios = {
            method: 'GET',
            baseUrl: url,
            headers: { Authorization: authorizationHeader.Authorization },
        }

        await axios(options)
            .then((response) => {
                return console.log( response.data);
            })
            .catch((error) => {
              return console.log(error.message);
            });
        
    }
    
}