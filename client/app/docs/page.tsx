'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { staticPath } from 'utils/$path';

export default function Docs() {
  return <SwaggerUI url={staticPath.docs.openapi_json} docExpansion="list" />;
}
