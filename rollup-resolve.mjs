const importMapResolve = (options) => {

  const importMap = options.importMap.imports;

  return {
    name: 'import-map-resolve',

    resolveId(source, importer, options) {

      //console.log(source, options)

      if (importMap.hasOwnProperty(source)) {
        //console.log("found one " + source)
        return {id: importMap[source].path, external: importMap[source].external}
      }

      return null;
    }
  };
};

export default importMapResolve;