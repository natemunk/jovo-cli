import {
  AnyObject,
  Configurable,
  execAsync,
  ExecResponse,
  JovoCliError,
  MarketplacePlugin,
  SupportedLanguages,
} from '@jovotech/cli-core';
import downloadGH from 'download-git-repo';
import { resolve, join as joinPaths } from 'path';
import { inspect } from 'util';

/**
 * Downloads and extracts a template.
 * @param projectPath - Path to download and extract the template to.
 */
export async function downloadTemplate(
  projectPath: string,
  language: SupportedLanguages,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const url: string = `jovotech/jovo-v4-template${language === 'javascript' ? '-js' : ''}`;
    downloadGH(url, projectPath, (error: Error) => {
      if (error) {
        return reject(error);
      }

      resolve();
    });
  });
}

export async function runNpmInstall(projectPath: string): Promise<void> {
  try {
    await execAsync('npm install', { cwd: projectPath });
  } catch (error) {
    // Suppress NPM warnings.
    throw new JovoCliError({ message: (error as ExecResponse).stderr!, module: 'NewCommand' });
  }
}

/**
 * Inserts a substring into a provided string at an index.
 * @param substr - Substring to be inserted.
 * @param str - String to insert the substring into.
 * @param index - Position of where to insert the substring.
 */
export function insert(substr: string, str: string, index: number): string {
  return str.substring(0, index) + substr + str.substring(index);
}

/**
 * Available plugins for the Jovo CLI.
 * Note: This is a simplified list focused on Alexa development.
 */
const MARKETPLACE_PLUGINS: MarketplacePlugin[] = [
  {
    name: 'FileDb',
    module: 'FileDb',
    package: '@jovotech/db-filedb',
    description: 'Store user data in a local JSON file for fast prototyping and debugging',
    tags: 'databases',
  },
  {
    name: 'DynamoDb',
    module: 'DynamoDb',
    package: '@jovotech/db-dynamodb',
    description: 'Store user data to AWS DynamoDb',
    tags: 'databases',
  },
  {
    name: 'Jovo Core Platform',
    module: 'CorePlatform',
    package: '@jovotech/platform-core',
    description: 'Build voice experiences for custom devices',
    tags: 'platforms',
  },
  {
    name: 'Amazon Alexa',
    module: 'AlexaPlatform',
    cliModule: 'AlexaCli',
    package: '@jovotech/platform-alexa',
    description: 'Build apps for Amazon Alexa',
    tags: 'platforms',
  },
  {
    name: 'ExpressJs',
    module: 'express',
    package: '@jovotech/server-express',
    description: 'ExpressJs Server',
    tags: 'server',
  },
  {
    name: 'AWS Lambda',
    module: 'lambda',
    package: '@jovotech/server-lambda',
    description: 'Serverless hosting solution by AWS',
    tags: 'server',
  },
];

/**
 * Gets plugins from Jovo Marketplace.
 */
export function fetchMarketPlace(): MarketplacePlugin[] {
  // Convert tags into arrays.
  const plugins = MARKETPLACE_PLUGINS.map((plugin) => ({
    ...plugin,
    tags: typeof plugin.tags === 'string' ? plugin.tags.replace(/\s/g, '').split(',') : plugin.tags,
  }));

  return plugins;
}

/**
 * Gets the Amazon Alexa platform plugin.
 * Convenience helper for Alexa-focused project creation.
 */
export function getAlexaPlugin(): MarketplacePlugin | undefined {
  const plugins = fetchMarketPlace();
  return plugins.find((plugin) => plugin.package === '@jovotech/platform-alexa');
}

/**
 * Gets the AWS Lambda server plugin.
 * Convenience helper for Lambda-based deployments.
 */
export function getLambdaPlugin(): MarketplacePlugin | undefined {
  const plugins = fetchMarketPlace();
  return plugins.find((plugin) => plugin.package === '@jovotech/server-lambda');
}

export function loadPlugin(projectPath: string, pkg: string, module: string): Configurable {
  return new (require(resolve(joinPaths(projectPath, 'node_modules', pkg)))[module])();
}

export async function getFormattedPluginInitConfig(plugin: Configurable): Promise<string> {
  const initConfig: AnyObject | undefined = await plugin.getInitConfig?.();

  if (!initConfig || !Object.keys(initConfig)) {
    return '';
  }

  // Serialize the plugin's default config for further processing
  const rawConfig: string = inspect(initConfig, {
    depth: null,
    colors: false,
  });

  // Format default config with correct indentation
  return rawConfig.replace(/\n/g, '\n\t\t');
}
