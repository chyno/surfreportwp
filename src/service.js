import {inject} from 'aurelia-framework';
import {HttpClient} from "aurelia-fetch-client";

@inject(HttpClient)
export class Service {

    constructor(httpClient) {
        this.httpClient = httpClient;
           this.userName = 'Chyno';    
    }

    getUserName()
    {
        return  'Chyno';
    }

    getCurrentLocations()
    {
         return this.httpClient.fetch("/api/userLocation/" + this.userName)
            .catch((r) => {
                alert(r);
            })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    return {};
                }
            }
            )
            .then(locations => {
              return locations;
            });

    }
}