import { defineConfig } from 'vite'
import posthtml from 'posthtml'
import { glob } from 'glob'
import fs from 'node:fs'

const components = {};
const allFiles = glob.sync('src/**/*.*')
allFiles.forEach(file => {
  const filename = file.split('\\').pop().split('/').pop()
  const start = filename.substring(0, filename.indexOf('.'));
  const ending = filename.substring(filename.indexOf('.'));
  if (ending === '.blade.php') {
    components[start] = fs.readFileSync(file, 'utf8')
  }
});

const plugin = function (tree) {
  for (const [key, value] of Object.entries(components)) {
    tree.match({ tag: 'x-'+key }, function (node) {
      return value;
    })
  }

  return tree;
}

function bladeTemplatesPlugin() {
  return {
    name: 'blade-templates-plugin',
    transformIndexHtml: {
      enforce: 'pre',
      async transform(html) {
        const { html: transformedHtml } = await posthtml(plugin).process(html);
        return transformedHtml;
      }
    },
    configureServer(server) {
      server.watcher.on('change', (filePath) => {
        if (filePath.endsWith('.blade.php')) {
          server.restart()
        }
      });
    }
  }
}

export default defineConfig({
  plugins: [
    bladeTemplatesPlugin(),
  ]
})
