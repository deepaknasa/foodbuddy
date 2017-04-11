"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __private_imports__1 = require('./__private_imports__');
var parse5 = require('parse5');
var helper_1 = require('./helper');
var parser = null;
var serializer = null;
var treeAdapter = null;
var _attrToPropMap = {
    'class': 'className',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
};
var defDoc = null;
var mapProps = ['attribs', 'x-attribsNamespace', 'x-attribsPrefix'];
function _notImplemented(methodName) {
    return new Error('This method is not implemented in Parse5DomAdapter: ' + methodName);
}
var Parse5DomAdapter = (function (_super) {
    __extends(Parse5DomAdapter, _super);
    function Parse5DomAdapter() {
        _super.apply(this, arguments);
    }
    Parse5DomAdapter.makeCurrent = function () {
        parser = parse5;
        serializer = parse5.serialize;
        treeAdapter = parse5.treeAdapters.htmlparser2;
        __private_imports__1.setRootDomAdapter(new Parse5DomAdapter());
    };
    Parse5DomAdapter.prototype.hasProperty = function (element, name) {
        return _HTMLElementPropertyList.indexOf(name) > -1;
    };
    Parse5DomAdapter.prototype.setProperty = function (el, name, value) {
        if (name === 'innerHTML') {
            this.setInnerHTML(el, value);
        }
        else if (name === 'className') {
            el.attribs['class'] = el.className = value;
        }
        else {
            el[name] = value;
        }
    };
    Parse5DomAdapter.prototype.getProperty = function (el, name) { return el[name]; };
    Parse5DomAdapter.prototype.logError = function (error) { console.error(error); };
    Parse5DomAdapter.prototype.log = function (error) { console.log(error); };
    Parse5DomAdapter.prototype.logGroup = function (error) { console.error(error); };
    Parse5DomAdapter.prototype.logGroupEnd = function () { };
    Object.defineProperty(Parse5DomAdapter.prototype, "attrToPropMap", {
        get: function () { return _attrToPropMap; },
        enumerable: true,
        configurable: true
    });
    Parse5DomAdapter.prototype.query = function (selector) { throw _notImplemented('query'); };
    Parse5DomAdapter.prototype.querySelector = function (el, selector) {
        return this.querySelectorAll(el, selector)[0];
    };
    Parse5DomAdapter.prototype.querySelectorAll = function (el, selector) {
        var res = [];
        var self = this;
        function _recursive(result, node, selector, matcher) {
            var cNodes = node.childNodes;
            if (cNodes && cNodes.length > 0) {
                for (var i = 0; i < cNodes.length; i++) {
                    var childNode = cNodes[i];
                    if (self.elementMatches(childNode, selector, matcher)) {
                        result.push(childNode);
                    }
                    _recursive(result, childNode, selector, matcher);
                }
            }
        }
        ;
        var matcher = new __private_imports__1.SelectorMatcher();
        matcher.addSelectables(__private_imports__1.CssSelector.parse(selector));
        _recursive(res, el, selector, matcher);
        return res;
    };
    Parse5DomAdapter.prototype.elementMatches = function (node, selector, matcher) {
        if (matcher === void 0) { matcher = null; }
        if (this.isElementNode(node) && selector === '*') {
            return true;
        }
        var result = false;
        if (selector && selector.charAt(0) === '#') {
            result = this.getAttribute(node, 'id') === selector.substring(1);
        }
        else if (selector) {
            var result = false;
            if (matcher == null) {
                matcher = new __private_imports__1.SelectorMatcher();
                matcher.addSelectables(__private_imports__1.CssSelector.parse(selector));
            }
            var cssSelector = new __private_imports__1.CssSelector();
            cssSelector.setElement(this.tagName(node));
            if (node.attribs) {
                Object.keys(node.attribs).forEach(function (attrName) {
                    cssSelector.addAttribute(attrName, node.attribs[attrName]);
                });
            }
            var classList = this.classList(node);
            for (var i = 0; i < classList.length; i++) {
                cssSelector.addClassName(classList[i]);
            }
            matcher.match(cssSelector, function (selector, cb) { result = true; });
        }
        return result;
    };
    Parse5DomAdapter.prototype.on = function (el, evt, listener) {
        var listenersMap = el._eventListenersMap;
        if (helper_1.isBlank(listenersMap)) {
            var listenersMap = helper_1.StringMapWrapper.create();
            el._eventListenersMap = listenersMap;
        }
        var listeners = helper_1.StringMapWrapper.get(listenersMap, evt);
        if (helper_1.isBlank(listeners)) {
            listeners = [];
        }
        listeners.push(listener);
        helper_1.StringMapWrapper.set(listenersMap, evt, listeners);
    };
    Parse5DomAdapter.prototype.onAndCancel = function (el, evt, listener) {
        this.on(el, evt, listener);
        return function () {
            helper_1.ListWrapper.remove(helper_1.StringMapWrapper.get(el._eventListenersMap, evt), listener);
        };
    };
    Parse5DomAdapter.prototype.dispatchEvent = function (el, evt) {
        if (helper_1.isBlank(evt.target)) {
            evt.target = el;
        }
        if (helper_1.isPresent(el._eventListenersMap)) {
            var listeners = helper_1.StringMapWrapper.get(el._eventListenersMap, evt.type);
            if (helper_1.isPresent(listeners)) {
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i](evt);
                }
            }
        }
        if (helper_1.isPresent(el.parent)) {
            this.dispatchEvent(el.parent, evt);
        }
        if (helper_1.isPresent(el._window)) {
            this.dispatchEvent(el._window, evt);
        }
    };
    Parse5DomAdapter.prototype.createMouseEvent = function (eventType) {
        return this.createEvent(eventType);
    };
    Parse5DomAdapter.prototype.createEvent = function (eventType) {
        var evt = {
            type: eventType,
            defaultPrevented: false,
            preventDefault: function () { evt.defaultPrevented = true; }
        };
        return evt;
    };
    Parse5DomAdapter.prototype.preventDefault = function (evt) { evt.returnValue = false; };
    Parse5DomAdapter.prototype.isPrevented = function (evt) {
        return helper_1.isPresent(evt.returnValue) && !evt.returnValue;
    };
    Parse5DomAdapter.prototype.getInnerHTML = function (el) {
        return serializer(this.templateAwareRoot(el), parse5.treeAdapters.htmlparse2);
    };
    Parse5DomAdapter.prototype.getTemplateContent = function (el) {
        return null;
    };
    Parse5DomAdapter.prototype.getOuterHTML = function (el) {
        serializer.html = '';
        serializer._serializeElement(el);
        return serializer.html;
    };
    Parse5DomAdapter.prototype.nodeName = function (node) { return node.tagName; };
    Parse5DomAdapter.prototype.nodeValue = function (node) { return node.nodeValue; };
    Parse5DomAdapter.prototype.type = function (node) { throw _notImplemented('type'); };
    Parse5DomAdapter.prototype.content = function (node) { return node.childNodes[0]; };
    Parse5DomAdapter.prototype.firstChild = function (el) {
        return el.firstChild;
    };
    Parse5DomAdapter.prototype.nextSibling = function (el) {
        return el.nextSibling;
    };
    Parse5DomAdapter.prototype.parentElement = function (el) {
        return el.parent;
    };
    Parse5DomAdapter.prototype.childNodes = function (el) {
        return el.childNodes;
    };
    Parse5DomAdapter.prototype.childNodesAsList = function (el) {
        var childNodes = el.childNodes;
        var res = new Array(childNodes.length);
        for (var i = 0; i < childNodes.length; i++) {
            res[i] = childNodes[i];
        }
        return res;
    };
    Parse5DomAdapter.prototype.clearNodes = function (el) {
        while (el.childNodes.length > 0) {
            this.remove(el.childNodes[0]);
        }
    };
    Parse5DomAdapter.prototype.appendChild = function (el, node) {
        this.remove(node);
        treeAdapter.appendChild(this.templateAwareRoot(el), node);
    };
    Parse5DomAdapter.prototype.removeChild = function (el, node) {
        if (helper_1.ListWrapper.contains(el.childNodes, node)) {
            this.remove(node);
        }
    };
    Parse5DomAdapter.prototype.remove = function (el) {
        var parent = el.parent;
        if (parent) {
            var index = parent.childNodes.indexOf(el);
            parent.childNodes.splice(index, 1);
        }
        var prev = el.previousSibling;
        var next = el.nextSibling;
        if (prev) {
            prev.next = next;
        }
        if (next) {
            next.prev = prev;
        }
        el.prev = null;
        el.next = null;
        el.parent = null;
        return el;
    };
    Parse5DomAdapter.prototype.insertBefore = function (el, node) {
        this.remove(node);
        treeAdapter.insertBefore(el.parent, node, el);
    };
    Parse5DomAdapter.prototype.insertAllBefore = function (el, nodes) {
        var _this = this;
        nodes.forEach(function (n) { return _this.insertBefore(el, n); });
    };
    Parse5DomAdapter.prototype.insertAfter = function (el, node) {
        if (el.nextSibling) {
            this.insertBefore(el.nextSibling, node);
        }
        else {
            this.appendChild(el.parent, node);
        }
    };
    Parse5DomAdapter.prototype.setInnerHTML = function (el, value) {
        this.clearNodes(el);
        var content = parser.parseFragment(value, treeAdapter);
        for (var i = 0; i < content.childNodes.length; i++) {
            treeAdapter.appendChild(el, content.childNodes[i]);
        }
    };
    Parse5DomAdapter.prototype.getText = function (el, isRecursive) {
        if (this.isTextNode(el)) {
            return el.data;
        }
        else if (this.isCommentNode(el)) {
            return isRecursive ? '' : el.data;
        }
        else if (helper_1.isBlank(el.childNodes) || el.childNodes.length === 0) {
            return '';
        }
        else {
            var textContent = '';
            for (var i = 0; i < el.childNodes.length; i++) {
                textContent += this.getText(el.childNodes[i], true);
            }
            return textContent;
        }
    };
    Parse5DomAdapter.prototype.setText = function (el, value) {
        if (this.isTextNode(el) || this.isCommentNode(el)) {
            el.data = value;
        }
        else {
            this.clearNodes(el);
            if (value !== '') {
                treeAdapter.insertText(el, value);
            }
        }
    };
    Parse5DomAdapter.prototype.getValue = function (el) { return el.value; };
    Parse5DomAdapter.prototype.setValue = function (el, value) { el.value = value; };
    Parse5DomAdapter.prototype.getChecked = function (el) { return el.checked; };
    Parse5DomAdapter.prototype.setChecked = function (el, value) { el.checked = value; };
    Parse5DomAdapter.prototype.createComment = function (text) { return treeAdapter.createCommentNode(text); };
    Parse5DomAdapter.prototype.createTemplate = function (html) {
        var template = treeAdapter.createElement('template', 'http://www.w3.org/1999/xhtml', []);
        var content = parser.parseFragment(html, treeAdapter);
        treeAdapter.appendChild(template, content);
        return template;
    };
    Parse5DomAdapter.prototype.createElement = function (tagName) {
        return treeAdapter.createElement(tagName, 'http://www.w3.org/1999/xhtml', []);
    };
    Parse5DomAdapter.prototype.createElementNS = function (ns, tagName) {
        return treeAdapter.createElement(tagName, ns, []);
    };
    Parse5DomAdapter.prototype.createTextNode = function (text) {
        var t = this.createComment(text);
        t.type = 'text';
        return t;
    };
    Parse5DomAdapter.prototype.createScriptTag = function (attrName, attrValue) {
        return treeAdapter.createElement('script', 'http://www.w3.org/1999/xhtml', [{ name: attrName, value: attrValue }]);
    };
    Parse5DomAdapter.prototype.createStyleElement = function (css) {
        var style = this.createElement('style');
        this.setText(style, css);
        return style;
    };
    Parse5DomAdapter.prototype.createShadowRoot = function (el) {
        el.shadowRoot = treeAdapter.createDocumentFragment();
        el.shadowRoot.parent = el;
        return el.shadowRoot;
    };
    Parse5DomAdapter.prototype.getShadowRoot = function (el) {
        return el.shadowRoot;
    };
    Parse5DomAdapter.prototype.getHost = function (el) { return el.host; };
    Parse5DomAdapter.prototype.getDistributedNodes = function (el) { throw _notImplemented('getDistributedNodes'); };
    Parse5DomAdapter.prototype.clone = function (node) {
        var _recursive = function (node) {
            var nodeClone = Object.create(Object.getPrototypeOf(node));
            Object.keys(node).forEach(function (prop) {
                var desc = Object.getOwnPropertyDescriptor(node, prop);
                if (desc && 'value' in desc && typeof desc.value !== 'object') {
                    nodeClone[prop] = node[prop];
                }
            });
            nodeClone.parent = null;
            nodeClone.prev = null;
            nodeClone.next = null;
            nodeClone.children = null;
            mapProps.forEach(function (mapName) {
                if (helper_1.isPresent(node[mapName])) {
                    nodeClone[mapName] = {};
                    Object.keys(node[mapName]).forEach(function (prop) {
                        nodeClone[mapName][prop] = node[mapName][prop];
                    });
                }
            });
            var cNodes = node.children;
            if (cNodes) {
                var cNodesClone = new Array(cNodes.length);
                for (var i = 0; i < cNodes.length; i++) {
                    var childNode = cNodes[i];
                    var childNodeClone = _recursive(childNode);
                    cNodesClone[i] = childNodeClone;
                    if (i > 0) {
                        childNodeClone.prev = cNodesClone[i - 1];
                        cNodesClone[i - 1].next = childNodeClone;
                    }
                    childNodeClone.parent = nodeClone;
                }
                nodeClone.children = cNodesClone;
            }
            return nodeClone;
        };
        return _recursive(node);
    };
    Parse5DomAdapter.prototype.getElementsByClassName = function (element, name) {
        return this.querySelectorAll(element, '.' + name);
    };
    Parse5DomAdapter.prototype.getElementsByTagName = function (element, name) {
        throw _notImplemented('getElementsByTagName');
    };
    Parse5DomAdapter.prototype.classList = function (element) {
        var classAttrValue = null;
        var attributes = element.attribs;
        if (attributes && attributes.hasOwnProperty('class')) {
            classAttrValue = attributes['class'];
        }
        return classAttrValue ? classAttrValue.trim().split(/\s+/g) : [];
    };
    Parse5DomAdapter.prototype.addClass = function (element, className) {
        var classList = this.classList(element);
        var index = classList.indexOf(className);
        if (index === -1) {
            classList.push(className);
            element.attribs['class'] = element.className = classList.join(' ');
        }
    };
    Parse5DomAdapter.prototype.removeClass = function (element, className) {
        var classList = this.classList(element);
        var index = classList.indexOf(className);
        if (index > -1) {
            classList.splice(index, 1);
            element.attribs['class'] = element.className = classList.join(' ');
        }
    };
    Parse5DomAdapter.prototype.hasClass = function (element, className) {
        return helper_1.ListWrapper.contains(this.classList(element), className);
    };
    Parse5DomAdapter.prototype.hasStyle = function (element, styleName, styleValue) {
        if (styleValue === void 0) { styleValue = null; }
        var value = this.getStyle(element, styleName) || '';
        return styleValue ? value === styleValue : value.length > 0;
    };
    Parse5DomAdapter.prototype._readStyleAttribute = function (element) {
        var styleMap = {};
        var attributes = element.attribs;
        if (attributes && attributes.hasOwnProperty('style')) {
            var styleAttrValue = attributes['style'];
            var styleList = styleAttrValue.split(/;+/g);
            for (var i = 0; i < styleList.length; i++) {
                if (styleList[i].length > 0) {
                    var elems = styleList[i].split(/:+/g);
                    styleMap[elems[0].trim()] = elems[1].trim();
                }
            }
        }
        return styleMap;
    };
    Parse5DomAdapter.prototype._writeStyleAttribute = function (element, styleMap) {
        var styleAttrValue = '';
        Object.keys(styleMap).forEach(function (key) {
            var newValue = styleMap[key];
            if (newValue && newValue.length > 0) {
                styleAttrValue += key + ':' + styleMap[key] + ';';
            }
        });
        element.attribs['style'] = styleAttrValue;
    };
    Parse5DomAdapter.prototype.setStyle = function (element, styleName, styleValue) {
        var styleMap = this._readStyleAttribute(element);
        styleMap[styleName] = styleValue;
        this._writeStyleAttribute(element, styleMap);
    };
    Parse5DomAdapter.prototype.removeStyle = function (element, styleName) {
        this.setStyle(element, styleName, null);
    };
    Parse5DomAdapter.prototype.getStyle = function (element, styleName) {
        var styleMap = this._readStyleAttribute(element);
        return styleMap.hasOwnProperty(styleName) ? styleMap[styleName] : '';
    };
    Parse5DomAdapter.prototype.tagName = function (element) {
        return element.tagName === 'style' ? 'STYLE' : element.tagName;
    };
    Parse5DomAdapter.prototype.attributeMap = function (element) {
        var res = new Map();
        var elAttrs = treeAdapter.getAttrList(element);
        for (var i = 0; i < elAttrs.length; i++) {
            var attrib = elAttrs[i];
            res.set(attrib.name, attrib.value);
        }
        return res;
    };
    Parse5DomAdapter.prototype.hasAttribute = function (element, attribute) {
        return element.attribs && element.attribs.hasOwnProperty(attribute);
    };
    Parse5DomAdapter.prototype.hasAttributeNS = function (element, ns, attribute) {
        throw _notImplemented('hasAttributeNS');
    };
    Parse5DomAdapter.prototype.getAttribute = function (element, attribute) {
        return element.attribs && element.attribs.hasOwnProperty(attribute) ?
            element.attribs[attribute] :
            null;
    };
    Parse5DomAdapter.prototype.getAttributeNS = function (element, ns, attribute) {
        throw _notImplemented('getAttributeNS');
    };
    Parse5DomAdapter.prototype.setAttribute = function (element, attribute, value) {
        if (attribute) {
            element.attribs[attribute] = value;
            if (attribute === 'class') {
                element.className = value;
            }
        }
    };
    Parse5DomAdapter.prototype.setAttributeNS = function (element, ns, attribute, value) {
        throw _notImplemented('setAttributeNS');
    };
    Parse5DomAdapter.prototype.removeAttribute = function (element, attribute) {
        if (attribute) {
            delete element.attribs[attribute];
        }
    };
    Parse5DomAdapter.prototype.removeAttributeNS = function (element, ns, name) {
        throw _notImplemented('removeAttributeNS');
    };
    Parse5DomAdapter.prototype.templateAwareRoot = function (el) {
        return this.isTemplateElement(el) ? this.content(el) : el;
    };
    Parse5DomAdapter.prototype.createHtmlDocument = function () {
        var newDoc = treeAdapter.createDocument();
        newDoc.title = 'fake title';
        var head = treeAdapter.createElement('head', null, []);
        var body = treeAdapter.createElement('body', 'http://www.w3.org/1999/xhtml', []);
        this.appendChild(newDoc, head);
        this.appendChild(newDoc, body);
        newDoc['head'] = head;
        newDoc['body'] = body;
        newDoc['_window'] = helper_1.StringMapWrapper.create();
        return newDoc;
    };
    Parse5DomAdapter.prototype.defaultDoc = function () {
        var document = Zone.current.get('document');
        if (document) {
            return document;
        }
        return { documentMode: false };
    };
    Parse5DomAdapter.prototype.getBoundingClientRect = function (el) {
        return { left: 0, top: 0, width: 0, height: 0 };
    };
    Parse5DomAdapter.prototype.getTitle = function () {
        var document = Zone.current.get('document');
        if (document && document.title) {
            return document.title;
        }
        throw _notImplemented('getTitle');
    };
    Parse5DomAdapter.prototype.setTitle = function (newTitle) {
        var document = Zone.current.get('document');
        if (document && document.title) {
            return document.title = newTitle;
        }
        throw _notImplemented('setTitle');
    };
    Parse5DomAdapter.prototype.isTemplateElement = function (el) {
        return this.isElementNode(el) && this.tagName(el) === 'template';
    };
    Parse5DomAdapter.prototype.isTextNode = function (node) { return treeAdapter.isTextNode(node); };
    Parse5DomAdapter.prototype.isCommentNode = function (node) { return treeAdapter.isCommentNode(node); };
    Parse5DomAdapter.prototype.isElementNode = function (node) {
        return node ? treeAdapter.isElementNode(node) : false;
    };
    Parse5DomAdapter.prototype.hasShadowRoot = function (node) { return helper_1.isPresent(node.shadowRoot); };
    Parse5DomAdapter.prototype.isShadowRoot = function (node) { return this.getShadowRoot(node) === node; };
    Parse5DomAdapter.prototype.importIntoDoc = function (node) { return this.clone(node); };
    Parse5DomAdapter.prototype.adoptNode = function (node) { return node; };
    Parse5DomAdapter.prototype.getHref = function (el) { return el.href; };
    Parse5DomAdapter.prototype.resolveAndSetHref = function (el, baseUrl, href) {
        if (href == null) {
            el.href = baseUrl;
        }
        else {
            el.href = baseUrl + '/../' + href;
        }
    };
    Parse5DomAdapter.prototype._buildRules = function (parsedRules, css) {
        var rules = [];
        for (var i = 0; i < parsedRules.length; i++) {
            var parsedRule = parsedRules[i];
            var rule = {};
            rule['cssText'] = css;
            rule['style'] = { content: '', cssText: '' };
            if (parsedRule.type === 'rule') {
                rule['type'] = 1;
                rule['selectorText'] = (parsedRule.selectors
                    .join(', ')
                    .replace(/\s{2,}/g, ' ')
                    .replace(/\s*~\s*/g, ' ~ ')
                    .replace(/\s*\+\s*/g, ' + ')
                    .replace(/\s*>\s*/g, ' > ')
                    .replace(/\[(\w+)=(\w+)\]/g, '[$1="$2"]'));
                if (helper_1.isBlank(parsedRule.declarations)) {
                    continue;
                }
                for (var j = 0; j < parsedRule.declarations.length; j++) {
                    var declaration = parsedRule.declarations[j];
                    rule['style'][declaration.property] = declaration.value;
                    rule['style'].cssText += declaration.property + ': ' + declaration.value + ';';
                }
            }
            else if (parsedRule.type === 'media') {
                rule['type'] = 4;
                rule['media'] = { mediaText: parsedRule.media };
                if (parsedRule.rules) {
                    rule['cssRules'] = this._buildRules(parsedRule.rules);
                }
            }
            rules.push(rule);
        }
        return rules;
    };
    Parse5DomAdapter.prototype.supportsDOMEvents = function () { return false; };
    Parse5DomAdapter.prototype.supportsNativeShadowDOM = function () { return false; };
    Parse5DomAdapter.prototype.getGlobalEventTarget = function (target) {
        throw _notImplemented('getGlobalEventTarget');
    };
    Parse5DomAdapter.prototype.getBaseHref = function () {
        throw _notImplemented('getBaseHref');
    };
    Parse5DomAdapter.prototype.resetBaseElement = function () {
        throw _notImplemented('resetBaseElement');
    };
    Parse5DomAdapter.prototype.getHistory = function () {
        throw _notImplemented('getHistory');
    };
    Parse5DomAdapter.prototype.getLocation = function () {
        throw _notImplemented('getLocation');
    };
    Parse5DomAdapter.prototype.getUserAgent = function () { return 'Fake user agent'; };
    Parse5DomAdapter.prototype.getData = function (el, name) {
        return this.getAttribute(el, 'data-' + name);
    };
    Parse5DomAdapter.prototype.getComputedStyle = function (el) {
        throw _notImplemented('getComputedStyle');
    };
    Parse5DomAdapter.prototype.setData = function (el, name, value) {
        this.setAttribute(el, 'data-' + name, value);
    };
    Parse5DomAdapter.prototype.setGlobalVar = function (path, value) {
        helper_1.setValueOnPath(global, path, value);
    };
    Parse5DomAdapter.prototype.supportsWebAnimation = function () { return false; };
    Parse5DomAdapter.prototype.performanceNow = function () {
        if (typeof performance === 'object') {
            return performance.now();
        }
        return (new Date()).getTime();
    };
    Parse5DomAdapter.prototype.getAnimationPrefix = function () { return ''; };
    Parse5DomAdapter.prototype.getTransitionEnd = function () { return 'transitionend'; };
    Parse5DomAdapter.prototype.supportsAnimation = function () { return true; };
    Parse5DomAdapter.prototype.replaceChild = function (el, newNode, oldNode) {
        throw _notImplemented('replaceChild');
    };
    Parse5DomAdapter.prototype.parse = function (templateHtml) {
        throw _notImplemented('Parse5DomAdapter#parse');
    };
    Parse5DomAdapter.prototype.invoke = function (el, methodName, args) {
        throw _notImplemented('Parse5DomAdapter#invoke');
    };
    Parse5DomAdapter.prototype.getEventKey = function (event) {
        throw _notImplemented('Parse5DomAdapter#getEventKey');
    };
    Parse5DomAdapter.prototype.supportsCookies = function () { return false; };
    Parse5DomAdapter.prototype.getCookie = function (name) {
        var document = Zone.current.get('document');
        if (document && document.cookie) {
            return document.cookie;
        }
        throw _notImplemented('Parse5DomAdapter#getCookie');
    };
    Parse5DomAdapter.prototype.setCookie = function (name, value) {
        var document = Zone.current.get('document');
        if (document && document.cookie) {
            return document.cookie[name] = value;
        }
        throw _notImplemented('Parse5DomAdapter#setCookie');
    };
    Parse5DomAdapter.prototype.animate = function (element, keyframes, options) {
        throw _notImplemented('Parse5DomAdapter#animate');
    };
    return Parse5DomAdapter;
}(__private_imports__1.DomAdapter));
exports.Parse5DomAdapter = Parse5DomAdapter;
var _HTMLElementPropertyList = [
    'webkitEntries',
    'incremental',
    'webkitdirectory',
    'selectionDirection',
    'selectionEnd',
    'selectionStart',
    'labels',
    'validationMessage',
    'validity',
    'willValidate',
    'width',
    'valueAsNumber',
    'valueAsDate',
    'value',
    'useMap',
    'defaultValue',
    'type',
    'step',
    'src',
    'size',
    'required',
    'readOnly',
    'placeholder',
    'pattern',
    'name',
    'multiple',
    'min',
    'minLength',
    'maxLength',
    'max',
    'list',
    'indeterminate',
    'height',
    'formTarget',
    'formNoValidate',
    'formMethod',
    'formEnctype',
    'formAction',
    'files',
    'form',
    'disabled',
    'dirName',
    'checked',
    'defaultChecked',
    'autofocus',
    'autocomplete',
    'alt',
    'align',
    'accept',
    'onautocompleteerror',
    'onautocomplete',
    'onwaiting',
    'onvolumechange',
    'ontoggle',
    'ontimeupdate',
    'onsuspend',
    'onsubmit',
    'onstalled',
    'onshow',
    'onselect',
    'onseeking',
    'onseeked',
    'onscroll',
    'onresize',
    'onreset',
    'onratechange',
    'onprogress',
    'onplaying',
    'onplay',
    'onpause',
    'onmousewheel',
    'onmouseup',
    'onmouseover',
    'onmouseout',
    'onmousemove',
    'onmouseleave',
    'onmouseenter',
    'onmousedown',
    'onloadstart',
    'onloadedmetadata',
    'onloadeddata',
    'onload',
    'onkeyup',
    'onkeypress',
    'onkeydown',
    'oninvalid',
    'oninput',
    'onfocus',
    'onerror',
    'onended',
    'onemptied',
    'ondurationchange',
    'ondrop',
    'ondragstart',
    'ondragover',
    'ondragleave',
    'ondragenter',
    'ondragend',
    'ondrag',
    'ondblclick',
    'oncuechange',
    'oncontextmenu',
    'onclose',
    'onclick',
    'onchange',
    'oncanplaythrough',
    'oncanplay',
    'oncancel',
    'onblur',
    'onabort',
    'spellcheck',
    'isContentEditable',
    'contentEditable',
    'outerText',
    'innerText',
    'accessKey',
    'hidden',
    'webkitdropzone',
    'draggable',
    'tabIndex',
    'dir',
    'translate',
    'lang',
    'title',
    'childElementCount',
    'lastElementChild',
    'firstElementChild',
    'children',
    'onwebkitfullscreenerror',
    'onwebkitfullscreenchange',
    'nextElementSibling',
    'previousElementSibling',
    'onwheel',
    'onselectstart',
    'onsearch',
    'onpaste',
    'oncut',
    'oncopy',
    'onbeforepaste',
    'onbeforecut',
    'onbeforecopy',
    'shadowRoot',
    'dataset',
    'classList',
    'className',
    'outerHTML',
    'innerHTML',
    'scrollHeight',
    'scrollWidth',
    'scrollTop',
    'scrollLeft',
    'clientHeight',
    'clientWidth',
    'clientTop',
    'clientLeft',
    'offsetParent',
    'offsetHeight',
    'offsetWidth',
    'offsetTop',
    'offsetLeft',
    'localName',
    'prefix',
    'namespaceURI',
    'id',
    'style',
    'attributes',
    'tagName',
    'parentElement',
    'textContent',
    'baseURI',
    'ownerDocument',
    'nextSibling',
    'previousSibling',
    'lastChild',
    'firstChild',
    'childNodes',
    'parentNode',
    'nodeType',
    'nodeValue',
    'nodeName',
    'closure_lm_714617',
    '__jsaction'
];
