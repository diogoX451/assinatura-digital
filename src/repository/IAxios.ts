export interface IAxios {
    baseUrl?: string;
    method: string;
    url?: string;
    headers?: any;
    params?: any;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
    
}