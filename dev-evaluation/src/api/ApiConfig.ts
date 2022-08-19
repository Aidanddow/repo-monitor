import { AjaxRequestBuilder } from "./AjaxBuilder";

const getConfigurationBuilder: (url: string) => AjaxRequestBuilder = (
  url: string
) => {
  return new AjaxRequestBuilder().method("GET").url(url).headers({ "Content-Type": "application/json" });
};

export const getConfigWithoutToken = (url: string) => {
  return getConfigurationBuilder(url).build();
};

export const getConfig = (url: string, token: string) =>
  getConfigurationBuilder(url)
    .appendAuthToken(token)
    .build();

const postConfigurationBuilder: (
  url: string,
  body: FormData
) => AjaxRequestBuilder = (url: string, body: FormData) =>
    new AjaxRequestBuilder()
      .method("POST")
      .url(url)
      .headers({ "Content-Type": "application/json" })
      .body(body);
// .headers(sampleHeader);

const postConfigurationJsonDataBuilder: (
  url: string,
  body: any
) => AjaxRequestBuilder = (url: string, body: any) =>
    new AjaxRequestBuilder()
      .method("POST")
      .url(url)
      .body(body)
      .headers({ "Content-Type": "application/json" });
// .headers(sampleHeader);

export const postConfigWithoutToken = (
  url: string,
  body: any
  // csrfToken: string
) => {
  return (
    postConfigurationBuilder(url, body)
      // .appendCSRF(csrfToken)
      .build()
  );
};
export const patchConfig = (url: string, body: any, token: string) =>
  new AjaxRequestBuilder()
    .method("PATCH")
    .url(url)
    .headers({ "Content-Type": "application/json" })
    .body(body)
    .appendAuthToken(token)
    .build();
export const postConfig = (url: string, body: any, token: string) => {
  return (
    postConfigurationJsonDataBuilder(url, body)
      .appendAuthToken(token)
      // .appendCSRF(csrfToken)
      .build()
  );
};



export const putJsonConfig = (url: string, body: any, token: string) =>
  new AjaxRequestBuilder()
    .method("PUT")
    .url(url)
    .headers({ "Content-Type": "application/json" })
    .appendAuthToken(token)
    .body(body)
    .build();
export const putConfig = (url: string, body: any, token: string) =>
  new AjaxRequestBuilder()
    .method("PUT")
    .url(url)
    .appendAuthToken(token)
    .body(body)
    .build();

export const deleteConfig = (url: string, token: string) =>
  new AjaxRequestBuilder()
    .method("DELETE")
    .url(url)
    .appendAuthToken(token)
    .build();

export const multipartFormDataConfig = (url: string, data: FormData) =>
  new AjaxRequestBuilder()
    .method("POST")
    .url(url)
    // .headers({
    //   'Content-Type': 'multipart/form-data',
    // })
    .body(data)
    .build();
