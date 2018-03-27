/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(12)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return endpoints; });
var endpoints;
(function (endpoints) {
    endpoints["getPagePosts"] = "getPagePosts";
    endpoints["getPagePostsSearch"] = "getPagePostsSearch";
    endpoints["getPost"] = "getPost";
    endpoints["getPostComments"] = "getPostComments";
    endpoints["signup"] = "signup";
    endpoints["signin"] = "signin";
    endpoints["signinToken"] = "signinToken";
    endpoints["newPost"] = "newPost";
    endpoints["move"] = "move";
    endpoints["votePost"] = "votePost";
    endpoints["getPostScore"] = "getPostScore";
    endpoints["createPostComment"] = "createPostComment";
    endpoints["setUserImage"] = "setUserImage";
    endpoints["getUserProfile"] = "getUserProfile";
})(endpoints || (endpoints = {}));


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3be7a708_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__ = __webpack_require__(37);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(10)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_app_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3be7a708_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_app_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\app.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] app.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3be7a708", Component.options)
  } else {
    hotAPI.reload("data-v-3be7a708", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_explore_vue__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_15fd4a6e_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_explore_vue__ = __webpack_require__(31);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(19)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-15fd4a6e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_explore_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_15fd4a6e_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_explore_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\explore.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] explore.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-15fd4a6e", Component.options)
  } else {
    hotAPI.reload("data-v-15fd4a6e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_post_info_vue__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ce1da54c_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_post_info_vue__ = __webpack_require__(29);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(26)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-ce1da54c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_post_info_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_ce1da54c_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_post_info_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\posts\\post-info.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] post-info.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ce1da54c", Component.options)
  } else {
    hotAPI.reload("data-v-ce1da54c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_comment_vue__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d550ccc_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_new_comment_vue__ = __webpack_require__(49);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(46)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0d550ccc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_comment_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0d550ccc_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_new_comment_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\comments\\new-comment.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-comment.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0d550ccc", Component.options)
  } else {
    hotAPI.reload("data-v-0d550ccc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__routes__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__views_app_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ws_manager_js__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api_api_ts__ = __webpack_require__(74);





const ws = new __WEBPACK_IMPORTED_MODULE_2__ws_manager_js__["a" /* default */]();
ws.addOnclose(e => console.log("Connection to server closed"));
ws.open(`${location.hostname}:${location.port}`).then(manager => ws.synchronize()).then(res => {
  console.log(res);

  const router = new VueRouter({ routes: __WEBPACK_IMPORTED_MODULE_0__routes__["a" /* default */], mode: 'history' });
  const data = {
    global: {
      ws,
      api: __WEBPACK_IMPORTED_MODULE_3__api_api_ts__["a" /* default */],
      route: to => {
        router.push({ path: to });
      }
    },

    currentPost: null,

    account: {
      logged: false,
      username: null,
      profile: null
    }
  };

  data.global.updateProfileData = () => {
    if (!data.account.username) {
      throw new Error('no username in memory to update profile data');
    }

    __WEBPACK_IMPORTED_MODULE_3__api_api_ts__["a" /* default */].users.getUserProfile(ws, data.account.username);
  };
  data.global.setCurrentPost = p => data.currentPost = p;
  data.global.setCurrentPostScore = score => data.currentPost.score = score;
  data.global.setAccountUsername = username => {
    data.account.username = username;
    data.account.logged = true;

    ws.setUsername(username);
  };
  data.global.search = searchContent => {
    __WEBPACK_IMPORTED_MODULE_3__api_api_ts__["a" /* default */].posts.getPagePostsSearch(ws, 0, searchContent);
  };
  data.global.setLocalStorageAccount = (login, token) => {
    localStorage.session = JSON.stringify({ login, token });
  };
  data.global.logoff = () => {
    data.account.username = null;
    data.account.logged = false;

    data.global.setLocalStorageAccount('', '');
  };

  ws.onAnswer('signinToken', res => {
    data.global.setAccountUsername(res.message.login);
    data.global.updateProfileData();
  });

  ws.onAnswer('getUserProfile', res => {
    data.account.profile = res.message.user;
  });

  if (localStorage.session) {
    const session = JSON.parse(localStorage.session);

    if (session.login && session.token) {
      __WEBPACK_IMPORTED_MODULE_3__api_api_ts__["a" /* default */].account.signinToken(ws, session.login, session.token);
    }
  }

  const appVue = new Vue({
    el: '.app-wrapper',
    components: { app: __WEBPACK_IMPORTED_MODULE_1__views_app_vue__["a" /* default */] },
    router,
    data
  });
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__views_app_vue__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__views_explore_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__views_posts_post_vue__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__views_signup_vue__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__views_signin_vue__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__views_posts_new_post_vue__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__views_profile_vue__ = __webpack_require__(68);








/* harmony default export */ __webpack_exports__["a"] = ([{
  path: '/',
  beforeEnter: (to, from, next) => next('/explore/1')
}, {
  path: '/explore',
  beforeEnter: (to, from, next) => next('/explore/1')
}, {
  path: '/explore/:page',
  component: __WEBPACK_IMPORTED_MODULE_1__views_explore_vue__["a" /* default */],
  name: 'explore'
}, {
  path: '/post/:id',
  component: __WEBPACK_IMPORTED_MODULE_2__views_posts_post_vue__["a" /* default */]
}, {
  path: '/signup',
  component: __WEBPACK_IMPORTED_MODULE_3__views_signup_vue__["a" /* default */]
}, {
  path: '/signin',
  component: __WEBPACK_IMPORTED_MODULE_4__views_signin_vue__["a" /* default */]
}, {
  path: '/new-post',
  component: __WEBPACK_IMPORTED_MODULE_5__views_posts_new_post_vue__["a" /* default */]
}, {
  path: '/tag/:tag',
  component: __WEBPACK_IMPORTED_MODULE_1__views_explore_vue__["a" /* default */],
  name: 'tag'
}, {
  path: '/search/:search',
  component: __WEBPACK_IMPORTED_MODULE_1__views_explore_vue__["a" /* default */],
  name: 'search'
}, {
  path: '/profile/:user',
  component: __WEBPACK_IMPORTED_MODULE_6__views_profile_vue__["a" /* default */],
  name: 'profile'
}, {
  path: '*',
  beforeEnter: (to, from, next) => {

    next('/');
  }
}]);

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("013530b7", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3be7a708\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./app.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3be7a708\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./app.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.app {\r\n  position: relative;\r\n  display: flex;\r\n  flex-direction: row;\r\n  min-height: 100vh;\r\n  max-width: 100vw;\r\n  overflow: hidden;\n}\n.app .content {\r\n  flex-grow: 1;\r\n  display: flex;\r\n  flex-direction: column;\r\n  background: whitesmoke;\r\n  padding: 0 3em;\n}\n.app .background-img {\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 50%;\r\n  min-width: 100%;\r\n  height: 100%;\r\n  transform: translate(-50%, -50%);\r\n  opacity: .1;\n}\n.app .content .content-view {\r\n  flex-grow: 1;\r\n  border-radius: 3px;\r\n  \r\n  z-index: var(--z-content-view);\n}\n.app .content .content-view:not(.no-background) {\r\n  background: rgba(255, 255, 255, 0.9);\r\n  box-shadow: 0 0 12px rgba(20, 20, 20, 0.08);\n}\n.app .content .content-view:not(.no-padding) {\r\n  padding: 1em;\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__nav_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__explore_vue__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__menu_vue__ = __webpack_require__(32);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global', 'currentPost', 'account'],
  components: {
    'comp-nav': __WEBPACK_IMPORTED_MODULE_0__nav_vue__["a" /* default */],
    'comp-explore': __WEBPACK_IMPORTED_MODULE_1__explore_vue__["a" /* default */],
    'comp-menu': __WEBPACK_IMPORTED_MODULE_2__menu_vue__["a" /* default */]
  }
});

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_nav_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_78790a7e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_nav_vue__ = __webpack_require__(18);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(15)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_nav_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_78790a7e_hasScoped_false_node_modules_vue_loader_lib_selector_type_template_index_0_nav_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\nav.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] nav.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-78790a7e", Component.options)
  } else {
    hotAPI.reload("data-v-78790a7e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5e8edf52", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-78790a7e\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./nav.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-78790a7e\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./nav.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n@keyframes grow {\nfrom {\r\n    transform: scaleX(0);\n}\nto {\r\n    transform: scaleX(1);\n}\n}\n.nav {\r\n  display: flex;\r\n  flex-direction: row;\r\n  padding: 1em;\r\n  align-items: center;\r\n  z-index: var(--z-nav);\r\n  font-weight: 900;\r\n  filter: drop-shadow(0 0 2px rgba(20, 20, 20, 0.08));\n}\n.nav .search-area {\r\n  flex-grow: 1;\r\n  display: flex;\n}\n.nav .search-area .search-input {\r\n  margin: 0;\r\n  flex-grow: 1;\n}\n.nav .home {\r\n  font-weight: bold;\n}\n.nav a, .nav div {\r\n  padding: 0.3em;\r\n  text-decoration: none;\n}\n.nav a:hover {\r\n  text-decoration: underline;\n}\n.nav .wrapper {\r\n  flex-grow: 1;\r\n  display: flex;\r\n  flex-direction: row;\r\n  justify-content: flex-end;\r\n  align-items: center;\n}\n.nav .wrapper .bar {\r\n  flex-grow: 1;\r\n  height: 3px;\r\n  background: currentColor;\r\n  opacity: 0.8;\r\n  padding: 0;\r\n  /* transform-origin: right; */\r\n  margin: 0 5vw;\r\n  animation: grow cubic-bezier(0.86, 0, 0.07, 1) 0.9s forwards;\n}\n.nav .profile-pic {\r\n  background-size: cover;\r\n  background-position: center;\r\n  width: 32px;\r\n  height: 32px;\r\n  border-radius: 50%;\r\n  margin-left: 1em;\r\n  box-shadow: 0 0 12px rgba(20, 20, 20, 0.2);\r\n  cursor: pointer;\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global', 'account'],
  data: () => ({
    searchContent: ''
  }),
  methods: {
    logoff() {
      this.global.logoff();
    },

    search() {
      if (!this.searchContent) {
        this.global.route(`/`);
      } else if (this.searchContent.startsWith('#')) {
        const firstTag = this.searchContent.split(' ')[0].replace('#', '').trim();

        this.global.route(`/tag/${firstTag}`);
      } else {
        this.global.route(`/search/${this.searchContent}`);
      }
    },

    goToProfile(username) {
      this.global.route(`/profile/${username}`);
    }
  }
});

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "nav"
  }, [_c('div', {
    staticClass: "search-area"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.searchContent),
      expression: "searchContent"
    }],
    staticClass: "search-input",
    attrs: {
      "type": "text",
      "placeholder": "search by title or by tag with #"
    },
    domProps: {
      "value": (_vm.searchContent)
    },
    on: {
      "keypress": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.search()
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.searchContent = $event.target.value
      }
    }
  })]), _vm._v(" "), (_vm.account.logged === false) ? _c('div', {
    staticClass: "wrapper"
  }, [_c('div', {
    staticClass: "bar"
  }), _vm._v(" "), _c('router-link', {
    attrs: {
      "to": "/signin"
    }
  }, [_vm._v("Log in")]), _vm._v("\n    or\n    "), _c('router-link', {
    attrs: {
      "to": "/signup"
    }
  }, [_vm._v("Sign up")])], 1) : _c('div', {
    staticClass: "wrapper"
  }, [_c('router-link', {
    attrs: {
      "to": "/new-post"
    }
  }, [_vm._v("New post")]), _vm._v(" "), _c('a', {
    attrs: {
      "href": "#"
    },
    on: {
      "click": _vm.logoff
    }
  }, [_vm._v("Disconnect")]), _vm._v(" "), _c('div', [_vm._v("Logged as "), _c('span', [_vm._v(_vm._s(_vm.account.username))])]), _vm._v(" "), _c('div', {
    staticClass: "profile-pic",
    style: ({
      backgroundImage: _vm.account.profile !== null ? ("url('" + (_vm.account.profile.image_url) + "')") : "url('/assets/img/dog.jpg')"
    }),
    on: {
      "click": function($event) {
        _vm.goToProfile(_vm.account.username)
      }
    }
  })], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-78790a7e", esExports)
  }
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("35c933fa", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-15fd4a6e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./explore.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-15fd4a6e\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./explore.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.post[data-v-15fd4a6e] {\r\n  animation: fade-in-right cubic-bezier(0.785, 0.135, 0.15, 0.86) 0.1s forwards;\r\n  opacity: 0;\n}\n.page-navigation[data-v-15fd4a6e] {\r\n  display: flex;\r\n  justify-content: center;\r\n  padding-bottom: 1em;\n}\n.page-navigation button[data-v-15fd4a6e], .page-navigation .next[data-v-15fd4a6e] {\r\n  margin: 1em;\n}\n.no-posts[data-v-15fd4a6e] {\r\n  display: flex;\r\n  justify-content: center;\r\n  align-items: center;\r\n  min-height: 50vh;\r\n  animation-name: messagePop-data-v-15fd4a6e;\r\n  animation-duration: .25s;\r\n  animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1)\n}\n@keyframes messagePop-data-v-15fd4a6e {\nfrom {\r\n    transform: scale(0);\n}\nto {\r\n    transform: scale(1);\n}\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__posts_post_display_vue__ = __webpack_require__(22);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global'],
  components: {
    postdisplay: __WEBPACK_IMPORTED_MODULE_1__posts_post_display_vue__["a" /* default */]
  },
  watch: {
    '$route': 'syncPosts'
  },
  data: () => ({
    posts: [],
    displayEmptyMessage: false
  }),
  created() {
    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__["a" /* endpoints */].getPagePosts, e => {
      if (e.message.posts) this.posts = e.message.posts;

      if (!this.posts.length) this.displayEmptyMessage = true;
    });

    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__["a" /* endpoints */].getPagePostsSearch, e => {
      this.posts = e.message.posts;

      if (!this.posts.length) this.displayEmptyMessage = true;
    });

    this.fetchData();
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {

      if (this.$route.name === 'explore') {
        this.syncPosts();
      } else if (this.$route.name === 'tag') {
        this.syncTagSearch();
      } else {
        this.syncSearch();
      }
    },

    syncPosts() {
      this.posts = [];
      this.global.api.posts.getPagePosts(this.global.ws, this.$route.params.page - 1);
    },

    syncTagSearch() {
      this.posts = [];
      this.global.search(`#${this.$route.params.tag}`);
    },

    syncSearch() {
      this.posts = [];
      this.global.search(this.$route.params.search);
    },

    nextPage() {
      this.global.route(`/explore/${parseInt(this.$route.params.page) + 1}`);
    },
    previousPage() {
      this.global.route(`/explore/${parseInt(this.$route.params.page) - 1}`);
    }
  }
});

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_post_display_vue__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10e31674_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_post_display_vue__ = __webpack_require__(30);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(23)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-10e31674"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_post_display_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_10e31674_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_post_display_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\posts\\post-display.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] post-display.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-10e31674", Component.options)
  } else {
    hotAPI.reload("data-v-10e31674", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("700e15c5", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-10e31674\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./post-display.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-10e31674\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./post-display.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.post[data-v-10e31674] {\r\n  display: flex;\n}\n.post + .post[data-v-10e31674] {\r\n  margin-top: 2em;\n}\n.post .spacer[data-v-10e31674] {\r\n  box-shadow: none;\n}\n.post .post-text[data-v-10e31674] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: space-between;\n}\n.post a.post-title[data-v-10e31674] {\r\n  display: inline-block;\r\n  cursor: pointer;\r\n  margin-bottom: 0em;\r\n  font-size: 2em;\r\n  color: var(--color-black);\n}\n.post a.post-title[data-v-10e31674]:hover {\r\n  text-decoration: underline;\n}\n.post a.tag[data-v-10e31674] {\r\n  margin-right: 0.4em;\n}\n.post .author-wrapper[data-v-10e31674] {\r\n  display: flex;\r\n  align-items: center;\r\n  margin-top: 1em;\n}\n.post .author[data-v-10e31674] {\r\n  display: flex;\n}\n.post .profile-pic[data-v-10e31674] {\r\n  background-size: cover;\r\n  background-position: center;\r\n  /* width: 48px;\r\n  height: 48px;\r\n  border-radius: 50%; */\r\n  width: 74px;\r\n  height: 74px;\r\n  border-radius: 6px;\r\n  cursor: pointer;\r\n  margin-right: 1em;\n}\n.post .profile-pic[data-v-10e31674]:not(.spacer) {\r\n  box-shadow: 0 0 12px rgba(20, 20, 20, 0.08);\n}\n.post.nsfw .profile-pic[data-v-10e31674] {\r\n  filter: blur(3px);\n}\n.post:nth-child(-n + 10) .profile-pic[data-v-10e31674] {\r\n  animation: pop cubic-bezier(0.6, 0.2, 0.45, 1.2) 0.3s forwards;\r\n  transform: scale(0);\r\n  opacity: 0;\n}\r\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__post_info_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Shared_endpoints_ts__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['post', 'global'],
  components: {
    postinfo: __WEBPACK_IMPORTED_MODULE_0__post_info_vue__["a" /* default */]
  },
  data: () => ({
    defaultPostImage: '/assets/img/typewriter.jpg'
  }),
  created() {
    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_1_Shared_endpoints_ts__["a" /* endpoints */].getPost, data => {
      this.global.route(`/post/${data.message.post.id}`);
      this.global.setCurrentPost(data.message.post);
    });
  },
  methods: {
    readPost(id) {
      this.global.route(`/post/${id}`);
    },

    isNsfw() {
      return this.post.tags.indexOf('nsfw') >= 0;
    }
  }
});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("2e7b41d4", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ce1da54c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./post-info.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-ce1da54c\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./post-info.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.post-info[data-v-ce1da54c] {\r\n  display: block;\r\n  font-size: 75%;\r\n  opacity: .8;\r\n  margin-bottom: 1.2rem;\n}\n.post-info div[data-v-ce1da54c] {\r\n  display: inline-block;\n}\n.tag[data-v-ce1da54c] {\r\n  cursor: pointer;\n}\r\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['author', 'score', 'tags', 'global'],
  methods: {
    searchTag(tag) {
      this.global.route(`/tag/${tag.replace('#', '')}`);
    }
  }
});

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "post-info"
  }, [_c('div', [_vm._v("submitted by "), _c('a', {
    attrs: {
      "href": "#"
    }
  }, [_vm._v("@" + _vm._s(_vm.author))]), _vm._v(",")]), _vm._v(" "), _c('div', {
    staticClass: "points"
  }, [_c('b', [_vm._v(_vm._s(_vm.score))]), _vm._v(" points")]), _vm._v(" "), _c('div', [_vm._v("in "), _vm._l((_vm.tags.split(' ')), function(tag, index) {
    return _c('a', {
      key: index,
      staticClass: "tag",
      on: {
        "click": function($event) {
          _vm.searchTag(tag)
        }
      }
    }, [_vm._v(_vm._s(tag) + " ")])
  })], 2)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-ce1da54c", esExports)
  }
}

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "post",
    class: {
      nsfw: _vm.isNsfw()
    }
  }, [_c('div', {
    staticClass: "profile-pic",
    staticStyle: {
      "background-image": "url('/assets/img/robert-magnusson.jpg')"
    },
    style: (("animation-delay: " + (_vm.index * 0.15) + "s; background-image: url(" + (_vm.post.image_url || _vm.defaultPostImage) + ")")),
    on: {
      "click": function($event) {
        _vm.readPost(_vm.post.id)
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "post-text"
  }, [_c('a', {
    staticClass: "post-title",
    on: {
      "click": function($event) {
        _vm.readPost(_vm.post.id)
      }
    }
  }, [_vm._v(_vm._s(_vm.post.title))]), _vm._v(" "), _c('postinfo', {
    attrs: {
      "author": _vm.post.author,
      "score": _vm.post.score,
      "tags": _vm.post.tags,
      "global": _vm.global
    }
  })], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-10e31674", esExports)
  }
}

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "explore"
  }, [_vm._l((_vm.posts), function(post, index) {
    return _c('postdisplay', {
      key: index,
      style: ('animation-delay: ' + index * 0.05 + 's'),
      attrs: {
        "post": post,
        "global": _vm.global
      }
    })
  }), _vm._v(" "), (!_vm.posts.length && _vm.displayEmptyMessage) ? _c('div', {
    staticClass: "no-posts"
  }, [_c('h1', [_vm._v("This page seems empty")])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "page-navigation"
  }, [(_vm.$route.params.page > 1) ? _c('button', {
    staticClass: "previous",
    on: {
      "click": _vm.previousPage
    }
  }, [_vm._v("Previous page")]) : _vm._e(), _vm._v(" "), (_vm.posts.length >= 20) ? _c('button', {
    staticClass: "next",
    on: {
      "click": _vm.nextPage
    }
  }, [_vm._v("Next page")]) : _vm._e()])], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-15fd4a6e", esExports)
  }
}

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menu_vue__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0efdded8_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_menu_vue__ = __webpack_require__(36);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(33)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0efdded8"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_menu_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_0efdded8_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_menu_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\menu.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] menu.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0efdded8", Component.options)
  } else {
    hotAPI.reload("data-v-0efdded8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(34);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("624b83d6", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0efdded8\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./menu.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0efdded8\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./menu.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.menu[data-v-0efdded8] {\r\n  min-width: 200px;\r\n  box-shadow: 0 0 12px rgba(20, 20, 20, 0.08);\r\n\r\n  display: flex;\r\n  flex-direction: column;\r\n  /* padding-top: 6em; */\r\n\r\n  z-index: var(--z-menu);\r\n  background: white;\n}\n.menu .option[data-v-0efdded8] {\r\n  padding: .5em;\r\n  font-size: 1.2em;\n}\n.menu .option[data-v-0efdded8]:hover {\r\n  background: whitesmoke;\n}\n.jadir[data-v-0efdded8] {\r\n  font-size: 2em;\r\n  font-weight: bold;\r\n  text-align: center;\r\n  padding: .5em;\n}\r\n\r\n", ""]);

// exports


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global']
});

/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "menu"
  }, [_c('div', {
    staticClass: "jadir"
  }, [_vm._v("jadir")]), _vm._v(" "), _c('router-link', {
    staticClass: "option home",
    attrs: {
      "to": "/explore/1"
    }
  }, [_vm._v("Home")])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0efdded8", esExports)
  }
}

/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "app flex col-reverse"
  }, [_c('img', {
    staticClass: "background-img",
    attrs: {
      "src": "/assets/img/adrian-infernus.jpg",
      "alt": ""
    }
  }), _vm._v(" "), _c('comp-menu', {
    attrs: {
      "global": _vm.global
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "content background"
  }, [_c('comp-nav', {
    attrs: {
      "global": _vm.global,
      "account": _vm.account
    }
  }), _vm._v(" "), _c('router-view', {
    staticClass: "content-view",
    attrs: {
      "global": _vm.global,
      "account": _vm.account,
      "current-post": _vm.currentPost
    }
  })], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3be7a708", esExports)
  }
}

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_post_vue__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c0b775e_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_post_vue__ = __webpack_require__(51);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(39)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3c0b775e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_post_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3c0b775e_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_post_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\posts\\post.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] post.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3c0b775e", Component.options)
  } else {
    hotAPI.reload("data-v-3c0b775e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(40);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("d8abca86", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3c0b775e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./post.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3c0b775e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./post.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.post[data-v-3c0b775e] {\r\n  position: relative;\r\n  display: flex;\r\n  flex-direction: column;\r\n\r\n  border-radius: 3px;\r\n  background: white;\r\n  padding: 0;\r\n  overflow: hidden;\r\n  box-shadow: 0 0 12px rgba(20, 20, 20, 0.08);\r\n\r\n  border-bottom: solid 1px rgba(20, 20, 20, 0.2);\r\n  padding-bottom: 1.5em;\r\n  flex-grow: 1;\n}\n.post-view[data-v-3c0b775e] {\r\n  padding: 1em;\n}\n.post-view .post-content[data-v-3c0b775e] {\r\n  font-family: 'Encode Sans';\r\n  margin: 0;\r\n\r\n  white-space: pre-wrap;\r\n  word-wrap: break-word;\n}\nimg[data-v-3c0b775e] {\r\n  width: 100%;\n}\nimg.full-view-image[data-v-3c0b775e] {\r\n    box-shadow: 0 -100px 40px 40px rgba(20, 20, 20, 0.3);\r\n    background: white;\r\n    transition: 0.5s margin;\n}\n.post .post-content[data-v-3c0b775e] {\r\n  border-bottom: solid 1px rgba(20, 20, 20, 0.2);\r\n  padding-bottom: 1em;\r\n  margin-bottom: 1em;\n}\n.post .post-content h5[data-v-3c0b775e] {\r\n  margin-bottom: 0;\n}\n.post .post-content a.tag[data-v-3c0b775e] {\r\n  margin-right: 0.4em;\n}\r\n/**\r\n * Answer input wrapper\r\n **/\n.post .answer-wrapper[data-v-3c0b775e] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  align-items: center;\r\n  padding: 1em;\n}\n.post .answer-wrapper textarea[data-v-3c0b775e] {\r\n  width: 90%;\r\n  max-width: 90%;\r\n  min-width: 45%;\r\n  min-height: 150px;\n}\n.post .comments-wrapper[data-v-3c0b775e] {\r\n  display: flex;\r\n  flex-direction: column-reverse;\n}\n.upvote-wrapper[data-v-3c0b775e] {\r\n  display: flex;\r\n  /* justify-content: space-around; */\r\n  padding: 1em;\n}\n.upvote-wrapper button[data-v-3c0b775e] {\r\n  cursor: pointer;\r\n  background: none;\r\n  outline: none;\r\n  border: 0;\r\n  text-decoration: none;\n}\n.upvote-wrapper button[data-v-3c0b775e]:hover {\r\n  text-decoration: underline;\n}\r\n", ""]);

// exports


/***/ }),
/* 41 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__post_info_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__comments_comment_vue__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_Shared_endpoints_ts__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__comments_new_comment_vue__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global', 'currentPost', 'account'],
  components: {
    postinfo: __WEBPACK_IMPORTED_MODULE_0__post_info_vue__["a" /* default */],
    comment: __WEBPACK_IMPORTED_MODULE_1__comments_comment_vue__["a" /* default */],
    newcomment: __WEBPACK_IMPORTED_MODULE_3__comments_new_comment_vue__["a" /* default */]
  },
  data: () => ({
    comments: [],
    displayEmptyMessage: false,
    newCommentContent: '',
    displayFullImage: false
  }),
  created() {
    setTimeout(function () {
      this.displayEmptyMessage = true;
    }, 500);

    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_2_Shared_endpoints_ts__["a" /* endpoints */].getPost, data => {
      this.global.route(`/post/${data.message.post.id}`);
      this.global.setCurrentPost(data.message.post);
    });

    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_2_Shared_endpoints_ts__["a" /* endpoints */].getPostComments, data => {
      console.log(data);
      this.comments = data.message.comments;
    });

    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_2_Shared_endpoints_ts__["a" /* endpoints */].votePost, data => {
      this.global.setCurrentPostScore(data.message.score);
    });

    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_2_Shared_endpoints_ts__["a" /* endpoints */].createPostComment, data => {
      data.message.author = this.account.username;
      if (data.message.answers_comment === null) {
        this.comments.push(data.message);
      } else {
        this.appendCommentToComment(data.message);
      }
    });

    this.global.api.posts.getPost(this.global.ws, this.$route.params.id);
    this.fetchComments();
  },
  methods: {
    fetchComments() {
      this.global.api.comments.getPostComments(this.global.ws, this.$route.params.id);
    },

    upvotePost() {
      this.global.api.posts.votePost(this.global.ws, this.currentPost.id, true);
    },

    downvotePost() {
      this.global.api.posts.votePost(this.global.ws, this.currentPost.id, false);
    },

    appendCommentToComment(comment, comments = this.comments) {
      for (const subComment of comments) {

        if (subComment.id === comment.answers_comment) {

          if (subComment.children_comments) {
            subComment.children_comments.push(comment);
          } else subComment.children_comments = [comment];

          return true;
        } else if (subComment.children_comments) {
          if (this.appendCommentToComment(comment, subComment.children_comments)) return true;
        }
      }

      return false;
    },

    toggleFullImageView() {
      this.displayFullImage = !this.displayFullImage;
    }
  }
});

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_comment_vue__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8559db0e_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_comment_vue__ = __webpack_require__(50);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(43)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-8559db0e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_comment_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_8559db0e_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_comment_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\comments\\comment.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] comment.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8559db0e", Component.options)
  } else {
    hotAPI.reload("data-v-8559db0e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(44);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5b499e76", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8559db0e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./comment.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-8559db0e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./comment.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.comment[data-v-8559db0e] {\r\n  padding: 1em 0;\r\n  animation-name: commentAppear-data-v-8559db0e;\r\n  animation-duration: 1s;\r\n  animation-iteration-count: 1;\r\n  transform-origin: top center;\n}\n.comment .comment-content[data-v-8559db0e] {\r\n  font-family: 'Encode Sans';\r\n  margin: 0;\r\n\r\n  white-space: pre-wrap;\r\n  word-wrap: break-word;\n}\n.comment .author-wrapper[data-v-8559db0e] {\r\n  display: flex;\r\n  align-items: center;\n}\n.comment .author-wrapper .author[data-v-8559db0e] {\r\n  display: flex;\n}\n.comment .author-wrapper .date[data-v-8559db0e] {\r\n  font-size: .8em;\r\n  padding-right: .2em;\n}\nbutton.answer-button[data-v-8559db0e] {\r\n  background: none;\r\n  border: none;\r\n  cursor: pointer;\r\n  text-decoration: none;\n}\nbutton.answer-button[data-v-8559db0e]:hover {\r\n  text-decoration: underline;\n}\n.comment .comment[data-v-8559db0e] {\r\n  padding-left: 1em;\r\n  border-left: solid 1px rgba(145, 145, 145, 0.1);\r\n  padding-bottom: 0;\n}\n@keyframes commentAppear-data-v-8559db0e {\nfrom {\r\n    transform: scaleY(0)\n}\nto {\r\n    transform: scaleY(1)\n}\n}\r\n", ""]);

// exports


/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__new_comment_vue__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  name: "comment",
  props: ['content', 'author', 'creationdate', 'commentId', 'global', 'childrenComments', 'currentPostId'],
  components: {
    newcomment: __WEBPACK_IMPORTED_MODULE_0__new_comment_vue__["a" /* default */]
  },
  computed: {
    creation_date_ago() {
      const diff = Date.now() - new Date(this.creationdate);
      const hours = Math.ceil(diff / (1000 * 3600));
      if (hours >= 24) {
        return Math.floor(hours / 24) + ' days ago';
      } else {
        return hours + ' hours ago';
      }
    }
  },
  data: () => ({
    newCommentWindowShown: false
  }),
  methods: {
    toggleAnswerWindow() {
      this.newCommentWindowShown = !this.newCommentWindowShown;
    }
  }
});

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("1dbebd60", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0d550ccc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./new-comment.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-0d550ccc\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./new-comment.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.new-comment[data-v-0d550ccc] {\r\n  padding-bottom: 1em;\n}\ntextarea[data-v-0d550ccc] {\r\n  width: 100%;\r\n  min-height: 150px;\r\n  display: block;\n}\r\n", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global', 'currentPostId', 'account', 'attachedComment'],
  created() {},
  data: () => ({
    newCommentContent: ''
  }),
  methods: {
    submitComment() {
      if (!this.newCommentContent.trim().length) {
        return;
      }

      this.global.api.comments.createPostComment(this.global.ws, this.currentPostId, this.attachedComment, this.newCommentContent);

      this.newCommentContent = '';

      this.$emit('toggle');
    }
  }
});

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "new-comment"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.newCommentContent),
      expression: "newCommentContent"
    }],
    attrs: {
      "name": "newcomment",
      "id": "",
      "cols": "60",
      "rows": "20"
    },
    domProps: {
      "value": (_vm.newCommentContent)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.newCommentContent = $event.target.value
      }
    }
  }), _vm._v(" "), _c('button', {
    on: {
      "click": _vm.submitComment
    }
  }, [_vm._v("Submit")])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-0d550ccc", esExports)
  }
}

/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "comment"
  }, [_c('pre', {
    staticClass: "comment-content"
  }, [_vm._v(_vm._s(_vm.content))]), _vm._v(" "), _c('div', {
    staticClass: "author-wrapper"
  }, [_c('div', {
    staticClass: "date"
  }, [_vm._v(_vm._s(_vm.creation_date_ago) + " by")]), _vm._v(" "), _c('a', {
    staticClass: "author",
    attrs: {
      "href": "#"
    }
  }, [_vm._v("@" + _vm._s(_vm.author))])]), _vm._v(" "), (_vm.newCommentWindowShown) ? _c('button', {
    staticClass: "default link-style answer-button",
    on: {
      "click": _vm.toggleAnswerWindow
    }
  }, [_vm._v("cancel")]) : _c('button', {
    staticClass: "default link-style answer-button",
    on: {
      "click": _vm.toggleAnswerWindow
    }
  }, [_vm._v("\n    answer\n  ")]), _vm._v(" "), (_vm.newCommentWindowShown) ? _c('newcomment', {
    attrs: {
      "current-post-id": _vm.currentPostId,
      "global": _vm.global,
      "account": _vm.account,
      "attached-comment": _vm.commentId
    },
    on: {
      "toggle": _vm.toggleAnswerWindow
    }
  }) : _vm._e(), _vm._v(" "), _vm._l((_vm.childrenComments), function(subComment) {
    return (_vm.childrenComments.length) ? _c('comment', {
      key: subComment.id,
      attrs: {
        "author": subComment.author,
        "content": subComment.content,
        "creationdate": subComment.creation_date,
        "global": _vm.global,
        "current-post-id": _vm.currentPostId,
        "children-comments": subComment.children_comments,
        "comment-id": subComment.id
      }
    }) : _vm._e()
  })], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-8559db0e", esExports)
  }
}

/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.currentPost !== null) ? _c('div', {
    staticClass: "post no-padding"
  }, [(_vm.currentPost.image_url) ? _c('img', {
    attrs: {
      "alt": "",
      "src": _vm.currentPost.image_url
    },
    on: {
      "click": _vm.toggleFullImageView
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "post-view"
  }, [(_vm.currentPost) ? _c('div', {
    staticClass: "post-content"
  }, [_c('h5', [_vm._v(_vm._s(_vm.currentPost.title))]), _vm._v(" "), _c('postinfo', {
    attrs: {
      "author": _vm.currentPost.author,
      "score": _vm.currentPost.score,
      "tags": _vm.currentPost.tags,
      "global": _vm.global
    }
  }), _vm._v(" "), _c('pre', {
    staticClass: "post-content"
  }, [_vm._v(_vm._s(_vm.currentPost.content))]), _vm._v(" "), (_vm.account.logged) ? _c('div', {
    staticClass: "upvote-wrapper"
  }, [_c('button', {
    staticClass: "up default link-style",
    on: {
      "click": _vm.upvotePost
    }
  }, [_vm._v("upvote")]), _vm._v(" "), _c('button', {
    staticClass: "down default link-style",
    on: {
      "click": _vm.downvotePost
    }
  }, [_vm._v("downvote")])]) : _vm._e()], 1) : _vm._e(), _vm._v(" "), (_vm.account.logged) ? _c('newcomment', {
    attrs: {
      "current-post-id": _vm.currentPost.id,
      "global": _vm.global,
      "account": _vm.account,
      "attached-comment:": null
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.currentPost && _vm.displayEmptyMessage) ? _c('div', {
    staticClass: "post-not-found"
  }, [_c('h5', [_vm._v("Post not found")])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "comments-wrapper"
  }, _vm._l((_vm.comments), function(comment) {
    return _c('comment', {
      key: comment.id,
      attrs: {
        "author": comment.author,
        "content": comment.content,
        "creationdate": comment.creation_date,
        "global": _vm.global,
        "current-post-id": _vm.currentPost.id,
        "children-comments": comment.children_comments,
        "comment-id": comment.id
      }
    })
  }))], 1)]) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3c0b775e", esExports)
  }
}

/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_signup_vue__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1689548d_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_signup_vue__ = __webpack_require__(56);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(53)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1689548d"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_signup_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_1689548d_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_signup_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\signup.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] signup.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1689548d", Component.options)
  } else {
    hotAPI.reload("data-v-1689548d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(54);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("d677ac1a", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1689548d\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./signup.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-1689548d\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./signup.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.signup[data-v-1689548d] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  flex-grow: 1;\n}\n.card[data-v-1689548d] {\r\n  margin: 0 auto;\r\n  padding: 1em;\r\n  box-shadow: 0 0 6px rgba(20, 20, 20, 0.2);\r\n  background: white;\n}\n.informations[data-v-1689548d] {\r\n  padding: .8em;\r\n  background: rgba(200, 200, 200, 0.15);\r\n  border-radius: 3px;\r\n  margin: 1rem;\n}\r\n", ""]);

// exports


/***/ }),
/* 55 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global'],
  data: () => ({
    login: '',
    password: '',
    passwordConfirm: '',
    informationMessage: ''
  }),
  created() {
    setTimeout(() => this.$refs.logininput.focus(), 100);

    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__["a" /* endpoints */].signup, data => {
      console.log(data);

      if (data.message.success) {

        this.global.route('/signin');
      } else {
        if (data.message.message === 'user-already-exists') {
          this.informationMessage = 'The user already exists';
        }
      }
    });
  },
  methods: {
    submitSignup() {
      if (!this.password || !this.passwordConfirm || !this.login) {
        this.showInformation('You must enter a username and a password');
      } else if (this.password !== this.passwordConfirm) {
        this.showInformation('The entered passwords do not match');
      } else if (this.login.length && this.password.length) {
        this.global.api.account.signup(this.global.ws, this.login, this.password);
      }
    },

    showInformation(str) {
      this.informationMessage = '';
      setTimeout(() => {
        this.informationMessage = str;
      }, 100);
    }
  }
});

/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "signup no-background"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('h1', [_vm._v("Sign up")]), _vm._v(" "), (_vm.informationMessage.length > 0) ? _c('div', {
    staticClass: "informations"
  }, [_vm._v("\n      " + _vm._s(_vm.informationMessage) + "\n    ")]) : _vm._e(), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.login),
      expression: "login"
    }],
    ref: "logininput",
    attrs: {
      "type": "text",
      "placeholder": "login"
    },
    domProps: {
      "value": (_vm.login)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.login = $event.target.value
      }
    }
  }), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.password),
      expression: "password"
    }],
    attrs: {
      "type": "password",
      "placeholder": "password"
    },
    domProps: {
      "value": (_vm.password)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.password = $event.target.value
      }
    }
  }), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.passwordConfirm),
      expression: "passwordConfirm"
    }],
    attrs: {
      "type": "password",
      "placeholder": "confirm password"
    },
    domProps: {
      "value": (_vm.passwordConfirm)
    },
    on: {
      "keypress": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.submitSignup($event)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.passwordConfirm = $event.target.value
      }
    }
  }), _vm._v(" "), _c('button', {
    on: {
      "click": _vm.submitSignup
    }
  }, [_vm._v("Submit")])]), _vm._v(" "), _c('router-link', {
    attrs: {
      "to": "/signin"
    }
  }, [_vm._v("already got an account?")])], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-1689548d", esExports)
  }
}

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_signin_vue__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_01f2fe17_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_signin_vue__ = __webpack_require__(61);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(58)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-01f2fe17"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_signin_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_01f2fe17_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_signin_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\signin.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] signin.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-01f2fe17", Component.options)
  } else {
    hotAPI.reload("data-v-01f2fe17", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("4554b948", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-01f2fe17\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./signin.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-01f2fe17\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./signin.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n@keyframes messageSlide-data-v-01f2fe17 {\nfrom {\r\n    transform: translate3d(-5px, 0, 0);\n}\nto {\r\n    transform: translate3d(0px, 0, 0);\n}\n}\n.signin[data-v-01f2fe17] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  flex-grow: 1;\n}\n.card[data-v-01f2fe17] {\r\n  margin: 0 auto;\r\n  padding: 1em;\r\n  box-shadow: 0 0 6px rgba(20, 20, 20, 0.2);\r\n  background: white;\n}\n.informations[data-v-01f2fe17] {\r\n  padding: .8em;\r\n  background: rgba(200, 200, 200, 0.15);\r\n  border-radius: 3px;\r\n  margin: 1rem;\r\n  animation-name: messageSlide-data-v-01f2fe17;\r\n  animation-duration: .5s;\r\n  transform-origin: left;\n}\r\n", ""]);

// exports


/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global'],
  data: () => ({
    login: '',
    password: '',
    informationMessage: ''
  }),
  created() {
    setTimeout(() => this.$refs.logininput.focus(), 100);

    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__["a" /* endpoints */].signin, data => {
      console.log(data);

      if (data.state === 200) {
        this.global.setAccountUsername(data.message.login);
        this.global.route('/');

        this.global.setLocalStorageAccount(data.message.login, data.message.token);
      } else {

        if (data.state === 404) {
          this.showInformation('Login or password is incorrect');
        } else {
          this.showInformation('Something went wrong on our end, please try again');
        }
      }
    });
  },
  methods: {
    authenticate() {
      if (!this.login.length || !this.password.length) {
        return this.showInformation('Please enter a password and a login');
      }

      this.global.api.account.signin(this.global.ws, this.login, this.password);
    },

    showInformation(str) {
      this.informationMessage = '';
      setTimeout(() => {
        this.informationMessage = str;
      }, 100);
    }
  }
});

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "signin no-background"
  }, [_c('div', {
    staticClass: "card"
  }, [_c('h1', [_vm._v("Sign in")]), _vm._v(" "), (_vm.informationMessage.length) ? _c('div', {
    staticClass: "informations"
  }, [_vm._v("\n      " + _vm._s(_vm.informationMessage) + "\n    ")]) : _vm._e(), _vm._v(" "), _c('p', [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.login),
      expression: "login"
    }],
    ref: "logininput",
    attrs: {
      "type": "text",
      "placeholder": "login"
    },
    domProps: {
      "value": (_vm.login)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.login = $event.target.value
      }
    }
  }), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.password),
      expression: "password"
    }],
    attrs: {
      "type": "password",
      "placeholder": "password"
    },
    domProps: {
      "value": (_vm.password)
    },
    on: {
      "keypress": function($event) {
        if (!('button' in $event) && _vm._k($event.keyCode, "enter", 13)) { return null; }
        _vm.authenticate($event)
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.password = $event.target.value
      }
    }
  }), _vm._v(" "), _c('button', {
    on: {
      "click": _vm.authenticate
    }
  }, [_vm._v("Login")])]), _vm._v(" "), _c('router-link', {
    attrs: {
      "to": "/signup"
    }
  }, [_vm._v("need an account?")])], 1)])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-01f2fe17", esExports)
  }
}

/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_post_vue__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3cc8bd5e_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_new_post_vue__ = __webpack_require__(67);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(63)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3cc8bd5e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_new_post_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3cc8bd5e_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_new_post_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\posts\\new-post.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] new-post.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3cc8bd5e", Component.options)
  } else {
    hotAPI.reload("data-v-3cc8bd5e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("16a4e975", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3cc8bd5e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./new-post.vue", function() {
     var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3cc8bd5e\",\"scoped\":true,\"hasInlineConfig\":false}!../../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./new-post.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.new-post[data-v-3cc8bd5e] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  justify-content: center;\r\n  /* background-color: whitesmoke; */\n}\n.card[data-v-3cc8bd5e] {\r\n  margin: 0 auto;\r\n  padding: 1em;\r\n  box-shadow: 0 0 6px rgba(20, 20, 20, 0.2);\r\n  background: white;\n}\ninput.title[data-v-3cc8bd5e] {\r\n  font-size: 2em;\r\n  /* border: none; */\r\n  color: inherit;\r\n  display: block;\n}\ntextarea.description[data-v-3cc8bd5e] {\r\n  min-width: 435px;\r\n  max-width: 90vw;\r\n  min-height: 40vh;\r\n  /* border: none; */\n}\ninput.tags[data-v-3cc8bd5e] {\r\n  /* border: none; */\r\n  color: var(--color-blue);\r\n  width: 100%;\n}\ninput[data-v-3cc8bd5e], textarea[data-v-3cc8bd5e] {\r\n  background: none;\n}\n.submit[data-v-3cc8bd5e] {\r\n  margin: auto;\r\n  display: inherit;\n}\n.char-limit[data-v-3cc8bd5e] {\r\n  display: block;\r\n  text-align: center;\n}\r\n", ""]);

// exports


/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_Shared_interfaces_ts__ = __webpack_require__(66);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global', 'account'],
  data: () => ({
    postTitle: '',
    postDescription: '',
    postTags: '#all #first-post',
    postImageUrl: ''
  }),
  watch: {
    postTags(val) {
      console.log('!!');
      let changed = false;

      const tags = val.trim().split(' ');
      const modTags = [];
      for (let i = 0; i < tags.length; i++) {
        if (tags[i].startsWith('#') && tags[i].length > 1) {
          modTags.push('#' + tags[i].replace(/\#*/g, ''));
        }

        if (!tags[i].startsWith('#')) {
          changed = true;
          modTags.push('#' + tags[i].replace(/\#*/g, ''));
        }
      }
      if (changed) this.postTags = modTags.join(' ');
    }
  },
  created() {
    this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__["a" /* endpoints */].newPost, data => {
      if (data.state === 200) {
        this.global.route(`/post/${data.message.post.id}`);
        this.global.setCurrentPost(data.message.post);
      } else {
        console.log('TODO: manage errors in newPost');
      }
    });
  },
  methods: {
    submit() {
      if (!this.postTitle.trim().length) {
        return;
      }

      this.global.api.posts.newPost(this.global.ws, this.postTitle, this.postDescription, this.postTags, this.postImageUrl);
    }
  }
});

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export MessageState */
/* unused harmony export UserRole */
var MessageState;
(function (MessageState) {
    MessageState[MessageState["success"] = 200] = "success";
    MessageState[MessageState["error"] = 1] = "error";
    MessageState[MessageState["databaseError"] = 500] = "databaseError";
    MessageState[MessageState["notFound"] = 404] = "notFound";
    MessageState[MessageState["unauthorized"] = 401] = "unauthorized";
})(MessageState || (MessageState = {}));
var UserRole;
(function (UserRole) {
    UserRole[UserRole["admin"] = 1] = "admin";
    UserRole[UserRole["standard"] = 2] = "standard";
})(UserRole || (UserRole = {}));
//#endregion 


/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "new-post"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.postTitle),
      expression: "postTitle"
    }],
    staticClass: "title",
    attrs: {
      "type": "text",
      "placeholder": "Set a new title"
    },
    domProps: {
      "value": (_vm.postTitle)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.postTitle = $event.target.value
      }
    }
  }), _vm._v(" "), _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.postDescription),
      expression: "postDescription"
    }],
    staticClass: "description",
    attrs: {
      "type": "text",
      "maxlength": "1024",
      "placeholder": "Tell what you want"
    },
    domProps: {
      "value": (_vm.postDescription)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.postDescription = $event.target.value
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "char-limit"
  }, [_vm._v(_vm._s(_vm.postDescription.length) + " / 1024")]), _vm._v(" "), _c('label', {
    attrs: {
      "for": "image"
    }
  }, [_vm._v("Add a link to an image")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.postImageUrl),
      expression: "postImageUrl"
    }],
    attrs: {
      "name": "image",
      "type": "text",
      "placeholder": "Add a link to an image"
    },
    domProps: {
      "value": (_vm.postImageUrl)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.postImageUrl = $event.target.value
      }
    }
  }), _vm._v(" "), _c('label', {
    attrs: {
      "for": "tags"
    }
  }, [_vm._v("Add tags")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.postTags),
      expression: "postTags"
    }],
    staticClass: "tags",
    attrs: {
      "name": "tags",
      "type": "text"
    },
    domProps: {
      "value": (_vm.postTags)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.postTags = $event.target.value
      }
    }
  }), _vm._v(" "), _c('p', [_c('button', {
    staticClass: "submit",
    on: {
      "click": _vm.submit
    }
  }, [_vm._v("Submit")])])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-3cc8bd5e", esExports)
  }
}

/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_profile_vue__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_76ea5e84_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_profile_vue__ = __webpack_require__(72);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(69)
}
var normalizeComponent = __webpack_require__(2)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-76ea5e84"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_profile_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_76ea5e84_hasScoped_true_node_modules_vue_loader_lib_selector_type_template_index_0_profile_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src\\views\\profile.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] profile.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-76ea5e84", Component.options)
  } else {
    hotAPI.reload("data-v-76ea5e84", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(70);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("a366e094", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-76ea5e84\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./profile.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-76ea5e84\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./profile.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "\n.profile[data-v-76ea5e84] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  align-items: center;\n}\n.profile .user-image[data-v-76ea5e84] {\r\n  margin-top: 2em;\r\n  border-radius: 6px;\r\n  width: 50%;\r\n  border: solid 3px black;\n}\n.profile .user-image-input[data-v-76ea5e84] {\r\n  display: inline-block;\r\n  margin: 1em;\r\n  width: 50%;\n}\n.profile .user-image-button[data-v-76ea5e84] {\r\n  display: inline-block;\n}\r\n", ""]);

// exports


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__ = __webpack_require__(3);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["a"] = ({
  props: ['global', 'account'],
  watch: {
    '$route': 'syncPosts'
  },
  data: () => ({
    newProfileImageUrl: '',
    profileImageUrl: ''
  }),
  created() {
    this.fetchData();
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData() {
      this.global.ws.onAnswer(__WEBPACK_IMPORTED_MODULE_0_Shared_endpoints_ts__["a" /* endpoints */].setUserImage, e => {
        this.global.updateProfileData();
      });
    },

    setProfileImage() {
      this.global.api.users.setUserImage(this.global.ws, this.newProfileImageUrl);
    }
  }
});

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.account.profile !== null) ? _c('div', {
    staticClass: "profile"
  }, [_c('img', {
    staticClass: "user-image",
    attrs: {
      "src": _vm.account.profile.image_url
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "row"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.newProfileImageUrl),
      expression: "newProfileImageUrl"
    }],
    staticClass: "user-image-input",
    attrs: {
      "type": "text",
      "placeholder": "your profile image url"
    },
    domProps: {
      "value": (_vm.newProfileImageUrl)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.newProfileImageUrl = $event.target.value
      }
    }
  }), _vm._v(" "), _c('button', {
    staticClass: "user-image-button",
    on: {
      "click": _vm.setProfileImage
    }
  }, [_vm._v("confirm")])])]) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-hot-reload-api").rerender("data-v-76ea5e84", esExports)
  }
}

/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class WsManager {
  constructor() {
    /**
     * created for later, will be the
     * variable holding the reference
     * of the connection websocket.
     */
    this.ws = null;

    /**
     * created for later, will be the
     * variable storing all the event
     * functions by their names.
     */
    this.events = {};

    /**
     * created for later, will be passed
     * into each of the messages sent
     * to the server to identify us.
     */
    this.token = 'none';

    /**
     * created for later, this is the
     * name used for login
     */
    this.username = null;

    /**
     * a list of functions executed
     * when the onclose event is fired
     */
    this.oncloseEvents = [];
  }

  on(name, fn) {
    this.events[name] = fn;
  }

  onAnswer(name, fn) {
    this.events[name + '-done'] = fn;
  }

  emit(name, obj) {
    const chosenEvent = this.events[name];
    if (chosenEvent && typeof chosenEvent === 'function') {
      chosenEvent(obj);
    }
  }

  _onmessage(message) {
    this.emit(message.title, message);
  }

  _onclose(e) {
    this.oncloseEvents.forEach(fn => fn());
  }

  addOnclose(fn) {
    this.oncloseEvents.push(fn);
  }

  send(name, message) {
    console.log('sent %c' + name, 'color: green');

    if (this.username === null) {
      this.ws.send(JSON.stringify({ title: name, message, token: this.token || null }));
    } else {
      this.ws.send(JSON.stringify({ title: name, login: this.username, message, token: this.token || null }));
    }
  }

  thenable(name, message) {
    return new Promise((resolve, reject) => {
      this.on(name + '-done', message => {
        resolve(message);
      });

      this.send(name, message);
    });
  }

  /**
   * simply opens the websocket connection.
   */
  open(address) {
    return new Promise((resolve, reject) => {
      if (window.location.protocol === 'https:') {
        this.ws = new WebSocket(`wss://${address}/ws`);
      } else {
        this.ws = new WebSocket(`ws://${address}/ws`);
      }

      this.ws.onopen = _ => resolve(this);

      this.ws.onclose = e => this._onclose(e);

      this.ws.onmessage = e => {
        this._onmessage(JSON.parse(e.data));
      };
    });
  }

  /**
   * hit the server to let it know we want
   * to get a fresh new clientId, which
   * will be used for every request sent
   * to the server via a ws connection.
   */
  synchronize() {
    return new Promise((resolve, reject) => {
      // this event will be emitted once the
      // synchronisation is done.
      this.on('synchronize-done', response => {
        this.token = response.message.token;
        resolve(response);
      });

      this.send('synchronize', {});
    });
  }

  setUsername(username) {
    this.username = username;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = WsManager;


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__posts_ts__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__comments_ts__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__account_ts__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__users_ts__ = __webpack_require__(79);




/* harmony default export */ __webpack_exports__["a"] = ({
    posts: __WEBPACK_IMPORTED_MODULE_0__posts_ts__, comments: __WEBPACK_IMPORTED_MODULE_1__comments_ts__, account: __WEBPACK_IMPORTED_MODULE_2__account_ts__, users: __WEBPACK_IMPORTED_MODULE_3__users_ts__
});


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getPagePosts"] = getPagePosts;
/* harmony export (immutable) */ __webpack_exports__["getPagePostsSearch"] = getPagePostsSearch;
/* harmony export (immutable) */ __webpack_exports__["getPost"] = getPost;
/* harmony export (immutable) */ __webpack_exports__["newPost"] = newPost;
/* harmony export (immutable) */ __webpack_exports__["votePost"] = votePost;
/* harmony export (immutable) */ __webpack_exports__["getPostScore"] = getPostScore;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__ = __webpack_require__(3);

function getPagePosts(ws, page) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].getPagePosts, { page });
}
function getPagePostsSearch(ws, page, search) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].getPagePostsSearch, { page, search });
}
function getPost(ws, id) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].getPost, { id });
}
function newPost(ws, title, description, tags, image_url = '') {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].newPost, {
        title,
        content: description,
        tags,
        image_url: image_url.length ? image_url : null
    });
}
function votePost(ws, id, is_upvote) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].votePost, {
        post_id: id,
        is_upvote
    });
}
function getPostScore(ws, id) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].getPostScore, {
        post_id: id
    });
}


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["getPostComments"] = getPostComments;
/* harmony export (immutable) */ __webpack_exports__["createPostComment"] = createPostComment;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__ = __webpack_require__(3);

function getPostComments(ws, id) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].getPostComments, { id });
}
function createPostComment(ws, post_id, answers_comment, content) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].createPostComment, {
        post_id, answers_comment, content
    });
}


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["signup"] = signup;
/* harmony export (immutable) */ __webpack_exports__["signin"] = signin;
/* harmony export (immutable) */ __webpack_exports__["signinToken"] = signinToken;
/* harmony export (immutable) */ __webpack_exports__["logoff"] = logoff;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__ = __webpack_require__(3);

function signup(ws, login, password) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].signup, { login, password });
}
function signin(ws, login, password) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].signin, { login, password });
}
function signinToken(ws, login, token) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].signinToken, { login, token });
}
function logoff(ws, login, token) {
    ws.send(); // TODO
}


/***/ }),
/* 78 */,
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["setUserImage"] = setUserImage;
/* harmony export (immutable) */ __webpack_exports__["getUserProfile"] = getUserProfile;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__ = __webpack_require__(3);

function setUserImage(ws, image_url) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].setUserImage, { image_url });
}
function getUserProfile(ws, username) {
    ws.send(__WEBPACK_IMPORTED_MODULE_0__server_src_shared_endpoints_ts__["a" /* endpoints */].getUserProfile, { username });
}


/***/ })
/******/ ]);