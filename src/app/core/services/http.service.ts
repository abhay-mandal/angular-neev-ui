import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(path,
      { params, observe: 'response' })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: object = {}): Observable<any> {
    return this.http.put(path,
      JSON.stringify(body), { observe: 'response' })
      .pipe(catchError(this.formatErrors));
  }

  post(path: string, body: object = {}, eventType?): Observable<any> {
    if (eventType) {
      return this.uploadPost(path, body, eventType);
    }
    return this.http.post(path, body)
      .pipe(catchError(this.formatErrors));
  }

  delete(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.delete(path, { params })
      .pipe(catchError(this.formatErrors));
  }

  uploadPost(path: string, body: object = {}, eventType): Observable<any> {
    return this.http.post(path, body, eventType)
      .pipe(
        map((event) => {
          switch (event['type']) {
            case HttpEventType.UploadProgress:
              const progress = Math.floor(100 * event['loaded'] / event['total']);
              return { uploadStatus: 'progress', message: progress };
            case HttpEventType.Response:
              return event;
            default:
              return `${event['type']}`;
          }
        }),
        catchError(this.formatErrors)
      );
  }
}
