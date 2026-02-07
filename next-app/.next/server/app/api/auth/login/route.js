"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/login/route";
exports.ids = ["app/api/auth/login/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2Fhome%2Fuser%2Fmulti-tenant%2Fnext-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Fmulti-tenant%2Fnext-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2Fhome%2Fuser%2Fmulti-tenant%2Fnext-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Fmulti-tenant%2Fnext-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var _home_user_multi_tenant_next_app_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/api/auth/login/route.ts */ \"(rsc)/./app/api/auth/login/route.ts\");\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/login/route\",\n        pathname: \"/api/auth/login\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/login/route\"\n    },\n    resolvedPagePath: \"/home/user/multi-tenant/next-app/app/api/auth/login/route.ts\",\n    nextConfigOutput,\n    userland: _home_user_multi_tenant_next_app_app_api_auth_login_route_ts__WEBPACK_IMPORTED_MODULE_2__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/auth/login/route\";\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGbG9naW4lMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZsb2dpbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZob21lJTJGdXNlciUyRm11bHRpLXRlbmFudCUyRm5leHQtYXBwJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZob21lJTJGdXNlciUyRm11bHRpLXRlbmFudCUyRm5leHQtYXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUMwQjtBQUN6RjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHVHQUF1RztBQUMvRztBQUNpSjs7QUFFakoiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly96ZW5pdGgtbmV4dC8/NWNmMSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvaG9tZS91c2VyL211bHRpLXRlbmFudC9uZXh0LWFwcC9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvbG9naW4vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL2xvZ2luXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvdXNlci9tdWx0aS10ZW5hbnQvbmV4dC1hcHAvYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvbG9naW4vcm91dGVcIjtcbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0LCBvcmlnaW5hbFBhdGhuYW1lLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2Fhome%2Fuser%2Fmulti-tenant%2Fnext-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Fmulti-tenant%2Fnext-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/auth/login/route.ts":
/*!*************************************!*\
  !*** ./app/api/auth/login/route.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcrypt */ \"bcrypt\");\n/* harmony import */ var bcrypt__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(bcrypt__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/headers.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_headers__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_2__.PrismaClient();\nasync function POST(request) {\n    try {\n        const { email, password } = await request.json();\n        const user = await prisma.user.findUnique({\n            where: {\n                email\n            }\n        });\n        if (!user) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Invalid credentials\"\n            }, {\n                status: 401\n            });\n        }\n        const isPasswordValid = await (0,bcrypt__WEBPACK_IMPORTED_MODULE_1__.compare)(password, user.password_hash);\n        if (!isPasswordValid) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Invalid credentials\"\n            }, {\n                status: 401\n            });\n        }\n        const token = (0,jsonwebtoken__WEBPACK_IMPORTED_MODULE_3__.sign)({\n            userId: user.id\n        }, process.env.JWT_SECRET, {\n            expiresIn: \"1h\"\n        });\n        (0,next_headers__WEBPACK_IMPORTED_MODULE_4__.cookies)().set(\"token\", token, {\n            httpOnly: true,\n            secure: \"development\" === \"production\",\n            maxAge: 60 * 60,\n            path: \"/\"\n        });\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            message: \"Logged in successfully\"\n        });\n    } catch (e) {\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: e.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvbG9naW4vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUMyQztBQUNWO0FBQ2E7QUFDVjtBQUNHO0FBRXZDLE1BQU1LLFNBQVMsSUFBSUgsd0RBQVlBO0FBRXhCLGVBQWVJLEtBQUtDLE9BQWdCO0lBQ3pDLElBQUk7UUFDRixNQUFNLEVBQUVDLEtBQUssRUFBRUMsUUFBUSxFQUFFLEdBQUcsTUFBTUYsUUFBUUcsSUFBSTtRQUU5QyxNQUFNQyxPQUFPLE1BQU1OLE9BQU9NLElBQUksQ0FBQ0MsVUFBVSxDQUFDO1lBQ3hDQyxPQUFPO2dCQUFFTDtZQUFNO1FBQ2pCO1FBRUEsSUFBSSxDQUFDRyxNQUFNO1lBQ1QsT0FBT1gsa0ZBQVlBLENBQUNVLElBQUksQ0FBQztnQkFBRUksT0FBTztZQUFzQixHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDM0U7UUFFQSxNQUFNQyxrQkFBa0IsTUFBTWYsK0NBQU9BLENBQUNRLFVBQVVFLEtBQUtNLGFBQWE7UUFFbEUsSUFBSSxDQUFDRCxpQkFBaUI7WUFDcEIsT0FBT2hCLGtGQUFZQSxDQUFDVSxJQUFJLENBQUM7Z0JBQUVJLE9BQU87WUFBc0IsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQzNFO1FBRUEsTUFBTUcsUUFBUWYsa0RBQUlBLENBQUM7WUFBRWdCLFFBQVFSLEtBQUtTLEVBQUU7UUFBQyxHQUFHQyxRQUFRQyxHQUFHLENBQUNDLFVBQVUsRUFBRztZQUFFQyxXQUFXO1FBQUs7UUFFbkZwQixxREFBT0EsR0FBR3FCLEdBQUcsQ0FBQyxTQUFTUCxPQUFPO1lBQzVCUSxVQUFVO1lBQ1ZDLFFBQVFOLGtCQUF5QjtZQUNqQ08sUUFBUSxLQUFLO1lBQ2JDLE1BQU07UUFDUjtRQUVBLE9BQU83QixrRkFBWUEsQ0FBQ1UsSUFBSSxDQUFDO1lBQUVvQixTQUFTO1FBQXlCO0lBQy9ELEVBQUUsT0FBT0MsR0FBUTtRQUNmLE9BQU8vQixrRkFBWUEsQ0FBQ1UsSUFBSSxDQUFDO1lBQUVJLE9BQU9pQixFQUFFRCxPQUFPO1FBQUMsR0FBRztZQUFFZixRQUFRO1FBQUk7SUFDL0Q7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL3plbml0aC1uZXh0Ly4vYXBwL2FwaS9hdXRoL2xvZ2luL3JvdXRlLnRzPzRmMjQiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgeyBjb21wYXJlIH0gZnJvbSAnYmNyeXB0JztcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcbmltcG9ydCB7IHNpZ24gfSBmcm9tICdqc29ud2VidG9rZW4nO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgZW1haWwsIHBhc3N3b3JkIH0gPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcblxuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBwcmlzbWEudXNlci5maW5kVW5pcXVlKHtcbiAgICAgIHdoZXJlOiB7IGVtYWlsIH0sXG4gICAgfSk7XG5cbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCBjcmVkZW50aWFscycgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBpc1Bhc3N3b3JkVmFsaWQgPSBhd2FpdCBjb21wYXJlKHBhc3N3b3JkLCB1c2VyLnBhc3N3b3JkX2hhc2gpO1xuXG4gICAgaWYgKCFpc1Bhc3N3b3JkVmFsaWQpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCBjcmVkZW50aWFscycgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2tlbiA9IHNpZ24oeyB1c2VySWQ6IHVzZXIuaWQgfSwgcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCEsIHsgZXhwaXJlc0luOiAnMWgnIH0pO1xuXG4gICAgY29va2llcygpLnNldCgndG9rZW4nLCB0b2tlbiwge1xuICAgICAgaHR0cE9ubHk6IHRydWUsXG4gICAgICBzZWN1cmU6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsXG4gICAgICBtYXhBZ2U6IDYwICogNjAsXG4gICAgICBwYXRoOiAnLycsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiAnTG9nZ2VkIGluIHN1Y2Nlc3NmdWxseScgfSk7XG4gIH0gY2F0Y2ggKGU6IGFueSkge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBlLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsImNvbXBhcmUiLCJQcmlzbWFDbGllbnQiLCJzaWduIiwiY29va2llcyIsInByaXNtYSIsIlBPU1QiLCJyZXF1ZXN0IiwiZW1haWwiLCJwYXNzd29yZCIsImpzb24iLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiZXJyb3IiLCJzdGF0dXMiLCJpc1Bhc3N3b3JkVmFsaWQiLCJwYXNzd29yZF9oYXNoIiwidG9rZW4iLCJ1c2VySWQiLCJpZCIsInByb2Nlc3MiLCJlbnYiLCJKV1RfU0VDUkVUIiwiZXhwaXJlc0luIiwic2V0IiwiaHR0cE9ubHkiLCJzZWN1cmUiLCJtYXhBZ2UiLCJwYXRoIiwibWVzc2FnZSIsImUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/login/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/jsonwebtoken","vendor-chunks/jws","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/safe-buffer","vendor-chunks/ms","vendor-chunks/lodash.once","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isplainobject","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isinteger","vendor-chunks/lodash.isboolean","vendor-chunks/lodash.includes","vendor-chunks/jwa","vendor-chunks/buffer-equal-constant-time"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Flogin%2Froute&page=%2Fapi%2Fauth%2Flogin%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Flogin%2Froute.ts&appDir=%2Fhome%2Fuser%2Fmulti-tenant%2Fnext-app%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fuser%2Fmulti-tenant%2Fnext-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();