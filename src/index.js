import 'better-log/install';
import template from "babel-template";

let buildModule = template(`
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([IMPORT_PATHS], factory);
    } else if (typeof module === 'object' && module.exports) {
		ANONYMOUS_REQUIRE_VARS;
        module.exports = factory(REQUIRE_VARS);
    } else {
        root.returnExports = factory(GLOBAL_VARS);
    }
}(this, function (IMPORT_VARS) {
    NAMED_IMPORTS;
	BODY;
}));
`);

module.exports = function({ types: t }) {
	return {
		visitor: {
			Program: {
				exit(path, file) {
					let body = path.get("body"),
						sources = [],
						anonymousSources = [],
						vars = [],
						anonymousRequireVars = [],
						requireVars = [],
						globalVars = [],
						namedImports = [],
						isModular = false,
						middleDefaultExportID = false;

					for (let i = 0; i < body.length; i++) {
						let path = body[i],
							isLast = i == body.length - 1;

						if (path.isExportDefaultDeclaration()) {
							let declaration = path.get("declaration");

							if(isLast) {
								path.replaceWith(t.returnStatement(declaration.node));
							} else {
								middleDefaultExportID = path.scope.generateUidIdentifier("export_default");
								path.replaceWith(t.variableDeclaration('var', [t.variableDeclarator(middleDefaultExportID, declaration.node)]));
							}

							isModular = true;
						}

						if (path.isImportDeclaration()) {
							let specifiers = path.node.specifiers;

							if(specifiers.length == 0) {
								anonymousSources.push(path.node.source);
								anonymousRequireVars.push(t.identifier('require(\'' + path.node.source.value + '\');'));
							} else if(specifiers.length == 1 && specifiers[0].type == 'ImportDefaultSpecifier') {
								sources.push(path.node.source);
								vars.push(specifiers[0]);
								globalVars.push(t.identifier('root.' + specifiers[0].local.name));
								requireVars.push(t.identifier('require(\'' + path.node.source.value + '\')'));
							} else {
								let importedID = path.scope.generateUidIdentifier(path.node.source.value);
								sources.push(path.node.source);
								vars.push(importedID);
								globalVars.push(t.identifier('root.' + specifiers[0].local.name));
								requireVars.push(t.identifier('require(\'' +  path.node.source.value + '\')'));
								specifiers.forEach(({imported, local}) => {
									namedImports.push(t.variableDeclaration("var", [
										t.variableDeclarator(t.identifier(local.name), t.identifier(importedID.name + '.' + imported.name))
									]));
								});
							}

							path.remove();

							isModular = true;
						}

						if(isLast && middleDefaultExportID) {
							path.insertAfter(t.returnStatement(middleDefaultExportID));
						}
					}

					if(isModular) {
						var allSources = sources.concat(anonymousSources);
						path.node.body = [
							buildModule({
								IMPORT_PATHS: allSources,								
								IMPORT_VARS: vars,
								GLOBAL_VARS: globalVars,
								ANONYMOUS_REQUIRE_VARS: anonymousRequireVars,
								REQUIRE_VARS: requireVars,
								BODY: path.node.body,
								NAMED_IMPORTS: namedImports
							})
						];
					}
				}
			}
		}
	};
};
