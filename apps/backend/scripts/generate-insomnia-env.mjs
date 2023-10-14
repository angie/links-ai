#!/usr/bin/env node
import { Api } from "sst/node/api";

const ingestApiUrl = Api["ingest-api"].url;
const queryApiUrl = Api["query-api"].url;

const urlMap = {
  authToken: "",
  ingest: ingestApiUrl,
  query: queryApiUrl,
};

// eslint-disable-next-line no-console -- CLI
console.log(JSON.stringify(urlMap, null, 2));
