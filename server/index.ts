import { init } from 'service/app';
import { SERVER_PORT } from 'service/envValues';

void init().listen({ port: SERVER_PORT, host: '0.0.0.0' });
