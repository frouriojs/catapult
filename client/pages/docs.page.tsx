import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { staticPath } from 'utils/$path';

const Docs = () => <SwaggerUI url={staticPath.docs.openapi_json} docExpansion="none" />;

export default Docs;
