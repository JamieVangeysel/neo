import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { IBaseApiResponse } from '.'

@Injectable({
  providedIn: 'root'
})
export class DevicesApiService {
  constructor(private http: HttpClient) { }

  // https://api.jamievangeysel.be/v1/neo/devices/dac7ca013a360dd79f138b620275032c172715a254f0825d30c4cf77f9b38c6d4606b06549fb0a5cff1e522c007cb46e/data
  getData<T>(device_uuid?: string): Promise<IBaseApiResponse<T>> {
    if (device_uuid)
      return firstValueFrom(this.http.get<IBaseApiResponse<T>>(`https://api.jamievangeysel.be/v1/neo/devices/${device_uuid}/data`))
    return firstValueFrom(this.http.get<IBaseApiResponse<T>>(`https://api.jamievangeysel.be/v1/neo/devices/data`))
  }
}
