"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/isstream";
exports.ids = ["vendor-chunks/isstream"];
exports.modules = {

/***/ "(ssr)/./node_modules/isstream/isstream.js":
/*!*******************************************!*\
  !*** ./node_modules/isstream/isstream.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nvar stream = __webpack_require__(/*! stream */ \"stream\");\nfunction isStream(obj) {\n    return obj instanceof stream.Stream;\n}\nfunction isReadable(obj) {\n    return isStream(obj) && typeof obj._read == \"function\" && typeof obj._readableState == \"object\";\n}\nfunction isWritable(obj) {\n    return isStream(obj) && typeof obj._write == \"function\" && typeof obj._writableState == \"object\";\n}\nfunction isDuplex(obj) {\n    return isReadable(obj) && isWritable(obj);\n}\nmodule.exports = isStream;\nmodule.exports.isReadable = isReadable;\nmodule.exports.isWritable = isWritable;\nmodule.exports.isDuplex = isDuplex;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvaXNzdHJlYW0vaXNzdHJlYW0uanMiLCJtYXBwaW5ncyI6IjtBQUFBLElBQUlBLFNBQVNDLG1CQUFPQSxDQUFDO0FBR3JCLFNBQVNDLFNBQVVDLEdBQUc7SUFDcEIsT0FBT0EsZUFBZUgsT0FBT0ksTUFBTTtBQUNyQztBQUdBLFNBQVNDLFdBQVlGLEdBQUc7SUFDdEIsT0FBT0QsU0FBU0MsUUFBUSxPQUFPQSxJQUFJRyxLQUFLLElBQUksY0FBYyxPQUFPSCxJQUFJSSxjQUFjLElBQUk7QUFDekY7QUFHQSxTQUFTQyxXQUFZTCxHQUFHO0lBQ3RCLE9BQU9ELFNBQVNDLFFBQVEsT0FBT0EsSUFBSU0sTUFBTSxJQUFJLGNBQWMsT0FBT04sSUFBSU8sY0FBYyxJQUFJO0FBQzFGO0FBR0EsU0FBU0MsU0FBVVIsR0FBRztJQUNwQixPQUFPRSxXQUFXRixRQUFRSyxXQUFXTDtBQUN2QztBQUdBUyxPQUFPQyxPQUFPLEdBQWNYO0FBQzVCVSx5QkFBeUIsR0FBR1A7QUFDNUJPLHlCQUF5QixHQUFHSjtBQUM1QkksdUJBQXVCLEdBQUtEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaW52b2ljZS1hcHAvLi9ub2RlX21vZHVsZXMvaXNzdHJlYW0vaXNzdHJlYW0uanM/YWNkOCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJylcblxuXG5mdW5jdGlvbiBpc1N0cmVhbSAob2JqKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBzdHJlYW0uU3RyZWFtXG59XG5cblxuZnVuY3Rpb24gaXNSZWFkYWJsZSAob2JqKSB7XG4gIHJldHVybiBpc1N0cmVhbShvYmopICYmIHR5cGVvZiBvYmouX3JlYWQgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLl9yZWFkYWJsZVN0YXRlID09ICdvYmplY3QnXG59XG5cblxuZnVuY3Rpb24gaXNXcml0YWJsZSAob2JqKSB7XG4gIHJldHVybiBpc1N0cmVhbShvYmopICYmIHR5cGVvZiBvYmouX3dyaXRlID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5fd3JpdGFibGVTdGF0ZSA9PSAnb2JqZWN0J1xufVxuXG5cbmZ1bmN0aW9uIGlzRHVwbGV4IChvYmopIHtcbiAgcmV0dXJuIGlzUmVhZGFibGUob2JqKSAmJiBpc1dyaXRhYmxlKG9iailcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyAgICAgICAgICAgID0gaXNTdHJlYW1cbm1vZHVsZS5leHBvcnRzLmlzUmVhZGFibGUgPSBpc1JlYWRhYmxlXG5tb2R1bGUuZXhwb3J0cy5pc1dyaXRhYmxlID0gaXNXcml0YWJsZVxubW9kdWxlLmV4cG9ydHMuaXNEdXBsZXggICA9IGlzRHVwbGV4XG4iXSwibmFtZXMiOlsic3RyZWFtIiwicmVxdWlyZSIsImlzU3RyZWFtIiwib2JqIiwiU3RyZWFtIiwiaXNSZWFkYWJsZSIsIl9yZWFkIiwiX3JlYWRhYmxlU3RhdGUiLCJpc1dyaXRhYmxlIiwiX3dyaXRlIiwiX3dyaXRhYmxlU3RhdGUiLCJpc0R1cGxleCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/isstream/isstream.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/isstream/isstream.js":
/*!*******************************************!*\
  !*** ./node_modules/isstream/isstream.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nvar stream = __webpack_require__(/*! stream */ \"stream\");\nfunction isStream(obj) {\n    return obj instanceof stream.Stream;\n}\nfunction isReadable(obj) {\n    return isStream(obj) && typeof obj._read == \"function\" && typeof obj._readableState == \"object\";\n}\nfunction isWritable(obj) {\n    return isStream(obj) && typeof obj._write == \"function\" && typeof obj._writableState == \"object\";\n}\nfunction isDuplex(obj) {\n    return isReadable(obj) && isWritable(obj);\n}\nmodule.exports = isStream;\nmodule.exports.isReadable = isReadable;\nmodule.exports.isWritable = isWritable;\nmodule.exports.isDuplex = isDuplex;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvaXNzdHJlYW0vaXNzdHJlYW0uanMiLCJtYXBwaW5ncyI6IjtBQUFBLElBQUlBLFNBQVNDLG1CQUFPQSxDQUFDO0FBR3JCLFNBQVNDLFNBQVVDLEdBQUc7SUFDcEIsT0FBT0EsZUFBZUgsT0FBT0ksTUFBTTtBQUNyQztBQUdBLFNBQVNDLFdBQVlGLEdBQUc7SUFDdEIsT0FBT0QsU0FBU0MsUUFBUSxPQUFPQSxJQUFJRyxLQUFLLElBQUksY0FBYyxPQUFPSCxJQUFJSSxjQUFjLElBQUk7QUFDekY7QUFHQSxTQUFTQyxXQUFZTCxHQUFHO0lBQ3RCLE9BQU9ELFNBQVNDLFFBQVEsT0FBT0EsSUFBSU0sTUFBTSxJQUFJLGNBQWMsT0FBT04sSUFBSU8sY0FBYyxJQUFJO0FBQzFGO0FBR0EsU0FBU0MsU0FBVVIsR0FBRztJQUNwQixPQUFPRSxXQUFXRixRQUFRSyxXQUFXTDtBQUN2QztBQUdBUyxPQUFPQyxPQUFPLEdBQWNYO0FBQzVCVSx5QkFBeUIsR0FBR1A7QUFDNUJPLHlCQUF5QixHQUFHSjtBQUM1QkksdUJBQXVCLEdBQUtEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaW52b2ljZS1hcHAvLi9ub2RlX21vZHVsZXMvaXNzdHJlYW0vaXNzdHJlYW0uanM/YWNkOCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJylcblxuXG5mdW5jdGlvbiBpc1N0cmVhbSAob2JqKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiBzdHJlYW0uU3RyZWFtXG59XG5cblxuZnVuY3Rpb24gaXNSZWFkYWJsZSAob2JqKSB7XG4gIHJldHVybiBpc1N0cmVhbShvYmopICYmIHR5cGVvZiBvYmouX3JlYWQgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLl9yZWFkYWJsZVN0YXRlID09ICdvYmplY3QnXG59XG5cblxuZnVuY3Rpb24gaXNXcml0YWJsZSAob2JqKSB7XG4gIHJldHVybiBpc1N0cmVhbShvYmopICYmIHR5cGVvZiBvYmouX3dyaXRlID09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5fd3JpdGFibGVTdGF0ZSA9PSAnb2JqZWN0J1xufVxuXG5cbmZ1bmN0aW9uIGlzRHVwbGV4IChvYmopIHtcbiAgcmV0dXJuIGlzUmVhZGFibGUob2JqKSAmJiBpc1dyaXRhYmxlKG9iailcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyAgICAgICAgICAgID0gaXNTdHJlYW1cbm1vZHVsZS5leHBvcnRzLmlzUmVhZGFibGUgPSBpc1JlYWRhYmxlXG5tb2R1bGUuZXhwb3J0cy5pc1dyaXRhYmxlID0gaXNXcml0YWJsZVxubW9kdWxlLmV4cG9ydHMuaXNEdXBsZXggICA9IGlzRHVwbGV4XG4iXSwibmFtZXMiOlsic3RyZWFtIiwicmVxdWlyZSIsImlzU3RyZWFtIiwib2JqIiwiU3RyZWFtIiwiaXNSZWFkYWJsZSIsIl9yZWFkIiwiX3JlYWRhYmxlU3RhdGUiLCJpc1dyaXRhYmxlIiwiX3dyaXRlIiwiX3dyaXRhYmxlU3RhdGUiLCJpc0R1cGxleCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/isstream/isstream.js\n");

/***/ })

};
;