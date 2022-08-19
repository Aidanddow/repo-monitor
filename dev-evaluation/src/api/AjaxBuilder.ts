import { AjaxConfig } from 'rxjs/ajax';

type HTTPVerbs = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export class AjaxRequestBuilder {
  private request: AjaxConfig = {
    url: ''
  };
  public async = (value: boolean) => {
    this.request.async = value;
    return this;
  };
  public url = (value: string) => {
    this.request.url = value;
    return this;
  };
  public body = (value: any) => {
    this.request.body = value;
    return this;
  };
  // tslint:disable-next-line:ban-types
  public headers = (value: Object) => {
    this.request.headers = value;
    return this;
  };
  public appendCSRF = (csrfToken: string) => {
    this.request.headers = {
      ...this.request.headers,
      'X-CSRFToken': csrfToken
    };
    return this;
  };
  public appendAuthToken = (token: string) => {
    if (token)
      this.request.headers = {
        ...this.request.headers,
        Authorization: 'Token ' + token
      };
    return this;
  };
  public method = (value: HTTPVerbs) => {
    this.request.method = value;
    return this;
  };
  public build = () => this.request;
}
