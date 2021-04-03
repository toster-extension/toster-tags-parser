const FILENAME_REGEX = /^[\w,\s-]+\.[A-Za-z]{3,4}$/;
const QUERY_REGEX = /^(\??[\w\\[\]-]+=[^&]*&?)+$/;

function clean (paths: string[]): string[] {
  return paths.map((path) => path.replace(/^\//, '').replace(/\/$/, ''));
}

function isFile (path: string): boolean {
  return FILENAME_REGEX.test(path);
}

function isQuery (path: string): boolean {
  return QUERY_REGEX.test(path);
}

export const urlGlue = (...paths: string[]): string => {
  const clearedPaths = clean(paths);
  const last = paths
    .join('/')
    .split('/')
    .pop();

  if (isFile(last) || isQuery(last)) {
    return clearedPaths.join('/');
  }

  return `${clearedPaths.join('/')}/`;
};
