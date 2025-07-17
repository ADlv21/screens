import { registerOTel } from '@vercel/otel';
import { LangfuseExporter } from 'langfuse-vercel';

export function register() {
  registerOTel({
    serviceName: 'appdraft-ai',
    traceExporter: new LangfuseExporter(),
  });
}