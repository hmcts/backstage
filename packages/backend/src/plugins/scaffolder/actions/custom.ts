import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { runCommand } from '../helpers/runCommand';

export const scriptAction = () => {
  return createTemplateAction<{ scriptPath: string }>({
    id: 'hmcts:script',
    description: 'Runs a shell script, be careful with this only use it with templates under your control.',
    schema: {
      input: {
        required: ['scriptPath'],
        type: 'object',
        properties: {
          scriptPath: {
            type: 'string',
            title: 'Script path',
            description: 'The file path to a shell script to run inside of the template directory',
          },
        },
      },
    },
    async handler(ctx) {
        ctx.logger.info(
            `Running ${ctx.input.scriptPath} script with hmcts:script scaffolder action, workspace path: ${ctx.workspacePath}`,
        );

        await runCommand({
          command: ctx.input.scriptPath,
          args: [],
          options: {
            cwd: ctx.workspacePath,
          },
          logStream: ctx.logStream
        });
      
    },
  });
};
