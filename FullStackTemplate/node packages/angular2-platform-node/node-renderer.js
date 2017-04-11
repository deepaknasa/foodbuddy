"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var get_dom_1 = require('./get-dom');
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var helper_1 = require('./helper');
var node_shared_styles_host_1 = require('./node-shared-styles-host');
var NAMESPACE_URIS = {
    'xlink': 'http://www.w3.org/1999/xlink',
    'svg': 'http://www.w3.org/2000/svg',
    'xhtml': 'http://www.w3.org/1999/xhtml'
};
var TEMPLATE_COMMENT_TEXT = 'template bindings={}';
var TEMPLATE_BINDINGS_EXP = /^template bindings=(.*)$/;
var NodeDomRootRenderer = (function () {
    function NodeDomRootRenderer(document, eventManager, sharedStylesHost, _animationDriver) {
        this.document = document;
        this.eventManager = eventManager;
        this.sharedStylesHost = sharedStylesHost;
        this._animationDriver = _animationDriver;
        this.registeredComponents = new Map();
    }
    NodeDomRootRenderer.prototype.renderComponent = function (componentProto) {
        var renderer = this.registeredComponents.get(componentProto.id);
        if (helper_1.isBlank(renderer)) {
            renderer = new NodeDomRenderer(this, componentProto, this._animationDriver);
            this.registeredComponents.set(componentProto.id, renderer);
        }
        return renderer;
    };
    NodeDomRootRenderer = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(platform_browser_1.DOCUMENT)), 
        __metadata('design:paramtypes', [Object, platform_browser_1.EventManager, node_shared_styles_host_1.NodeSharedStylesHost, platform_browser_1.AnimationDriver])
    ], NodeDomRootRenderer);
    return NodeDomRootRenderer;
}());
exports.NodeDomRootRenderer = NodeDomRootRenderer;
exports.ATTRIBUTES = {
    textarea: [
        'autocapitalize',
        'autocomplete',
        'autofocus',
        'cols',
        'disabled',
        'form',
        'maxlength',
        'minlength',
        'name',
        'placeholder',
        'readonly',
        'required',
        'rows',
        'selectionDirection',
        'selectionEnd',
        'selectionStart',
        'spellcheck',
        'wrap'
    ],
    script: [
        'async',
        'integrity',
        'src',
        'type',
        'text',
        'defer',
        'crossorigin'
    ],
    button: [
        'autofocus',
        'autocomplete',
        'disabled',
        'form',
        'formaction',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'formtarget',
        'name',
        'type',
        'value'
    ],
    fieldset: [
        'disabled',
        'form',
        'name'
    ],
    a: [
        'download',
        'href',
        'hreflang',
        'ping',
        'referrerpolicy',
        'rel',
        'target',
        'type'
    ],
    img: [
        'alt',
        'crossorigin',
        'height',
        'ismap',
        'longdesc',
        'referrerpolicy',
        'sizesHTML5',
        'src',
        'srcsetHTML5',
        'width',
        'usemap'
    ],
    input: [
        'id',
        'type',
        'accept',
        'mozactionhint',
        'autocapitalize',
        'autocomplete',
        'autocorrect',
        'autofocus',
        'autosave',
        'checked',
        'disabled',
        'form',
        'formaction',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'formtarget',
        'height',
        'incremental',
        'inputmode',
        'list',
        'max',
        'maxlength',
        'min',
        'minlength',
        'multiple',
        'name',
        'pattern',
        'placeholder',
        'readonly',
        'required',
        'results',
        'selectionDirection',
        'size',
        'spellcheck',
        'src',
        'step',
        'tabindex',
        'value',
        'width',
        'x-moz-errormessage'
    ],
    output: [
        'for',
        'form',
        'name'
    ],
    progress: [
        'max',
        'value'
    ],
    label: [
        'accesskey',
        'for',
        'form'
    ],
    option: [
        'disabled',
        'label',
        'selected',
        'value'
    ],
    select: [
        'autofocus',
        'disabled',
        'multiple',
        'form',
        'multiple',
        'name',
        'required',
        'size'
    ],
    optgroup: [
        'disabled',
        'label'
    ],
    form: [
        'accept-charset',
        'action',
        'autocapitalize',
        'autocomplete',
        'enctype',
        'method',
        'name',
        'novalidate',
        'target'
    ]
};
exports.IGNORE_ATTRIBUTES = {
    'innerHTML': true,
    'hidden': true
};
var DomRenderer = (function () {
    function DomRenderer(_rootRenderer, componentProto, _animationDriver) {
        this._rootRenderer = _rootRenderer;
        this.componentProto = componentProto;
        this._animationDriver = _animationDriver;
        this._styles = _flattenStyles(componentProto.id, componentProto.styles, []);
        if (componentProto.encapsulation !== core_1.ViewEncapsulation.Native) {
            this._rootRenderer.sharedStylesHost.addStyles(this._styles);
        }
        if (this.componentProto.encapsulation === core_1.ViewEncapsulation.Emulated) {
            this._contentAttr = _shimContentAttribute(componentProto.id);
            this._hostAttr = _shimHostAttribute(componentProto.id);
        }
        else {
            this._contentAttr = null;
            this._hostAttr = null;
        }
    }
    DomRenderer.prototype.selectRootElement = function (selectorOrNode, debugInfo) {
    };
    DomRenderer.prototype.createElement = function (parent, name, debugInfo) {
        var nsAndName = splitNamespace(name);
        var el = helper_1.isPresent(nsAndName[0]) ?
            get_dom_1.getDOM().createElementNS(NAMESPACE_URIS[nsAndName[0]], nsAndName[1]) :
            get_dom_1.getDOM().createElement(nsAndName[1]);
        if (helper_1.isPresent(this._contentAttr)) {
            get_dom_1.getDOM().setAttribute(el, this._contentAttr, '');
        }
        if (helper_1.isPresent(parent)) {
            get_dom_1.getDOM().appendChild(parent, el);
        }
        return el;
    };
    DomRenderer.prototype.createViewRoot = function (hostElement) {
        var nodesParent;
        if (this.componentProto.encapsulation === core_1.ViewEncapsulation.Native) {
            nodesParent = get_dom_1.getDOM().createShadowRoot(hostElement);
            this._rootRenderer.sharedStylesHost.addHost(nodesParent);
            for (var i = 0; i < this._styles.length; i++) {
                get_dom_1.getDOM().appendChild(nodesParent, get_dom_1.getDOM().createStyleElement(this._styles[i]));
            }
        }
        else {
            if (helper_1.isPresent(this._hostAttr)) {
                get_dom_1.getDOM().setAttribute(hostElement, this._hostAttr, '');
            }
            nodesParent = hostElement;
        }
        return nodesParent;
    };
    DomRenderer.prototype.createTemplateAnchor = function (parentElement, debugInfo) {
        var comment = get_dom_1.getDOM().createComment(TEMPLATE_COMMENT_TEXT);
        if (helper_1.isPresent(parentElement)) {
            get_dom_1.getDOM().appendChild(parentElement, comment);
        }
        return comment;
    };
    DomRenderer.prototype.createText = function (parentElement, value, debugInfo) {
        var node = get_dom_1.getDOM().createTextNode(value);
        if (helper_1.isPresent(parentElement)) {
            get_dom_1.getDOM().appendChild(parentElement, node);
        }
        return node;
    };
    DomRenderer.prototype.projectNodes = function (parentElement, nodes) {
        if (helper_1.isBlank(parentElement)) {
            return;
        }
        appendNodes(parentElement, nodes);
    };
    DomRenderer.prototype.attachViewAfter = function (node, viewRootNodes) {
        moveNodesAfterSibling(node, viewRootNodes);
    };
    DomRenderer.prototype.detachView = function (viewRootNodes) {
        for (var i = 0; i < viewRootNodes.length; i++) {
            get_dom_1.getDOM().remove(viewRootNodes[i]);
        }
    };
    DomRenderer.prototype.destroyView = function (hostElement, viewAllNodes) {
        if (this.componentProto.encapsulation === core_1.ViewEncapsulation.Native && helper_1.isPresent(hostElement)) {
            this._rootRenderer.sharedStylesHost.removeHost(get_dom_1.getDOM().getShadowRoot(hostElement));
        }
    };
    DomRenderer.prototype.listen = function (renderElement, name, callback) {
        return this._rootRenderer.eventManager.addEventListener(renderElement, name, decoratePreventDefault(callback));
    };
    DomRenderer.prototype.listenGlobal = function (target, name, callback) {
        return this._rootRenderer.eventManager.addGlobalEventListener(target, name, decoratePreventDefault(callback));
    };
    DomRenderer.prototype.setElementProperty = function (renderElement, propertyName, propertyValue) {
        get_dom_1.getDOM().setProperty(renderElement, propertyName, propertyValue);
    };
    DomRenderer.prototype.setElementAttribute = function (renderElement, attributeName, attributeValue) {
        var attrNs;
        var nsAndName = splitNamespace(attributeName);
        if (helper_1.isPresent(nsAndName[0])) {
            attributeName = nsAndName[0] + ':' + nsAndName[1];
            attrNs = NAMESPACE_URIS[nsAndName[0]];
        }
        if (helper_1.isPresent(attributeValue)) {
            if (helper_1.isPresent(attrNs)) {
                get_dom_1.getDOM().setAttributeNS(renderElement, attrNs, attributeName, attributeValue);
            }
            else {
                get_dom_1.getDOM().setAttribute(renderElement, attributeName, attributeValue);
            }
        }
        else {
            if (helper_1.isPresent(attrNs)) {
                get_dom_1.getDOM().removeAttributeNS(renderElement, attrNs, nsAndName[1]);
            }
            else {
                get_dom_1.getDOM().removeAttribute(renderElement, attributeName);
            }
        }
    };
    DomRenderer.prototype.setBindingDebugInfo = function (renderElement, propertyName, propertyValue) {
        var dashCasedPropertyName = helper_1.camelCaseToDashCase(propertyName);
        if (get_dom_1.getDOM().isCommentNode(renderElement)) {
            var existingBindings = get_dom_1.getDOM().getText(renderElement)
                .replace(/\n/g, '')
                .match(TEMPLATE_BINDINGS_EXP);
            var parsedBindings = JSON.parse(existingBindings[1]);
            parsedBindings[dashCasedPropertyName] = propertyValue;
            get_dom_1.getDOM().setText(renderElement, TEMPLATE_COMMENT_TEXT.replace('{}', JSON.stringify(parsedBindings)));
        }
        else {
            this.setElementAttribute(renderElement, propertyName, propertyValue);
        }
    };
    DomRenderer.prototype.setElementClass = function (renderElement, className, isAdd) {
        if (isAdd) {
            get_dom_1.getDOM().addClass(renderElement, className);
        }
        else {
            get_dom_1.getDOM().removeClass(renderElement, className);
        }
    };
    DomRenderer.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
        if (helper_1.isPresent(styleValue)) {
            get_dom_1.getDOM().setStyle(renderElement, styleName, helper_1.stringify(styleValue));
        }
        else {
            get_dom_1.getDOM().removeStyle(renderElement, styleName);
        }
    };
    DomRenderer.prototype.invokeElementMethod = function (renderElement, methodName, args) {
        get_dom_1.getDOM().invoke(renderElement, methodName, args);
    };
    DomRenderer.prototype.setText = function (renderNode, text) {
        get_dom_1.getDOM().setText(renderNode, text);
    };
    DomRenderer.prototype.animate = function (element, startingStyles, keyframes, duration, delay, easing) {
        return this._animationDriver.animate(element, startingStyles, keyframes, duration, delay, easing);
    };
    return DomRenderer;
}());
exports.DomRenderer = DomRenderer;
var NodeDomRenderer = (function (_super) {
    __extends(NodeDomRenderer, _super);
    function NodeDomRenderer(_rootRenderer, _componentProto, _animationDriver) {
        if (_componentProto.encapsulation === core_1.ViewEncapsulation.Native) {
            _componentProto.encapsulation = core_1.ViewEncapsulation.Emulated;
        }
        _super.call(this, _rootRenderer, _componentProto, _animationDriver);
        this.__rootRenderer = _rootRenderer;
    }
    NodeDomRenderer.prototype.selectRootElement = function (selectorOrNode, debugInfo) {
        var el;
        if (typeof selectorOrNode === 'string') {
            el = get_dom_1.getDOM().querySelector(this.__rootRenderer.document, selectorOrNode);
            if (helper_1.isBlank(el)) {
                throw new Error("The selector \"" + selectorOrNode + "\" did not match any elements");
            }
        }
        else {
            el = selectorOrNode;
        }
        get_dom_1.getDOM().clearNodes(el);
        return el;
    };
    NodeDomRenderer.prototype._isObject = function (val) {
        if (val === null) {
            return false;
        }
        return ((typeof val === 'function') || (typeof val === 'object'));
    };
    NodeDomRenderer.prototype.setElementProperty = function (renderElement, propertyName, propertyValue) {
        if (this._isObject(propertyValue)) {
            propertyValue = JSON.stringify(propertyValue);
        }
        else if (typeof propertyValue === 'number') {
            propertyValue.toString();
        }
        if (propertyValue === null || propertyValue === undefined) {
            propertyValue = false;
            if (propertyName === 'innerHTML') {
                propertyValue = '';
            }
        }
        if ((propertyName === 'autofocus' || propertyName === 'spellcheck') && propertyValue === false) {
            return;
        }
        var setProp = _super.prototype.setElementProperty.call(this, renderElement, propertyName, propertyValue);
        if (exports.IGNORE_ATTRIBUTES[propertyName]) {
            return setProp;
        }
        var el = get_dom_1.getDOM().nodeName(renderElement);
        var attrList = exports.ATTRIBUTES[el];
        if (attrList) {
            var booleanAttr = helper_1.listContains(attrList, propertyName);
            if (booleanAttr) {
                if (propertyName === 'autocomplete') {
                    return this._setOnOffAttribute(renderElement, propertyName, propertyValue);
                }
                else if (propertyName === 'checked') {
                    return this._setCheckedAttribute(renderElement, propertyName, propertyValue);
                }
                else if (propertyName === 'disabled') {
                    return this._setDisabledAttribute(renderElement, propertyName, propertyValue);
                }
                else {
                    return this._setBooleanAttribute(renderElement, propertyName, propertyValue);
                }
            }
        }
        if (typeof propertyValue === 'string') {
            return _super.prototype.setElementAttribute.call(this, renderElement, propertyName, propertyValue);
        }
    };
    NodeDomRenderer.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
        var styleNameCased = helper_1.cssHyphenate(styleName);
        return _super.prototype.setElementStyle.call(this, renderElement, styleNameCased, styleValue);
    };
    NodeDomRenderer.prototype.invokeElementMethod = function (renderElement, methodName, args) {
        if (methodName === 'focus') {
            if (get_dom_1.getDOM().nodeName(renderElement) === 'input') {
                return _super.prototype.setElementAttribute.call(this, renderElement, 'autofocus', '');
            }
        }
        return _super.prototype.invokeElementMethod.call(this, location, methodName, args);
    };
    NodeDomRenderer.prototype._setDisabledAttribute = function (renderElement, propertyName, propertyValue) {
        if (helper_1.isPresent(propertyValue)) {
            if (propertyValue === true || propertyValue.toString() !== 'false') {
                return _super.prototype.setElementAttribute.call(this, renderElement, 'disabled', 'disabled');
            }
        }
    };
    NodeDomRenderer.prototype._setCheckedAttribute = function (renderElement, propertyName, propertyValue) {
        if (helper_1.isPresent(propertyValue)) {
            if (propertyValue === true) {
                return _super.prototype.setElementAttribute.call(this, renderElement, propertyValue, 'checked');
            }
            else if (propertyValue === false) {
                return _super.prototype.setElementAttribute.call(this, renderElement, propertyValue, '');
            }
        }
    };
    NodeDomRenderer.prototype._setOnOffAttribute = function (renderElement, propertyName, propertyValue) {
        if (helper_1.isPresent(propertyValue)) {
            if (propertyValue === true) {
                return _super.prototype.setElementAttribute.call(this, renderElement, propertyValue, 'on');
            }
            else if (propertyValue === false) {
                return _super.prototype.setElementAttribute.call(this, renderElement, propertyValue, 'off');
            }
        }
        return _super.prototype.setElementAttribute.call(this, renderElement, propertyName, propertyValue);
    };
    NodeDomRenderer.prototype._setBooleanAttribute = function (renderElement, propertyName, propertyValue) {
        if (helper_1.isPresent(propertyValue) && propertyValue !== false) {
            if (propertyValue === true) {
                return _super.prototype.setElementAttribute.call(this, renderElement, propertyName, '');
            }
            else {
                return _super.prototype.setElementAttribute.call(this, renderElement, propertyName, propertyValue);
            }
        }
        return _super.prototype.setElementAttribute.call(this, renderElement, propertyName, propertyValue);
    };
    return NodeDomRenderer;
}(DomRenderer));
exports.NodeDomRenderer = NodeDomRenderer;
function moveNodesAfterSibling(sibling, nodes) {
    var parent = get_dom_1.getDOM().parentElement(sibling);
    if (nodes.length > 0 && helper_1.isPresent(parent)) {
        var nextSibling = get_dom_1.getDOM().nextSibling(sibling);
        if (helper_1.isPresent(nextSibling)) {
            for (var i = 0; i < nodes.length; i++) {
                get_dom_1.getDOM().insertBefore(nextSibling, nodes[i]);
            }
        }
        else {
            for (var i = 0; i < nodes.length; i++) {
                get_dom_1.getDOM().appendChild(parent, nodes[i]);
            }
        }
    }
}
function appendNodes(parent, nodes) {
    for (var i = 0; i < nodes.length; i++) {
        get_dom_1.getDOM().appendChild(parent, nodes[i]);
    }
}
function decoratePreventDefault(eventHandler) {
    return function (event) {
        var allowDefaultBehavior = eventHandler(event);
        if (allowDefaultBehavior === false) {
            get_dom_1.getDOM().preventDefault(event);
        }
    };
}
var COMPONENT_REGEX = /%COMP%/g;
exports.COMPONENT_VARIABLE = '%COMP%';
exports.HOST_ATTR = "_nghost-" + exports.COMPONENT_VARIABLE;
exports.CONTENT_ATTR = "_ngcontent-" + exports.COMPONENT_VARIABLE;
function _shimContentAttribute(componentShortId) {
    return exports.CONTENT_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function _shimHostAttribute(componentShortId) {
    return exports.HOST_ATTR.replace(COMPONENT_REGEX, componentShortId);
}
function _flattenStyles(compId, styles, target) {
    for (var i = 0; i < styles.length; i++) {
        var style = styles[i];
        if (Array.isArray(style)) {
            _flattenStyles(compId, style, target);
        }
        else {
            style = style.replace(COMPONENT_REGEX, compId);
            target.push(style);
        }
    }
    return target;
}
var NS_PREFIX_RE = /^:([^:]+):(.+)$/;
function splitNamespace(name) {
    if (name[0] !== ':') {
        return [null, name];
    }
    var match = name.match(NS_PREFIX_RE);
    return [match[1], match[2]];
}
